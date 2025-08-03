// Enhanced Leaderboard System for BD Library Practice Tests

export interface LeaderboardEntry {
  id: string;
  studentId: string;
  studentName: string;
  testId: string;
  testName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeSpent: number; // in minutes
  attemptDate: string;
  rank: number;
  badge?: 'gold' | 'silver' | 'bronze';
  streak?: number;
  category: string;
  shift: 'morning' | 'afternoon' | 'evening';
}

export interface CompetitionEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  testIds: string[];
  prizes: Array<{
    rank: number;
    prize: string;
    description: string;
  }>;
  isActive: boolean;
  participants: string[];
  leaderboard: LeaderboardEntry[];
}

export interface StudentAchievement {
  id: string;
  studentId: string;
  type: 'badge' | 'milestone' | 'streak' | 'competition';
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  points: number;
  category?: string;
}

export interface StudentStats {
  studentId: string;
  totalTestsAttempted: number;
  totalScore: number;
  averagePercentage: number;
  bestScore: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number; // in minutes
  strongSubjects: string[];
  weakSubjects: string[];
  monthlyProgress: Array<{
    month: string;
    testsAttempted: number;
    averageScore: number;
  }>;
  achievements: StudentAchievement[];
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
}

// Leaderboard Functions
export const getLeaderboardData = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('leaderboard_data');
  return data ? JSON.parse(data) : [];
};

export const saveLeaderboardEntry = (entry: LeaderboardEntry): void => {
  if (typeof window === 'undefined') return;
  const leaderboard = getLeaderboardData();
  const existingIndex = leaderboard.findIndex(e => e.id === entry.id);
  
  if (existingIndex >= 0) {
    leaderboard[existingIndex] = entry;
  } else {
    leaderboard.push(entry);
  }
  
  localStorage.setItem('leaderboard_data', JSON.stringify(leaderboard));
};

export const createLeaderboardEntry = (
  studentId: string,
  studentName: string,
  testId: string,
  testName: string,
  score: number,
  totalMarks: number,
  timeSpent: number,
  category: string,
  shift: 'morning' | 'afternoon' | 'evening'
): LeaderboardEntry => {
  const percentage = (score / totalMarks) * 100;
  
  return {
    id: `lb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    studentName,
    testId,
    testName,
    score,
    totalMarks,
    percentage,
    timeSpent,
    attemptDate: new Date().toISOString(),
    rank: 0, // Will be calculated
    category,
    shift
  };
};

export const calculateRanks = (entries: LeaderboardEntry[]): LeaderboardEntry[] => {
  // Sort by percentage (desc), then by time spent (asc) for tie-breaking
  const sorted = entries.sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return a.timeSpent - b.timeSpent;
  });

  // Assign ranks
  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : undefined
  }));
};

export const getLeaderboardByCategory = (category?: string, limit: number = 50): LeaderboardEntry[] => {
  let leaderboard = getLeaderboardData();
  
  if (category && category !== 'all') {
    leaderboard = leaderboard.filter(entry => entry.category.toLowerCase() === category.toLowerCase());
  }
  
  // Group by student and keep only their best attempt for each test
  const bestAttempts = new Map<string, LeaderboardEntry>();
  
  leaderboard.forEach(entry => {
    const key = `${entry.studentId}_${entry.testId}`;
    const existing = bestAttempts.get(key);
    
    if (!existing || entry.percentage > existing.percentage || 
        (entry.percentage === existing.percentage && entry.timeSpent < existing.timeSpent)) {
      bestAttempts.set(key, entry);
    }
  });
  
  const uniqueEntries = Array.from(bestAttempts.values());
  const rankedEntries = calculateRanks(uniqueEntries);
  
  return rankedEntries.slice(0, limit);
};

export const getLeaderboardByShift = (shift: string, category?: string): LeaderboardEntry[] => {
  let leaderboard = getLeaderboardData();
  
  leaderboard = leaderboard.filter(entry => entry.shift === shift);
  
  if (category && category !== 'all') {
    leaderboard = leaderboard.filter(entry => entry.category.toLowerCase() === category.toLowerCase());
  }
  
  return calculateRanks(leaderboard);
};

export const getWeeklyLeaderboard = (category?: string): LeaderboardEntry[] => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  let leaderboard = getLeaderboardData();
  
  leaderboard = leaderboard.filter(entry => 
    new Date(entry.attemptDate) >= oneWeekAgo
  );
  
  if (category && category !== 'all') {
    leaderboard = leaderboard.filter(entry => entry.category.toLowerCase() === category.toLowerCase());
  }
  
  return calculateRanks(leaderboard);
};

export const getMonthlyLeaderboard = (category?: string): LeaderboardEntry[] => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  let leaderboard = getLeaderboardData();
  
  leaderboard = leaderboard.filter(entry => 
    new Date(entry.attemptDate) >= oneMonthAgo
  );
  
  if (category && category !== 'all') {
    leaderboard = leaderboard.filter(entry => entry.category.toLowerCase() === category.toLowerCase());
  }
  
  return calculateRanks(leaderboard);
};

export const getStudentRank = (studentId: string, category?: string): number => {
  const leaderboard = getLeaderboardByCategory(category);
  const studentEntry = leaderboard.find(entry => entry.studentId === studentId);
  return studentEntry ? studentEntry.rank : 0;
};

export const getStudentStats = (studentId: string): StudentStats => {
  const leaderboard = getLeaderboardData();
  const studentEntries = leaderboard.filter(entry => entry.studentId === studentId);
  
  if (studentEntries.length === 0) {
    return {
      studentId,
      totalTestsAttempted: 0,
      totalScore: 0,
      averagePercentage: 0,
      bestScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalTimeSpent: 0,
      strongSubjects: [],
      weakSubjects: [],
      monthlyProgress: [],
      achievements: getStudentAchievements(studentId),
      totalPoints: 0,
      level: 1,
      nextLevelPoints: 100
    };
  }
  
  const totalTestsAttempted = studentEntries.length;
  const totalScore = studentEntries.reduce((sum, entry) => sum + entry.score, 0);
  const averagePercentage = studentEntries.reduce((sum, entry) => sum + entry.percentage, 0) / totalTestsAttempted;
  const bestScore = Math.max(...studentEntries.map(entry => entry.percentage));
  const totalTimeSpent = studentEntries.reduce((sum, entry) => sum + entry.timeSpent, 0);
  
  // Calculate streak
  const sortedEntries = studentEntries.sort((a, b) => new Date(b.attemptDate).getTime() - new Date(a.attemptDate).getTime());
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < sortedEntries.length; i++) {
    if (sortedEntries[i].percentage >= 60) { // Consider 60% as passing
      tempStreak++;
      if (i === 0) currentStreak = tempStreak;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
      if (i === 0) currentStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // Subject analysis would require test metadata
  const strongSubjects: string[] = [];
  const weakSubjects: string[] = [];
  
  // Monthly progress
  const monthlyProgress = calculateMonthlyProgress(studentEntries);
  
  // Calculate points and level
  const totalPoints = calculateStudentPoints(studentId);
  const level = Math.floor(totalPoints / 1000) + 1;
  const nextLevelPoints = (level * 1000) - totalPoints;
  
  return {
    studentId,
    totalTestsAttempted,
    totalScore,
    averagePercentage,
    bestScore,
    currentStreak,
    longestStreak,
    totalTimeSpent,
    strongSubjects,
    weakSubjects,
    monthlyProgress,
    achievements: getStudentAchievements(studentId),
    totalPoints,
    level,
    nextLevelPoints
  };
};

export const calculateMonthlyProgress = (entries: LeaderboardEntry[]): Array<{month: string; testsAttempted: number; averageScore: number}> => {
  const monthlyData = new Map<string, {total: number; count: number}>();
  
  entries.forEach(entry => {
    const month = new Date(entry.attemptDate).toLocaleString('default', { month: 'long', year: 'numeric' });
    const existing = monthlyData.get(month) || {total: 0, count: 0};
    monthlyData.set(month, {
      total: existing.total + entry.percentage,
      count: existing.count + 1
    });
  });
  
  return Array.from(monthlyData.entries()).map(([month, data]) => ({
    month,
    testsAttempted: data.count,
    averageScore: data.total / data.count
  }));
};

export const calculateStudentPoints = (studentId: string): number => {
  const leaderboard = getLeaderboardData();
  const achievements = getStudentAchievements(studentId);
  
  const testPoints = leaderboard
    .filter(entry => entry.studentId === studentId)
    .reduce((sum, entry) => sum + Math.floor(entry.percentage), 0);
  
  const achievementPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  
  return testPoints + achievementPoints;
};

// Competition Events
export const getCompetitionEvents = (): CompetitionEvent[] => {
  if (typeof window === 'undefined') return [];
  const events = localStorage.getItem('competition_events');
  return events ? JSON.parse(events) : [];
};

export const saveCompetitionEvent = (event: CompetitionEvent): void => {
  if (typeof window === 'undefined') return;
  const events = getCompetitionEvents();
  const existingIndex = events.findIndex(e => e.id === event.id);
  
  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.push(event);
  }
  
  localStorage.setItem('competition_events', JSON.stringify(events));
};

export const createCompetitionEvent = (
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  testIds: string[],
  prizes: Array<{rank: number; prize: string; description: string}>
): CompetitionEvent => {
  return {
    id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    startDate,
    endDate,
    testIds,
    prizes,
    isActive: true,
    participants: [],
    leaderboard: []
  };
};

export const participateInCompetition = (eventId: string, studentId: string): void => {
  const events = getCompetitionEvents();
  const event = events.find(e => e.id === eventId);
  
  if (event && !event.participants.includes(studentId)) {
    event.participants.push(studentId);
    saveCompetitionEvent(event);
  }
};

// Achievements
export const getStudentAchievements = (studentId: string): StudentAchievement[] => {
  if (typeof window === 'undefined') return [];
  const achievements = localStorage.getItem('student_achievements');
  const allAchievements = achievements ? JSON.parse(achievements) : [];
  return allAchievements.filter((a: StudentAchievement) => a.studentId === studentId);
};

export const saveStudentAchievement = (achievement: StudentAchievement): void => {
  if (typeof window === 'undefined') return;
  const achievements = getStudentAchievements(achievement.studentId);
  achievements.push(achievement);
  
  const allAchievements = JSON.parse(localStorage.getItem('student_achievements') || '[]');
  allAchievements.push(achievement);
  localStorage.setItem('student_achievements', JSON.stringify(allAchievements));
};

export const checkAndAwardAchievements = (studentId: string): StudentAchievement[] => {
  const stats = getStudentStats(studentId);
  const newAchievements: StudentAchievement[] = [];
  
  // Check for various achievements
  if (stats.totalTestsAttempted === 1) {
    newAchievements.push(createAchievement(studentId, 'badge', 'First Test', 'Completed your first test', '🎯', 50));
  }
  
  if (stats.totalTestsAttempted === 10) {
    newAchievements.push(createAchievement(studentId, 'milestone', 'Test Warrior', 'Completed 10 tests', '⚔️', 200));
  }
  
  if (stats.currentStreak >= 5) {
    newAchievements.push(createAchievement(studentId, 'streak', 'Streak Master', '5 consecutive good scores', '🔥', 300));
  }
  
  if (stats.bestScore >= 90) {
    newAchievements.push(createAchievement(studentId, 'badge', 'Excellence', 'Scored 90% or above', '🏆', 500));
  }
  
  // Save new achievements
  newAchievements.forEach(achievement => saveStudentAchievement(achievement));
  
  return newAchievements;
};

export const createAchievement = (
  studentId: string,
  type: 'badge' | 'milestone' | 'streak' | 'competition',
  title: string,
  description: string,
  icon: string,
  points: number
): StudentAchievement => {
  return {
    id: `ach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    type,
    title,
    description,
    icon,
    earnedDate: new Date().toISOString(),
    points
  };
};

export const getTopPerformers = (period: 'daily' | 'weekly' | 'monthly' | 'all' = 'all'): LeaderboardEntry[] => {
  let leaderboard = getLeaderboardData();
  
  const now = new Date();
  
  switch (period) {
    case 'daily':
      const today = now.toISOString().split('T')[0];
      leaderboard = leaderboard.filter(entry => entry.attemptDate.startsWith(today));
      break;
    case 'weekly':
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      leaderboard = leaderboard.filter(entry => new Date(entry.attemptDate) >= oneWeekAgo);
      break;
    case 'monthly':
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      leaderboard = leaderboard.filter(entry => new Date(entry.attemptDate) >= oneMonthAgo);
      break;
  }
  
  return calculateRanks(leaderboard).slice(0, 10);
};
