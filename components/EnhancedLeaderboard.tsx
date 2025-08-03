import React, { useState, useEffect } from 'react';
import {
  getLeaderboardByCategory,
  getTopPerformers,
  getStudentStats,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  LeaderboardEntry,
  StudentStats
} from '@/lib/leaderboard';

interface EnhancedLeaderboardProps {
  currentUser?: any;
  students: any[];
}

export default function EnhancedLeaderboard({ currentUser, students }: EnhancedLeaderboardProps) {
  const [activeTab, setActiveTab] = useState('overall');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);

  useEffect(() => {
    loadLeaderboard();
    if (currentUser && currentUser.type === 'student') {
      setStudentStats(getStudentStats(currentUser.data.id));
    }
  }, [selectedCategory, timeFilter, currentUser]);

  const loadLeaderboard = () => {
    let data: LeaderboardEntry[] = [];
    
    switch (timeFilter) {
      case 'weekly':
        data = getWeeklyLeaderboard(selectedCategory);
        break;
      case 'monthly':
        data = getMonthlyLeaderboard(selectedCategory);
        break;
      case 'daily':
        data = getTopPerformers('daily');
        break;
      default:
        data = getLeaderboardByCategory(selectedCategory);
    }
    
    setLeaderboard(data);
  };

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🏆' },
    { value: 'ssc', label: 'SSC', icon: '📚' },
    { value: 'banking', label: 'Banking', icon: '🏦' },
    { value: 'railway', label: 'Railway', icon: '🚂' },
    { value: 'upsc', label: 'UPSC', icon: '🎯' }
  ];

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' }
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', class: 'bg-yellow-100 text-yellow-800' };
    if (rank === 2) return { emoji: '🥈', class: 'bg-gray-100 text-gray-800' };
    if (rank === 3) return { emoji: '🥉', class: 'bg-orange-100 text-orange-800' };
    return { emoji: `#${rank}`, class: 'bg-blue-100 text-blue-800' };
  };

  return (
    <div className="space-y-6">
      {/* Mobile-responsive controls */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span className="hidden sm:inline">{category.label}</span>
              </button>
            ))}
          </div>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student's Personal Stats (if student is logged in) */}
      {studentStats && currentUser?.type === 'student' && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Your Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{studentStats.totalTestsAttempted}</div>
              <div className="text-sm opacity-90">Tests Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{studentStats.averagePercentage.toFixed(1)}%</div>
              <div className="text-sm opacity-90">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{studentStats.currentStreak}</div>
              <div className="text-sm opacity-90">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">#{leaderboard.findIndex(entry => entry.studentId === currentUser.data.id) + 1 || 'N/A'}</div>
              <div className="text-sm opacity-90">Your Rank</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Performers */}
      {leaderboard.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">🏆 Top Performers</h3>
          <div className="flex justify-center items-end space-x-4 mb-8">
            {leaderboard.slice(0, 3).map((entry, index) => {
              const student = students.find(s => s.id === entry.studentId);
              const heights = ['h-24', 'h-32', 'h-20']; // 2nd, 1st, 3rd
              const orders = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
              const actualIndex = orders[index];
              const actualEntry = leaderboard[actualIndex];
              const actualStudent = students.find(s => s.id === actualEntry?.studentId);
              
              if (!actualEntry || !actualStudent) return null;

              const badge = getRankBadge(actualEntry.rank);

              return (
                <div key={actualEntry.id} className="flex flex-col items-center">
                  <div className={`w-16 md:w-20 ${heights[actualIndex]} bg-gradient-to-t ${
                    actualIndex === 0 ? 'from-yellow-400 to-yellow-300' :
                    actualIndex === 1 ? 'from-gray-400 to-gray-300' :
                    'from-orange-400 to-orange-300'
                  } rounded-t-lg flex items-end justify-center pb-2`}>
                    <span className="text-2xl">
                      {actualIndex === 0 ? '🥇' : actualIndex === 1 ? '🥈' : '🥉'}
                    </span>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-medium text-sm">{actualStudent.name}</div>
                    <div className="text-xs text-gray-600">{actualEntry.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Leaderboard - {categories.find(c => c.value === selectedCategory)?.label} ({timeFilters.find(f => f.value === timeFilter)?.label})
          </h3>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <p className="text-gray-600">No test results available for the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry) => {
                  const student = students.find(s => s.id === entry.studentId);
                  const badge = getRankBadge(entry.rank);
                  const isCurrentUser = currentUser?.type === 'student' && currentUser.data.id === entry.studentId;

                  return (
                    <tr 
                      key={entry.id} 
                      className={`hover:bg-gray-50 ${isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
                          {badge.emoji}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student?.name || 'Unknown Student'}
                              {isCurrentUser && <span className="ml-2 text-blue-600 font-bold">(You)</span>}
                            </div>
                            <div className="text-sm text-gray-500">{student?.course} - {entry.shift}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{entry.testName}</div>
                        <div className="text-sm text-gray-500">{entry.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {entry.score}/{entry.totalMarks}
                        </div>
                        <div className="text-sm text-gray-500">{entry.percentage.toFixed(1)}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.timeSpent} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.attemptDate).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Achievement Badges */}
      {studentStats && studentStats.achievements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {studentStats.achievements.map((achievement) => (
              <div key={achievement.id} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <div className="text-sm font-medium text-gray-900">{achievement.title}</div>
                <div className="text-xs text-gray-600 mt-1">{achievement.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
