import { db } from '../db/database';

// Local storage keys for progress tracking
const PROGRESS_KEY = 'magyul_progress';
const SETTINGS_KEY = 'magyul_settings';

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

// Mock network connectivity
const isOnline = navigator.onLine;

class ApiService {
  private static vocabularyData: VocabularyWord[] = [];
  private static verbData: Verb[] = [];
  private static initialized = false;

  // Initialize data from JSON files
  static async initialize() {
    if (this.initialized) return;
    
    try {
      // Load vocabulary data
      const vocabResponse = await fetch('/data/vocabulary.json');
      this.vocabularyData = await vocabResponse.json();
      
      // Load verb data
      const verbResponse = await fetch('/data/verbs.json');
      this.verbData = await verbResponse.json();
      
      this.initialized = true;
      console.log('ApiService initialized with local data');
    } catch (error) {
      console.error('Failed to initialize local data:', error);
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

  // Vocabulary API methods
  static async getVocabularyExercise() {
    await this.initialize();
    
    if (this.vocabularyData.length === 0) {
      throw new Error('No vocabulary data available');
    }

    // Pick a random word
    const word = this.vocabularyData[Math.floor(Math.random() * this.vocabularyData.length)];
    
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

    const verb = this.verbData[Math.floor(Math.random() * this.verbData.length)];
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
    
    for (const [key, progress] of Object.entries(allProgress)) {
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
