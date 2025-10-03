import Dexie, { Table } from 'dexie';

export interface Verb {
  id?: number;
  infinitive_hu: string;
  infinitive_de: string;
  conjugation_type: string;
  difficulty: number;
  created_at: string;
}

export interface VerbConjugation {
  id?: number;
  verb_id: number;
  tense: string;
  person: string;
  form: string;
  is_formal: boolean;
}

export interface VocabularyWord {
  id?: number;
  word_hu: string;
  word_de: string;
  category?: string;
  difficulty: number;
  example_sentence_hu?: string;
  example_sentence_de?: string;
  created_at: string;
}

export interface UserProgress {
  id?: number;
  user_id: string;
  verb_id?: number;
  vocabulary_word_id?: number;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_date: string;
  correct_answers: number;
  total_attempts: number;
  last_reviewed: string;
  exercise_type?: string;
  difficulty_rating?: number;
}

export interface LearningSession {
  id?: number;
  user_id: string;
  session_type: string;
  started_at: string;
  ended_at?: string;
  total_questions: number;
  correct_answers: number;
  session_duration_minutes?: number;
}

export interface PendingSync {
  id?: number;
  type: 'progress_update' | 'session_complete' | 'new_progress';
  data: any;
  created_at: string;
  synced: boolean;
}

export class MagyulDB extends Dexie {
  verbs!: Table<Verb>;
  verbConjugations!: Table<VerbConjugation>;
  vocabularyWords!: Table<VocabularyWord>;
  userProgress!: Table<UserProgress>;
  learningSessions!: Table<LearningSession>;
  pendingSync!: Table<PendingSync>;

  constructor() {
    super('MagyulDB');
    
    this.version(1).stores({
      verbs: '++id, infinitive_hu, infinitive_de, conjugation_type, difficulty',
      verbConjugations: '++id, verb_id, tense, person, form, is_formal',
      vocabularyWords: '++id, word_hu, word_de, category, difficulty',
      userProgress: '++id, user_id, verb_id, vocabulary_word_id, next_review_date, exercise_type',
      learningSessions: '++id, user_id, session_type, started_at',
      pendingSync: '++id, type, created_at, synced'
    });
  }

  // Offline-first methods
  async getVerbsOffline(): Promise<Verb[]> {
    return this.verbs.toArray();
  }

  async getVocabularyOffline(): Promise<VocabularyWord[]> {
    return this.vocabularyWords.toArray();
  }

  async getVerbConjugationsOffline(verbId: number): Promise<VerbConjugation[]> {
    return this.verbConjugations.where('verb_id').equals(verbId).toArray();
  }

  async getUserProgressOffline(userId: string = 'default_user'): Promise<UserProgress[]> {
    return this.userProgress.where('user_id').equals(userId).toArray();
  }

  async getDueItemsOffline(userId: string = 'default_user'): Promise<UserProgress[]> {
    const now = new Date().toISOString();
    return this.userProgress
      .where('user_id').equals(userId)
      .and(progress => progress.next_review_date <= now)
      .toArray();
  }

  async updateProgressOffline(progressUpdate: Partial<UserProgress>): Promise<void> {
    if (progressUpdate.id) {
      await this.userProgress.update(progressUpdate.id, progressUpdate);
      
      // Add to pending sync queue
      await this.pendingSync.add({
        type: 'progress_update',
        data: progressUpdate,
        created_at: new Date().toISOString(),
        synced: false
      });
    }
  }

  async addProgressOffline(progress: UserProgress): Promise<void> {
    await this.userProgress.add(progress);
    
    // Add to pending sync queue
    await this.pendingSync.add({
      type: 'new_progress',
      data: progress,
      created_at: new Date().toISOString(),
      synced: false
    });
  }

  async completeSessionOffline(session: LearningSession): Promise<void> {
    if (session.id) {
      await this.learningSessions.update(session.id, session);
    } else {
      await this.learningSessions.add(session);
    }
    
    // Add to pending sync queue
    await this.pendingSync.add({
      type: 'session_complete',
      data: session,
      created_at: new Date().toISOString(),
      synced: false
    });
  }

  async getPendingSyncItems(): Promise<PendingSync[]> {
    return this.pendingSync.where('synced').equals(0).toArray();
  }

  async markSyncComplete(syncId: number): Promise<void> {
    await this.pendingSync.update(syncId, { synced: true });
  }

  // Cache management
  async cacheVerbs(verbs: Verb[]): Promise<void> {
    await this.verbs.clear();
    await this.verbs.bulkAdd(verbs);
  }

  async cacheVocabulary(words: VocabularyWord[]): Promise<void> {
    await this.vocabularyWords.clear();
    await this.vocabularyWords.bulkAdd(words);
  }

  async cacheVerbConjugations(conjugations: VerbConjugation[]): Promise<void> {
    await this.verbConjugations.clear();
    await this.verbConjugations.bulkAdd(conjugations);
  }

  async cacheUserProgress(progress: UserProgress[]): Promise<void> {
    await this.userProgress.clear();
    await this.userProgress.bulkAdd(progress);
  }

  // Data synchronization status
  async getLastSyncTime(): Promise<string | null> {
    const lastSession = await this.learningSessions
      .orderBy('started_at')
      .reverse()
      .first();
    return lastSession?.started_at || null;
  }

  async clearAllData(): Promise<void> {
    await Promise.all([
      this.verbs.clear(),
      this.verbConjugations.clear(),
      this.vocabularyWords.clear(),
      this.userProgress.clear(),
      this.learningSessions.clear(),
      this.pendingSync.clear()
    ]);
  }
}

export const db = new MagyulDB();