// Enhanced Practice Test System
// File: lib/enhanced-practice-tests.ts
// Free features: localStorage, built-in analytics, offline support

'use client';

import { fileDb } from './file-database';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  subject: string;
  chapter?: string;
  marks: number;
  timeLimit?: number; // in seconds
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TestSet {
  id: string;
  title: string;
  description: string;
  subject: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  timeLimit: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  instructions: string[];
  tags: string[];
}

export interface TestAttempt {
  id: string;
  studentId: string;
  testSetId: string;
  answers: Record<string, number>; // questionId -> selectedOption
  score: number;
  percentage: number;
  timeSpent: number; // in seconds
  startedAt: string;
  completedAt?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  questionAnalysis: QuestionAnalysis[];
}

export interface QuestionAnalysis {
  questionId: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeTaken: number; // in seconds
  marksAwarded: number;
  difficulty: string;
  category: string;
}

export interface TestStatistics {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageTime: number;
  completionRate: number;
  difficultyPerformance: Record<string, number>;
  categoryPerformance: Record<string, number>;
  recentAttempts: TestAttempt[];
}

export interface StudentProgress {
  studentId: string;
  totalTests: number;
  completedTests: number;
  averageScore: number;
  improvementTrend: number; // percentage change
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
  studyStreak: number; // days
  lastTestDate: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'score' | 'streak' | 'completion' | 'improvement';
  condition: any;
  unlockedAt: string;
}

// Enhanced Practice Test Service
export class EnhancedPracticeTestService {
  // Test Management
  static async createTestSet(testData: Omit<TestSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestSet> {
    const testSet: TestSet = {
      ...testData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await fileDb.create('testSets', testSet);
    return testSet;
  }

  static async getTestSets(filters?: {
    subject?: string;
    category?: string;
    difficulty?: string;
    isActive?: boolean;
  }): Promise<TestSet[]> {
    const queryOptions: any = {};
    
    if (filters) {
      queryOptions.filters = {};
      if (filters.subject) queryOptions.filters.subject = filters.subject;
      if (filters.category) queryOptions.filters.category = filters.category;
      if (filters.difficulty) queryOptions.filters.difficulty = filters.difficulty;
      if (filters.isActive !== undefined) queryOptions.filters.isActive = filters.isActive;
    }

    return await fileDb.findMany<TestSet>('testSets', queryOptions);
  }

  static async getTestSet(id: string): Promise<TestSet | null> {
    return await fileDb.findById<TestSet>('testSets', id);
  }

  static async updateTestSet(id: string, updates: Partial<TestSet>): Promise<TestSet | null> {
    return await fileDb.update('testSets', id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  static async deleteTestSet(id: string): Promise<boolean> {
    return await fileDb.delete('testSets', id);
  }

  // Question Management
  static async addQuestion(testSetId: string, question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
    const testSet = await this.getTestSet(testSetId);
    if (!testSet) {
      throw new Error('Test set not found');
    }

    const newQuestion: Question = {
      ...question,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    testSet.questions.push(newQuestion);
    testSet.totalMarks = testSet.questions.reduce((sum, q) => sum + q.marks, 0);
    testSet.updatedAt = new Date().toISOString();

    await fileDb.update('testSets', testSetId, testSet);
    return newQuestion;
  }

  static async updateQuestion(testSetId: string, questionId: string, updates: Partial<Question>): Promise<Question | null> {
    const testSet = await this.getTestSet(testSetId);
    if (!testSet) {
      throw new Error('Test set not found');
    }

    const questionIndex = testSet.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      throw new Error('Question not found');
    }

    testSet.questions[questionIndex] = {
      ...testSet.questions[questionIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    testSet.totalMarks = testSet.questions.reduce((sum, q) => sum + q.marks, 0);
    testSet.updatedAt = new Date().toISOString();

    await fileDb.update('testSets', testSetId, testSet);
    return testSet.questions[questionIndex];
  }

  static async deleteQuestion(testSetId: string, questionId: string): Promise<boolean> {
    const testSet = await this.getTestSet(testSetId);
    if (!testSet) {
      throw new Error('Test set not found');
    }

    const questionIndex = testSet.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      return false;
    }

    testSet.questions.splice(questionIndex, 1);
    testSet.totalMarks = testSet.questions.reduce((sum, q) => sum + q.marks, 0);
    testSet.updatedAt = new Date().toISOString();

    await fileDb.update('testSets', testSetId, testSet);
    return true;
  }

  // Test Taking
  static async startTest(studentId: string, testSetId: string): Promise<TestAttempt> {
    const testSet = await this.getTestSet(testSetId);
    if (!testSet || !testSet.isActive) {
      throw new Error('Test not available');
    }

    const attempt: TestAttempt = {
      id: this.generateId(),
      studentId,
      testSetId,
      answers: {},
      score: 0,
      percentage: 0,
      timeSpent: 0,
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      questionAnalysis: []
    };

    await fileDb.create('testAttempts', attempt);
    return attempt;
  }

  static async submitAnswer(attemptId: string, questionId: string, selectedOption: number): Promise<void> {
    const attempt = await fileDb.findById<TestAttempt>('testAttempts', attemptId);
    if (!attempt || attempt.status !== 'in_progress') {
      throw new Error('Invalid test attempt');
    }

    attempt.answers[questionId] = selectedOption;
    await fileDb.update('testAttempts', attemptId, attempt);
  }

  static async completeTest(attemptId: string): Promise<TestAttempt> {
    const attempt = await fileDb.findById<TestAttempt>('testAttempts', attemptId);
    if (!attempt || attempt.status !== 'in_progress') {
      throw new Error('Invalid test attempt');
    }

    const testSet = await this.getTestSet(attempt.testSetId);
    if (!testSet) {
      throw new Error('Test set not found');
    }

    // Calculate score and analysis
    const analysis = this.calculateTestResults(testSet, attempt);
    
    const completedAttempt: TestAttempt = {
      ...attempt,
      ...analysis,
      completedAt: new Date().toISOString(),
      status: 'completed',
      timeSpent: Math.floor((new Date().getTime() - new Date(attempt.startedAt).getTime()) / 1000)
    };

    await fileDb.update('testAttempts', attemptId, completedAttempt);

    // Update student progress
    await this.updateStudentProgress(attempt.studentId, completedAttempt);

    // Check for achievements
    await this.checkAchievements(attempt.studentId, completedAttempt);

    return completedAttempt;
  }

  // Analytics and Reporting
  static async getTestStatistics(testSetId: string): Promise<TestStatistics> {
    const attempts = await fileDb.findMany<TestAttempt>('testAttempts', {
      filters: { testSetId, status: 'completed' }
    });

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        averageTime: 0,
        completionRate: 0,
        difficultyPerformance: {},
        categoryPerformance: {},
        recentAttempts: []
      };
    }

    const scores = attempts.map(a => a.score);
    const times = attempts.map(a => a.timeSpent);

    // Calculate performance by difficulty and category
    const difficultyPerformance: Record<string, number> = {};
    const categoryPerformance: Record<string, number> = {};

    attempts.forEach(attempt => {
      attempt.questionAnalysis.forEach(qa => {
        // Difficulty performance
        if (!difficultyPerformance[qa.difficulty]) {
          difficultyPerformance[qa.difficulty] = 0;
        }
        difficultyPerformance[qa.difficulty] += qa.isCorrect ? 1 : 0;

        // Category performance
        if (!categoryPerformance[qa.category]) {
          categoryPerformance[qa.category] = 0;
        }
        categoryPerformance[qa.category] += qa.isCorrect ? 1 : 0;
      });
    });

    // Convert to percentages
    Object.keys(difficultyPerformance).forEach(key => {
      const total = attempts.reduce((sum, a) => 
        sum + a.questionAnalysis.filter(qa => qa.difficulty === key).length, 0);
      difficultyPerformance[key] = Math.round((difficultyPerformance[key] / total) * 100);
    });

    Object.keys(categoryPerformance).forEach(key => {
      const total = attempts.reduce((sum, a) => 
        sum + a.questionAnalysis.filter(qa => qa.category === key).length, 0);
      categoryPerformance[key] = Math.round((categoryPerformance[key] / total) * 100);
    });

    return {
      totalAttempts: attempts.length,
      averageScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / attempts.length),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      averageTime: Math.round(times.reduce((sum, t) => sum + t, 0) / attempts.length),
      completionRate: 100, // All included attempts are completed
      difficultyPerformance,
      categoryPerformance,
      recentAttempts: attempts.slice(-10).reverse()
    };
  }

  static async getStudentProgress(studentId: string): Promise<StudentProgress> {
    const attempts = await fileDb.findMany<TestAttempt>('testAttempts', {
      filters: { studentId, status: 'completed' },
      sortBy: 'completedAt',
      sortOrder: 'desc'
    });

    if (attempts.length === 0) {
      return {
        studentId,
        totalTests: 0,
        completedTests: 0,
        averageScore: 0,
        improvementTrend: 0,
        weakAreas: [],
        strongAreas: [],
        recommendations: [],
        studyStreak: 0,
        lastTestDate: '',
        achievements: []
      };
    }

    // Calculate performance metrics
    const scores = attempts.map(a => a.percentage);
    const averageScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);

    // Calculate improvement trend (last 5 vs previous 5)
    let improvementTrend = 0;
    if (attempts.length >= 10) {
      const recent5 = scores.slice(0, 5);
      const previous5 = scores.slice(5, 10);
      const recentAvg = recent5.reduce((sum, s) => sum + s, 0) / recent5.length;
      const previousAvg = previous5.reduce((sum, s) => sum + s, 0) / previous5.length;
      improvementTrend = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
    }

    // Analyze weak and strong areas
    const categoryPerformance: Record<string, { correct: number; total: number }> = {};
    
    attempts.forEach(attempt => {
      attempt.questionAnalysis.forEach(qa => {
        if (!categoryPerformance[qa.category]) {
          categoryPerformance[qa.category] = { correct: 0, total: 0 };
        }
        categoryPerformance[qa.category].total++;
        if (qa.isCorrect) {
          categoryPerformance[qa.category].correct++;
        }
      });
    });

    const categoryResults = Object.entries(categoryPerformance).map(([category, perf]) => ({
      category,
      percentage: Math.round((perf.correct / perf.total) * 100)
    })).sort((a, b) => a.percentage - b.percentage);

    const weakAreas = categoryResults.filter(r => r.percentage < 60).map(r => r.category);
    const strongAreas = categoryResults.filter(r => r.percentage >= 80).map(r => r.category);

    // Generate recommendations
    const recommendations = this.generateRecommendations(weakAreas, strongAreas, improvementTrend);

    // Calculate study streak
    const studyStreak = this.calculateStudyStreak(attempts);

    // Get achievements
    const achievements = await this.getStudentAchievements(studentId);

    return {
      studentId,
      totalTests: attempts.length,
      completedTests: attempts.length,
      averageScore,
      improvementTrend,
      weakAreas,
      strongAreas,
      recommendations,
      studyStreak,
      lastTestDate: attempts[0]?.completedAt || '',
      achievements
    };
  }

  // Search and filtering
  static async searchQuestions(searchTerm: string, filters?: {
    subject?: string;
    category?: string;
    difficulty?: string;
  }): Promise<Question[]> {
    const testSets = await this.getTestSets(filters);
    const allQuestions = testSets.flatMap(ts => ts.questions);

    return allQuestions.filter(question => 
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      question.explanation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Offline support
  static async syncOfflineData(): Promise<void> {
    // This would sync any offline changes when connection is restored
    // For now, we'll just ensure data integrity
    const stats = fileDb.getStorageInfo();
    console.log('Storage status:', stats);
  }

  // Private helper methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static calculateTestResults(testSet: TestSet, attempt: TestAttempt): {
    score: number;
    percentage: number;
    questionAnalysis: QuestionAnalysis[];
  } {
    let totalScore = 0;
    const questionAnalysis: QuestionAnalysis[] = [];

    testSet.questions.forEach(question => {
      const selectedAnswer = attempt.answers[question.id];
      const isCorrect = selectedAnswer === question.correctAnswer;
      const marksAwarded = isCorrect ? question.marks : 0;

      totalScore += marksAwarded;

      questionAnalysis.push({
        questionId: question.id,
        selectedAnswer: selectedAnswer || -1,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeTaken: 0, // This would be tracked in a real implementation
        marksAwarded,
        difficulty: question.difficulty,
        category: question.category
      });
    });

    const percentage = Math.round((totalScore / testSet.totalMarks) * 100);

    return {
      score: totalScore,
      percentage,
      questionAnalysis
    };
  }

  private static async updateStudentProgress(studentId: string, attempt: TestAttempt): Promise<void> {
    // Update student progress tracking
    // This could be enhanced with more detailed analytics
  }

  private static async checkAchievements(studentId: string, attempt: TestAttempt): Promise<void> {
    const achievements: Achievement[] = [];

    // Check score-based achievements
    if (attempt.percentage >= 95) {
      achievements.push({
        id: this.generateId(),
        title: 'Perfect Score',
        description: 'Scored 95% or higher in a test',
        icon: '🏆',
        type: 'score',
        condition: { minScore: 95 },
        unlockedAt: new Date().toISOString()
      });
    }

    // Save achievements
    for (const achievement of achievements) {
      await fileDb.create('achievements', { studentId, ...achievement });
    }
  }

  private static generateRecommendations(weakAreas: string[], strongAreas: string[], trend: number): string[] {
    const recommendations: string[] = [];

    if (weakAreas.length > 0) {
      recommendations.push(`Focus on improving ${weakAreas.slice(0, 2).join(' and ')}`);
    }

    if (trend < 0) {
      recommendations.push('Consider reviewing fundamentals and taking more practice tests');
    } else if (trend > 10) {
      recommendations.push('Great improvement! Keep up the good work');
    }

    if (strongAreas.length > 0) {
      recommendations.push(`Maintain your strength in ${strongAreas[0]}`);
    }

    return recommendations;
  }

  private static calculateStudyStreak(attempts: TestAttempt[]): number {
    // Calculate consecutive days of test taking
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < attempts.length; i++) {
      const attemptDate = new Date(attempts[i].completedAt!);
      const daysDiff = Math.floor((today.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private static async getStudentAchievements(studentId: string): Promise<Achievement[]> {
    const achievements = await fileDb.findMany<Achievement & { studentId: string }>('achievements', {
      filters: { studentId }
    });
    
    return achievements.map(({ studentId, ...achievement }) => achievement);
  }
}

// Export default instance
export const practiceTestService = EnhancedPracticeTestService;
