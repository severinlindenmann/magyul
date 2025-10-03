// Local storage keys for progress tracking
const PROGRESS_KEY = 'magyul_progress';

// Types for our local data
interface VocabularyWord {
  id: number;
  word_hu: string;
  word_de: string;
  category: string;
  example_sentence_hu: string;
  example_sentence_de: string;
}

interface Verb {
  id: number;
  infinitive: string;
  meaning_de: string;
  category: string;
  conjugations: {
    present: Record<string, string>;
    past: Record<string, string>;
    future: Record<string, string>;
  };
}

interface NumberWord {
  id: number;
  number: number;
  word_hu: string;
  word_en: string;
  word_de: string;
}

interface UserProgress {
  wordId: number;
  exerciseType: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewed: string;
  correctAnswers: number;
  totalAnswers: number;
}

// Session-based word cycling for smart repetition
interface WordCycleState {
  wordId: number;
  skipCount: number; // How many times to skip this word
  wrongCount: number; // Track consecutive wrong answers
}

class ApiService {
  // Debug mode - set to true to enable detailed cycle logging
  private static DEBUG_CYCLE = false;
  
  private static vocabularyData: VocabularyWord[] = [];
  private static verbData: Verb[] = [];
  private static numbersData: NumberWord[] = [];
  private static initialized = false;
  
  // Session-based cycling (resets on page refresh)
  private static vocabularyCycle: WordCycleState[] = [];
  private static verbCycle: WordCycleState[] = [];
  private static vocabularyUsedInSession: Set<number> = new Set();
  private static verbUsedInSession: Set<number> = new Set();
  
  // Helper method for debug logging
  private static debugLog(...args: any[]) {
    if (this.DEBUG_CYCLE) {
      console.log(...args);
    }
  }

  // Initialize data from JSON files
  static async initialize() {
    if (this.initialized) return;
    
    try {
      // Load vocabulary data from multiple files (1-20)
      const vocabularyFiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      const vocabularyPromises = vocabularyFiles.map(async (fileNum) => {
        const response = await fetch(`/data/vocabulary/${fileNum}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch vocabulary file ${fileNum}: ${response.status}`);
        }
        const text = await response.text();
        if (!text || text.trim() === '') {
          throw new Error(`Vocabulary file ${fileNum} is empty`);
        }
        return JSON.parse(text);
      });
      
      const vocabularyChunks = await Promise.all(vocabularyPromises);
      this.vocabularyData = vocabularyChunks.flat();
      
      console.log(`Loaded ${this.vocabularyData.length} vocabulary words from ${vocabularyFiles.length} files`);
      
      // Load verb data
      const verbResponse = await fetch('/data/verbs.json');
      if (!verbResponse.ok) {
        throw new Error(`Failed to fetch verbs: ${verbResponse.status}`);
      }
      const verbText = await verbResponse.text();
      if (!verbText || verbText.trim() === '') {
        throw new Error('Verb data is empty');
      }
      this.verbData = JSON.parse(verbText);
      
      // Load numbers data
      const numbersResponse = await fetch('/data/numbers.json');
      if (!numbersResponse.ok) {
        throw new Error(`Failed to fetch numbers: ${numbersResponse.status}`);
      }
      const numbersText = await numbersResponse.text();
      if (!numbersText || numbersText.trim() === '') {
        throw new Error('Numbers data is empty');
      }
      this.numbersData = JSON.parse(numbersText);
      
      this.initialized = true;
      console.log('ApiService initialized with local data');
    } catch (error) {
      console.error('Failed to initialize local data:', error);
      // Initialize with empty arrays to prevent crashes
      if (!this.vocabularyData) this.vocabularyData = [];
      if (!this.verbData) this.verbData = [];
      if (!this.numbersData) this.numbersData = [];
    }
  }

  // Progress management using localStorage
  static getProgress(): Record<string, UserProgress> {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  static saveProgress(progress: Record<string, UserProgress>) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }

  static getProgressForWord(wordId: number, exerciseType: string = 'translation'): UserProgress | null {
    const allProgress = this.getProgress();
    const key = `${wordId}_${exerciseType}`;
    return allProgress[key] || null;
  }

  static updateProgressForWord(wordId: number, quality: number, exerciseType: string = 'translation') {
    const allProgress = this.getProgress();
    const key = `${wordId}_${exerciseType}`;
    
    let progress = allProgress[key];
    
    if (!progress) {
      // Create new progress entry
      progress = {
        wordId,
        exerciseType,
        easeFactor: 2.5,
        intervalDays: 1,
        repetitions: 0,
        nextReviewDate: new Date().toISOString(),
        lastReviewed: new Date().toISOString(),
        correctAnswers: 0,
        totalAnswers: 0
      };
    }

    // Update progress using simplified SM-2 algorithm
    progress.totalAnswers++;
    if (quality >= 3) {
      progress.correctAnswers++;
      progress.repetitions++;
      
      if (progress.repetitions === 1) {
        progress.intervalDays = 1;
      } else if (progress.repetitions === 2) {
        progress.intervalDays = 6;
      } else {
        progress.intervalDays = Math.round(progress.intervalDays * progress.easeFactor);
      }
      
      progress.easeFactor = Math.max(1.3, progress.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    } else {
      progress.repetitions = 0;
      progress.intervalDays = 1;
    }

    // Set next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + progress.intervalDays);
    progress.nextReviewDate = nextReview.toISOString();
    progress.lastReviewed = new Date().toISOString();

    allProgress[key] = progress;
    this.saveProgress(allProgress);
    
    return progress;
  }

  // Smart word cycling methods
  static markWordResult(wordId: number, isCorrect: boolean, type: 'vocabulary' | 'verb') {
    const cycle = type === 'vocabulary' ? this.vocabularyCycle : this.verbCycle;
    const used = type === 'vocabulary' ? this.vocabularyUsedInSession : this.verbUsedInSession;
    
    this.debugLog(`[CYCLE] Before markWordResult - wordId: ${wordId}, isCorrect: ${isCorrect}`);
    this.debugLog('[CYCLE] Current cycle state:', cycle.map(s => ({ id: s.wordId, skip: s.skipCount })));
    
    // Decrease skip counts for all other words (except those with infinite skip)
    // This ensures a word answered wrong comes back after 2 OTHER words are shown
    cycle.forEach(state => {
      if (state.wordId !== wordId && state.skipCount > 0 && state.skipCount !== Number.MAX_SAFE_INTEGER) {
        this.debugLog(`[CYCLE] Decrementing skip count for word ${state.wordId}: ${state.skipCount} -> ${state.skipCount - 1}`);
        state.skipCount--;
      }
    });
    
    used.add(wordId);
    
    let state = cycle.find(s => s.wordId === wordId);
    if (!state) {
      state = { wordId, skipCount: 0, wrongCount: 0 };
      cycle.push(state);
      this.debugLog(`[CYCLE] Created new state for word ${wordId}`);
    }
    
    if (isCorrect) {
      // Correct answer: mark to skip for the rest of the session (never bring back)
      state.skipCount = Number.MAX_SAFE_INTEGER; // Effectively infinite - never show again this session
      state.wrongCount = 0;
      this.debugLog(`[CYCLE] Word ${wordId} answered CORRECTLY - skipCount set to MAX (never show again)`);
    } else {
      // Wrong answer: bring back after 2 OTHER words are shown
      state.skipCount = 2;
      state.wrongCount++;
      this.debugLog(`[CYCLE] Word ${wordId} answered WRONG - skipCount set to 2 (show after 2 new words)`);
    }
    
    this.debugLog('[CYCLE] After markWordResult:', cycle.map(s => ({ id: s.wordId, skip: s.skipCount })));
  }
  
  static getAvailableWords(type: 'vocabulary' | 'verb'): number[] {
    const data = type === 'vocabulary' ? this.vocabularyData : this.verbData;
    const cycle = type === 'vocabulary' ? this.vocabularyCycle : this.verbCycle;
    const used = type === 'vocabulary' ? this.vocabularyUsedInSession : this.verbUsedInSession;
    
    this.debugLog('[CYCLE] getAvailableWords called');
    this.debugLog('[CYCLE] Current cycle state:', cycle.map(s => ({ id: s.wordId, skip: s.skipCount })));
    
    // First priority: words that need to be retested (skipCount = 0 and wrongCount > 0)
    const retestWords: number[] = [];
    cycle.forEach(state => {
      if (state.skipCount === 0 && state.wrongCount > 0) {
        retestWords.push(state.wordId);
        this.debugLog(`[CYCLE] Word ${state.wordId} needs RETEST (was answered wrong before)`);
      }
    });
    
    // If we have words that need retesting, return ONLY those
    if (retestWords.length > 0) {
      this.debugLog('[CYCLE] Returning retest words:', retestWords);
      return retestWords;
    }
    
    // Otherwise, get all available words (skipCount === 0 or not in cycle yet)
    const availableIds = new Set(data.map(w => w.id));
    
    cycle.forEach(state => {
      if (state.skipCount > 0) {
        availableIds.delete(state.wordId);
        this.debugLog(`[CYCLE] Removed word ${state.wordId} (skipCount = ${state.skipCount})`);
      }
    });
    
    this.debugLog('[CYCLE] Available word IDs (first 20):', Array.from(availableIds).slice(0, 20));
    this.debugLog('[CYCLE] Total available:', availableIds.size);
    
    // If all words used and no available words, reset the cycle (start new round)
    // But preserve correctly answered words (those with MAX_SAFE_INTEGER)
    if (availableIds.size === 0) {
      this.debugLog('[CYCLE] No available words - resetting cycle (preserving correct answers)');
      // Reset only the words that were wrong or not yet tried
      cycle.forEach(state => {
        if (state.skipCount !== Number.MAX_SAFE_INTEGER) {
          state.skipCount = 0;
        }
      });
      
      // Recalculate available IDs
      availableIds.clear();
      data.forEach(w => availableIds.add(w.id));
      cycle.forEach(state => {
        if (state.skipCount > 0) {
          availableIds.delete(state.wordId);
        }
      });
      
      // If still no words available (all answered correctly), reset everything for a new session
      if (availableIds.size === 0) {
        this.debugLog('[CYCLE] All words answered correctly - full reset');
        cycle.length = 0;
        used.clear();
        return data.map(w => w.id);
      }
    }
    
    return Array.from(availableIds);
  }

  // Vocabulary API methods
  static async getVocabularyExercise() {
    await this.initialize();
    
    if (this.vocabularyData.length === 0) {
      throw new Error('No vocabulary data available');
    }

    // Get available word IDs with smart cycling
    const availableIds = this.getAvailableWords('vocabulary');
    const availableWords = this.vocabularyData.filter(w => availableIds.includes(w.id));
    
    if (availableWords.length === 0) {
      // Fallback to any word if cycling logic fails
      const word = this.vocabularyData[Math.floor(Math.random() * this.vocabularyData.length)];
      return { word };
    }

    // Pick a random word from available words
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    // Generate different exercise types
    const exerciseTypes = ['hu_to_de', 'de_to_hu'];
    if (word.example_sentence_hu) {
      exerciseTypes.push('example_completion');
    }
    
    const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    
    let instruction: string;
    let correctAnswer: string;
    
    if (exerciseType === 'hu_to_de') {
      instruction = `Translate to German: ${word.word_hu}`;
      correctAnswer = word.word_de;
    } else if (exerciseType === 'de_to_hu') {
      instruction = `Translate to Hungarian: ${word.word_de}`;
      correctAnswer = word.word_hu;
    } else { // example_completion
      const example = word.example_sentence_hu.replace(word.word_hu, '___');
      instruction = `Complete the sentence: ${example}`;
      correctAnswer = word.word_hu;
    }
    
    return {
      exercise_id: `${word.id}_${exerciseType}`,
      word,
      exercise_type: exerciseType,
      instruction,
      correct_answer: correctAnswer // For debugging - remove in production
    };
  }

  static async checkVocabularyAnswer(exerciseId: string, userAnswer: string) {
    await this.initialize();
    
    try {
      const parts = exerciseId.split('_');
      const wordId = parseInt(parts[0]);
      const exerciseType = parts.slice(1).join('_');
      
      const word = this.vocabularyData.find(w => w.id === wordId);
      if (!word) {
        throw new Error('Word not found');
      }

      let correctAnswer: string;
      if (exerciseType === 'hu_to_de') {
        correctAnswer = word.word_de;
      } else if (exerciseType === 'de_to_hu') {
        correctAnswer = word.word_hu;
      } else { // example_completion
        correctAnswer = word.word_hu;
      }

      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      
      return {
        is_correct: isCorrect,
        correct_answer: correctAnswer,
        user_answer: userAnswer,
        word
      };
    } catch (error) {
      console.error('Error checking vocabulary answer:', error);
      return {
        is_correct: false,
        correct_answer: 'Unknown',
        user_answer: userAnswer,
        word: null
      };
    }
  }

  // Verb conjugation API methods
  static async getConjugationExercise() {
    await this.initialize();
    
    if (this.verbData.length === 0) {
      throw new Error('No verb data available');
    }

    // Get available verb IDs with smart cycling
    const availableIds = this.getAvailableWords('verb');
    const availableVerbs = this.verbData.filter(v => availableIds.includes(v.id));
    
    const verb = availableVerbs.length > 0
      ? availableVerbs[Math.floor(Math.random() * availableVerbs.length)]
      : this.verbData[Math.floor(Math.random() * this.verbData.length)];
    
    const tenses = ['present', 'past', 'future'];
    const persons = ['en', 'te', 'o', 'mi', 'ti', 'ok'];
    
    const tense = tenses[Math.floor(Math.random() * tenses.length)];
    const person = persons[Math.floor(Math.random() * persons.length)];
    
    const personLabels = {
      'en': 'ich (én)',
      'te': 'du (te)', 
      'o': 'er/sie/es (ő)',
      'mi': 'wir (mi)',
      'ti': 'ihr (ti)',
      'ok': 'sie (ők)'
    };
    
    const tenseLabels = {
      'present': 'Present',
      'past': 'Past',
      'future': 'Future'
    };

    const correctAnswer = verb.conjugations[tense as keyof typeof verb.conjugations][person];
    const instruction = `Conjugate "${verb.infinitive}" (${verb.meaning_de}) for ${personLabels[person as keyof typeof personLabels]} in ${tenseLabels[tense as keyof typeof tenseLabels]}`;

    return {
      exercise_id: `${verb.id}_${tense}_${person}`,
      verb,
      tense,
      person,
      instruction,
      correct_answer: correctAnswer
    };
  }

  static async checkConjugationAnswer(exerciseId: string, userAnswer: string) {
    await this.initialize();
    
    try {
      const parts = exerciseId.split('_');
      const verbId = parseInt(parts[0]);
      const tense = parts[1];
      const person = parts[2];
      
      const verb = this.verbData.find(v => v.id === verbId);
      if (!verb) {
        throw new Error('Verb not found');
      }

      const correctAnswer = verb.conjugations[tense as keyof typeof verb.conjugations][person];
      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      
      return {
        is_correct: isCorrect,
        correct_answer: correctAnswer,
        user_answer: userAnswer,
        verb
      };
    } catch (error) {
      console.error('Error checking conjugation answer:', error);
      return {
        is_correct: false,
        correct_answer: 'Unknown',
        user_answer: userAnswer,
        verb: null
      };
    }
  }

  // Progress API methods
  static async updateProgress(
    wordId: number, 
    quality: number, 
    exerciseType: string = 'translation'
  ) {
    const progress = this.updateProgressForWord(wordId, quality, exerciseType);
    
    return {
      message: 'Progress updated successfully',
      progress,
      next_review: progress.nextReviewDate,
      quality
    };
  }

  static async getDueItems(userId: string = 'default_user') {
    await this.initialize();
    
    const allProgress = this.getProgress();
    const now = new Date();
    const dueItems = [];
    
    for (const progress of Object.values(allProgress)) {
      const nextReview = new Date(progress.nextReviewDate);
      if (nextReview <= now) {
        const word = this.vocabularyData.find(w => w.id === progress.wordId);
        if (word) {
          dueItems.push({
            type: 'vocabulary',
            item: word,
            progress,
            exercise_type: progress.exerciseType
          });
        }
      }
    }
    
    return { due_items: dueItems, count: dueItems.length };
  }

  // Statistics
  static getStatistics() {
    const allProgress = this.getProgress();
    const stats = {
      totalWords: this.vocabularyData.length,
      studiedWords: Object.keys(allProgress).length,
      totalAnswers: 0,
      correctAnswers: 0,
      accuracy: 0,
      streakDays: 0
    };
    
    for (const progress of Object.values(allProgress)) {
      stats.totalAnswers += progress.totalAnswers;
      stats.correctAnswers += progress.correctAnswers;
    }
    
    if (stats.totalAnswers > 0) {
      stats.accuracy = Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
    }
    
    return stats;
  }
}

export default ApiService;
// Named exports for convenience
export const getVocabularyExercise = () => ApiService.getVocabularyExercise();
export const checkVocabularyAnswer = (wordId: number, userAnswer: string) => {
  // Simple check against vocabulary data
  const word = ApiService['vocabularyData'].find((w: any) => w.id === wordId);
  if (!word) return false;
  return userAnswer.trim().toLowerCase() === word.word_de.trim().toLowerCase();
};
export const getConjugationExercise = () => ApiService.getConjugationExercise();
export const markWordResult = (wordId: number, isCorrect: boolean, type: 'vocabulary' | 'verb') => 
  ApiService.markWordResult(wordId, isCorrect, type);
