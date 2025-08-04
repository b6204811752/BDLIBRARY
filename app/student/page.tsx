'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PracticeTest from '@/components/PracticeTest';
import { getCurrentUser, updateStudentProgress, subscribeToDataChanges, markNotificationAsRead } from '@/lib/auth';
import { jobCategories } from '@/lib/study-materials';
import { practiceTests } from '@/lib/practice-tests';

export default function StudentDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 0,
    activeTests: 0,
    todayMaterials: 0
  });

  // Quick Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchResults, setSearchResults] = useState({
    materials: [] as any[],
    tests: [] as any[],
    notes: [] as any[],
    announcements: [] as any[]
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || !user.type || user.type !== 'student') {
      router.push('/login');
      return;
    }

    // Load initial data immediately
    loadData();
    setLoading(false);

    let unsubscribe: (() => void) | null = null;

    // Subscribe to real-time updates (but less frequently)
    subscribeToDataChanges(() => {
      loadData();
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    // Simulate real-time updates every 2 minutes instead of 30 seconds
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        onlineUsers: Math.floor(Math.random() * 20) + 15,
        activeTests: Math.floor(Math.random() * 8) + 3,
        todayMaterials: Math.floor(Math.random() * 50) + 20
      }));
    }, 120000); // Changed from 30000 to 120000 (2 minutes)

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearInterval(interval);
    };
  }, [router]);

  const loadData = () => {
    try {
      const user = getCurrentUser();
      if (user && user.data) {
        setCurrentUser(user.data);
        // Ensure notifications is always an array - only for students
        if ('notifications' in user.data && Array.isArray(user.data.notifications)) {
          setNotifications(user.data.notifications);
        } else {
          setNotifications([]);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleDownloadMaterial = (materialId: string) => {
    if (currentUser && currentUser.id) {
      const currentProgress = currentUser.progress || { materialsDownloaded: 0, totalPoints: 0 };
      const newProgress = {
        materialsDownloaded: currentProgress.materialsDownloaded + 1,
        totalPoints: currentProgress.totalPoints + 10
      };

      updateStudentProgress(currentUser.id, newProgress);
      setCurrentUser({
        ...currentUser,
        progress: {
          ...currentProgress,
          ...newProgress
        }
      });
    }
  };

  const handleTakeTest = () => {
    if (currentUser && currentUser.id) {
      const currentProgress = currentUser.progress || { testsCompleted: 0, totalPoints: 0, currentStreak: 0 };
      const newProgress = {
        testsCompleted: currentProgress.testsCompleted + 1,
        totalPoints: currentProgress.totalPoints + 50,
        currentStreak: currentProgress.currentStreak + 1
      };

      updateStudentProgress(currentUser.id, newProgress);
      setCurrentUser({
        ...currentUser,
        progress: {
          ...currentProgress,
          ...newProgress
        }
      });
    }
  };

  const handleTestComplete = (score: number, totalMarks: number) => {
    if (currentUser && currentUser.id) {
      const percentage = (score / totalMarks) * 100;
      const currentProgress = currentUser.progress || { testsCompleted: 0, totalPoints: 0, currentStreak: 0 };
      const newProgress = {
        testsCompleted: currentProgress.testsCompleted + 1,
        totalPoints: currentProgress.totalPoints + score,
        currentStreak: currentProgress.currentStreak + 1,
        averageScore: percentage
      };

      updateStudentProgress(currentUser.id, newProgress);
      setCurrentUser({
        ...currentUser,
        progress: {
          ...currentProgress,
          ...newProgress
        }
      });
    }
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    if (currentUser && currentUser.id) {
      markNotificationAsRead(currentUser.id, notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    }
  };

  const getProgressPercentage = (current: number, total: number) => {
    return Math.min((current / total) * 100, 100);
  };

  const getAttendancePercentage = () => {
    if (!currentUser?.attendance || currentUser.attendance.totalDays === 0) return 0;
    return (currentUser.attendance.present / currentUser.attendance.totalDays) * 100;
  };

  // Search functionality
  const performSearch = (query: string, category: string = 'all') => {
    if (!query.trim()) {
      setSearchResults({ materials: [], tests: [], notes: [], announcements: [] });
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = {
        materials: [] as any[],
        tests: [] as any[],
        notes: [] as any[],
        announcements: [] as any[]
      };

      // Search through all job categories for materials
      if (category === 'all' || category === 'materials') {
        jobCategories.forEach(cat => {
          const matchingMaterials = cat.materials.filter(material =>
            material.title.toLowerCase().includes(query.toLowerCase()) ||
            material.description.toLowerCase().includes(query.toLowerCase()) ||
            material.type.toLowerCase().includes(query.toLowerCase())
          ).map(material => ({ ...material, category: cat.name }));
          results.materials.push(...matchingMaterials);
        });
      }

      // Search through practice tests
      if (category === 'all' || category === 'tests') {
        const matchingTests = practiceTests.filter(test =>
          test.name.toLowerCase().includes(query.toLowerCase()) ||
          test.description.toLowerCase().includes(query.toLowerCase()) ||
          test.category.toLowerCase().includes(query.toLowerCase())
        );
        results.tests = matchingTests;
      }

      // Search through notes (simulated data)
      if (category === 'all' || category === 'notes') {
        const sampleNotes = [
          { id: 1, title: 'Banking Fundamentals', content: 'Key concepts in banking sector', subject: 'Banking', lastModified: '2024-01-15' },
          { id: 2, title: 'Railway Safety Protocols', content: 'Important safety measures', subject: 'Railway', lastModified: '2024-01-10' },
          { id: 3, title: 'SSC Mathematics Tips', content: 'Quick calculation methods', subject: 'SSC', lastModified: '2024-01-12' },
          { id: 4, title: 'UPSC Current Affairs', content: 'Latest current affairs notes', subject: 'UPSC', lastModified: '2024-01-18' }
        ];
        
        const matchingNotes = sampleNotes.filter(note =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase()) ||
          note.subject.toLowerCase().includes(query.toLowerCase())
        );
        results.notes = matchingNotes;
      }

      // Search through announcements (simulated data)
      if (category === 'all' || category === 'announcements') {
        const sampleAnnouncements = [
          { id: 1, title: 'New Study Materials Available', content: 'Latest banking exam materials uploaded', date: '2024-01-20', priority: 'high' },
          { id: 2, title: 'Practice Test Schedule', content: 'Weekly practice tests every Sunday', date: '2024-01-18', priority: 'medium' },
          { id: 3, title: 'Fee Payment Reminder', content: 'Monthly fees due on 25th', date: '2024-01-15', priority: 'high' },
          { id: 4, title: 'Library Hours Extended', content: 'Now open till 10 PM on weekdays', date: '2024-01-12', priority: 'low' }
        ];
        
        const matchingAnnouncements = sampleAnnouncements.filter(announcement =>
          announcement.title.toLowerCase().includes(query.toLowerCase()) ||
          announcement.content.toLowerCase().includes(query.toLowerCase())
        );
        results.announcements = matchingAnnouncements;
      }

      setSearchResults(results);
      setIsSearching(false);

      // Add to search history
      if (query.trim() && !searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]);
      }
    }, 500);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ materials: [], tests: [], notes: [], announcements: [] });
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query, searchCategory);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>;
  }

  if (!currentUser) {
    return null;
  }

  const categoryData = jobCategories.find(cat => cat.id === currentUser.jobCategory.toLowerCase());
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-responsive py-4 sm:py-6 lg:py-8">
        {/* Enhanced Header Section with Personalized Welcome */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-8 w-12 h-12 bg-yellow-300 rounded-full animate-bounce"></div>
              <div className="absolute bottom-6 left-12 w-8 h-8 bg-white rounded-full animate-ping"></div>
              <div className="absolute bottom-8 right-16 w-6 h-6 bg-yellow-300 rounded-full animate-pulse"></div>
            </div>
            
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                      <i className="ri-graduation-cap-fill text-2xl sm:text-3xl text-yellow-300"></i>
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                        Welcome back, <span className="text-yellow-300">{currentUser.name}!</span>
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center text-blue-100">
                          <i className="ri-time-line mr-1"></i>
                          <span>{currentUser.shift.charAt(0).toUpperCase() + currentUser.shift.slice(1)} Shift</span>
                        </div>
                        <div className="hidden sm:block text-blue-200">•</div>
                        <div className="flex items-center text-blue-100">
                          <i className="ri-bookmark-line mr-1"></i>
                          <span>{currentUser.jobCategory} Category</span>
                        </div>
                        <div className="hidden sm:block text-blue-200">•</div>
                        <div className="flex items-center text-green-300">
                          <i className="ri-calendar-line mr-1"></i>
                          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievement badges */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {currentUser.progress?.currentStreak > 0 && (
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs sm:text-sm">
                        <i className="ri-fire-fill text-orange-400 mr-1"></i>
                        <span className="text-white font-medium">{currentUser.progress.currentStreak} Day Streak</span>
                      </div>
                    )}
                    {(currentUser.progress?.totalPoints || 0) > 500 && (
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs sm:text-sm">
                        <i className="ri-star-fill text-yellow-400 mr-1"></i>
                        <span className="text-white font-medium">High Achiever</span>
                      </div>
                    )}
                    {(currentUser.progress?.testsCompleted || 0) > 10 && (
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs sm:text-sm">
                        <i className="ri-trophy-fill text-yellow-400 mr-1"></i>
                        <span className="text-white font-medium">Test Champion</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Mobile-optimized action section */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-white/30">
                    <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-sm font-medium text-white">Online Students</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-300">{realTimeData.onlineUsers}</span>
                    </div>
                  </div>
                  
                  {/* Enhanced notification button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="group w-full sm:w-auto bg-white/30 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 border-white/40 hover:bg-white/40 hover:border-white/60 transition-all duration-300 cursor-pointer flex items-center justify-center relative quick-action-button"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <i className="ri-notification-fill text-2xl text-white group-hover:scale-125 transition-all duration-300 icon-glow"></i>
                          {unreadNotifications > 0 && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce shadow-lg floating-badge">
                              {unreadNotifications}
                            </div>
                          )}
                        </div>
                        <span className="sm:hidden text-base text-white font-semibold">Notifications</span>
                        <span className="hidden sm:block text-sm text-white font-medium">
                          {unreadNotifications > 0 ? `${unreadNotifications} New` : 'All Clear'}
                        </span>
                      </div>
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden border border-gray-100">
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center">
                              <i className="ri-notification-fill text-blue-600 mr-2"></i>
                              Notifications
                            </h3>
                            <button 
                              onClick={() => setShowNotifications(false)}
                              className="sm:hidden text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <i className="ri-close-line text-lg"></i>
                            </button>
                          </div>
                          {unreadNotifications > 0 && (
                            <p className="text-xs text-blue-600 mt-1">{unreadNotifications} unread messages</p>
                          )}
                        </div>
                        <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <i className="ri-notification-off-line text-2xl text-gray-400"></i>
                              </div>
                              <p className="font-medium">No notifications yet</p>
                              <p className="text-xs text-gray-400 mt-1">Check back later for updates</p>
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 group ${
                                  !notification.read ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''
                                }`}
                                onClick={() => handleMarkNotificationAsRead(notification.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                                  }`}>
                                    <i className={`ri-mail-line text-sm ${!notification.read ? 'text-white' : 'text-gray-600'}`}></i>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 leading-relaxed font-medium">{notification.message}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <p className="text-xs text-gray-500">
                                        {new Date(notification.timestamp).toLocaleString()}
                                      </p>
                                      {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs with Modern Design */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-fill', color: 'blue', count: null },
                { id: 'search', label: 'Quick Search', icon: 'ri-search-fill', color: 'indigo', count: null },
                { id: 'fees', label: 'Fees & Payments', icon: 'ri-money-rupee-circle-fill', color: 'green', count: currentUser.fees?.dueAmount > 0 ? '!' : null },
                { id: 'materials', label: 'Study Materials', icon: 'ri-book-fill', color: 'purple', count: realTimeData.todayMaterials },
                { id: 'tests', label: 'Practice Tests', icon: 'ri-quiz-fill', color: 'orange', count: realTimeData.activeTests },
                { id: 'progress', label: 'Progress', icon: 'ri-bar-chart-fill', color: 'red', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex-shrink-0 flex items-center justify-center space-x-2 sm:space-x-3 py-4 px-4 sm:px-6 lg:px-8 font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer min-w-0 ${
                    activeTab === tab.id
                      ? `text-${tab.color}-600 bg-gradient-to-r from-${tab.color}-50 to-${tab.color}-100`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-700 rounded-t-full`}></div>
                  )}
                  
                  <div className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    activeTab === tab.id 
                      ? `bg-gradient-to-br from-${tab.color}-500 to-${tab.color}-700 shadow-lg scale-110` 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <i className={`${tab.icon} text-sm sm:text-base ${
                      activeTab === tab.id ? 'text-white' : `text-${tab.color}-600 group-hover:text-${tab.color}-700`
                    } transition-colors duration-300`}></i>
                    
                    {/* Notification badge */}
                    {tab.count && (
                      <div className={`absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg ${
                        activeTab === tab.id ? 'animate-bounce' : 'animate-pulse'
                      }`}>
                        <span className="text-white text-xs font-bold">
                          {typeof tab.count === 'number' ? (tab.count > 9 ? '9+' : tab.count) : tab.count}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <span className={`hidden sm:block font-semibold transition-all duration-300 ${
                    activeTab === tab.id ? 'transform scale-105' : ''
                  }`}>
                    {tab.label}
                  </span>
                  
                  {/* Hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-${tab.color}-500/0 to-${tab.color}-500/0 group-hover:from-${tab.color}-500/5 group-hover:to-${tab.color}-500/10 transition-all duration-300 rounded-lg`}></div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Enhanced Stats Cards with Modern Design */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border border-blue-200 hover:border-blue-300 relative overflow-hidden">
                {/* Floating sparkle effects */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <i className="ri-quiz-fill text-lg sm:text-xl lg:text-2xl text-white group-hover:animate-wiggle"></i>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-blue-700 truncate group-hover:text-blue-800 transition-colors">Tests Completed</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">{currentUser.progress?.testsCompleted || 0}</p>
                    <p className="text-xs text-blue-600 flex items-center mt-1">
                      <i className="ri-fire-line mr-1"></i>
                      Streak: {currentUser.progress?.currentStreak || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border border-green-200 hover:border-green-300 relative overflow-hidden">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <i className="ri-money-rupee-circle-fill text-lg sm:text-xl lg:text-2xl text-white group-hover:animate-wiggle"></i>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-green-700 truncate group-hover:text-green-800 transition-colors">Fees Paid</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300">₹{(currentUser.fees?.paidAmount || 0).toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <i className="ri-alert-line mr-1"></i>
                      Due: ₹{(currentUser.fees?.dueAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border border-purple-200 hover:border-purple-300 relative overflow-hidden">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <i className="ri-book-fill text-lg sm:text-xl lg:text-2xl text-white group-hover:animate-wiggle"></i>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-purple-700 truncate group-hover:text-purple-800 transition-colors">Books Issued</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">{currentUser.library?.booksIssued?.length || 0}</p>
                    <p className="text-xs text-purple-600 flex items-center mt-1">
                      <i className="ri-bookmark-line mr-1"></i>
                      Active: {currentUser.library?.booksIssued?.filter((book: any) => book.status === 'issued').length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border border-orange-200 hover:border-orange-300 relative overflow-hidden">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-orange-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <i className="ri-trophy-fill text-lg sm:text-xl lg:text-2xl text-white group-hover:animate-wiggle"></i>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-orange-700 truncate group-hover:text-orange-800 transition-colors">Total Points</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-yellow-600 group-hover:bg-clip-text transition-all duration-300">{currentUser.progress?.totalPoints || 0}</p>
                    <p className="text-xs text-orange-600 flex items-center mt-1">
                      <i className="ri-medal-line mr-1"></i>
                      Rank: #{Math.floor(Math.random() * 10) + 1}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border border-red-200 hover:border-red-300 relative overflow-hidden col-span-2 sm:col-span-3 lg:col-span-1">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <i className="ri-award-fill text-lg sm:text-xl lg:text-2xl text-white group-hover:animate-wiggle"></i>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-red-700 truncate group-hover:text-red-800 transition-colors">Certificates</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">{currentUser.certificates?.length || 0}</p>
                    <p className="text-xs text-red-600 flex items-center mt-1">
                      <i className="ri-star-line mr-1"></i>
                      Earned
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-quiz-line text-xl text-blue-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{currentUser.progress?.testsCompleted || 0}</p>
                    <p className="text-xs text-blue-600">Streak: {currentUser.progress?.currentStreak || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-download-line text-xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Materials Downloaded</p>
                    <p className="text-2xl font-bold text-gray-900">{currentUser.progress?.materialsDownloaded || 0}</p>
                    <p className="text-xs text-green-600">Today: {Math.floor(Math.random() * 5) + 1}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-time-line text-xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Study Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{currentUser.progress?.studyHours || 0}</p>
                    <p className="text-xs text-purple-600">This week: {Math.floor(Math.random() * 20) + 15}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="ri-trophy-line text-xl text-yellow-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{currentUser.progress?.totalPoints || 0}</p>
                    <p className="text-xs text-yellow-600">Rank: #{Math.floor(Math.random() * 10) + 1}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-200 relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-blue-200/30 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                    <i className="ri-flashlight-fill text-3xl text-white"></i>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Quick Actions
                  </h2>
                  <p className="text-gray-600 text-lg">Access frequently used features instantly</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Take Practice Test */}
                  <button
                    onClick={() => setActiveTab('tests')}
                    className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-blue-200 hover:border-blue-400 relative overflow-hidden"
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-quiz-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-blue-700 transition-colors">Take Practice Test</h3>
                      <p className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">Start practicing now</p>
                      
                      {/* Floating badge */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce">
                        <span className="text-white text-xs font-bold">{realTimeData.activeTests}</span>
                      </div>
                    </div>
                  </button>

                  {/* Browse Study Materials */}
                  <button
                    onClick={() => setActiveTab('materials')}
                    className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-green-200 hover:border-green-400 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/10 group-hover:to-green-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-book-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-green-700 transition-colors">Study Materials</h3>
                      <p className="text-xs text-gray-600 group-hover:text-green-600 transition-colors">Download resources</p>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce">
                        <span className="text-white text-xs font-bold">{realTimeData.todayMaterials}</span>
                      </div>
                    </div>
                  </button>

                  {/* Quick Search */}
                  <button
                    onClick={() => setActiveTab('search')}
                    className="group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-purple-200 hover:border-purple-400 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/10 group-hover:to-purple-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-search-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-purple-700 transition-colors">Quick Search</h3>
                      <p className="text-xs text-gray-600 group-hover:text-purple-600 transition-colors">Find anything fast</p>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce">
                        <i className="ri-star-fill text-white text-xs"></i>
                      </div>
                    </div>
                  </button>

                  {/* View Progress */}
                  <button
                    onClick={() => setActiveTab('progress')}
                    className="group bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-orange-200 hover:border-orange-400 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-orange-600/0 group-hover:from-orange-400/10 group-hover:to-orange-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-bar-chart-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-orange-700 transition-colors">View Progress</h3>
                      <p className="text-xs text-gray-600 group-hover:text-orange-600 transition-colors">Track performance</p>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce">
                        <i className="ri-arrow-up-line text-white text-xs font-bold"></i>
                      </div>
                    </div>
                  </button>

                  {/* Check Fees */}
                  <button
                    onClick={() => setActiveTab('fees')}
                    className="group bg-white hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-red-200 hover:border-red-400 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 to-red-600/0 group-hover:from-red-400/10 group-hover:to-red-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-money-rupee-circle-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-red-700 transition-colors">Check Fees</h3>
                      <p className="text-xs text-gray-600 group-hover:text-red-600 transition-colors">Payment details</p>
                      
                      {currentUser.fees?.dueAmount > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <i className="ri-alert-fill text-white text-xs"></i>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Live Classes */}
                  <button
                    className="group bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-indigo-200 hover:border-indigo-400 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 to-indigo-600/0 group-hover:from-indigo-400/10 group-hover:to-indigo-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-live-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-indigo-700 transition-colors">Live Classes</h3>
                      <p className="text-xs text-gray-600 group-hover:text-indigo-600 transition-colors">Join live sessions</p>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </button>

                  {/* Study Schedule */}
                  <button
                    className="group bg-white hover:bg-gradient-to-br hover:from-teal-50 hover:to-teal-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-teal-200 hover:border-teal-400 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 to-teal-600/0 group-hover:from-teal-400/10 group-hover:to-teal-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-calendar-check-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-teal-700 transition-colors">Study Schedule</h3>
                      <p className="text-xs text-gray-600 group-hover:text-teal-600 transition-colors">Plan your studies</p>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                    </div>
                  </button>

                  {/* Achievements */}
                  <button
                    className="group bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-yellow-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-yellow-200 hover:border-yellow-400 relative overflow-hidden col-span-2 sm:col-span-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-600/0 group-hover:from-yellow-400/10 group-hover:to-yellow-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-trophy-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-yellow-700 transition-colors">Achievements</h3>
                      <p className="text-xs text-gray-600 group-hover:text-yellow-600 transition-colors">View badges & rewards</p>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce">
                        <span className="text-white text-xs font-bold">{currentUser.certificates?.length || 0}</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Quick Tips Section */}
                <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/60">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <i className="ri-lightbulb-fill text-white text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">Quick Tip of the Day</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {[
                          "Take practice tests regularly to improve your performance!",
                          "Download study materials before your exam date.",
                          "Check your progress weekly to stay on track.",
                          "Join live classes for better understanding.",
                          "Complete assignments on time to earn bonus points!"
                        ][Math.floor(Math.random() * 5)]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Performance Overview with Modern Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 relative overflow-hidden group">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                        <i className="ri-line-chart-fill text-white"></i>
                      </div>
                      Performance Overview
                    </h2>
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                            <i className="ri-trophy-line text-blue-600 text-sm"></i>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Average Score</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-blue-600 mr-2">{currentUser.progress?.averageScore || 0}%</span>
                          <i className="ri-arrow-up-line text-green-500"></i>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                          style={{ width: `${currentUser.progress?.averageScore || 0}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                            <i className="ri-check-double-line text-green-600 text-sm"></i>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Completion Rate</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-green-600 mr-2">{currentUser.progress?.completionRate || 0}%</span>
                          <i className="ri-arrow-up-line text-green-500"></i>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                          style={{ width: `${currentUser.progress?.completionRate || 0}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                            <i className="ri-calendar-check-line text-purple-600 text-sm"></i>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Attendance</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-purple-600 mr-2">{Math.round(getAttendancePercentage())}%</span>
                          <i className="ri-arrow-up-line text-green-500"></i>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                          style={{ width: `${getAttendancePercentage()}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 relative overflow-hidden group">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mr-3">
                        <i className="ri-book-2-fill text-white"></i>
                      </div>
                      Subject Performance
                    </h2>
                    <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    {currentUser.performance?.subjectWiseScore && Object.entries(currentUser.performance.subjectWiseScore).map(([subject, score], index) => (
                      <div key={subject} className="group p-3 rounded-xl hover:bg-purple-50 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 bg-gradient-to-br ${['from-blue-400 to-blue-600', 'from-green-400 to-green-600', 'from-orange-400 to-orange-600', 'from-red-400 to-red-600'][index % 4]} rounded-lg flex items-center justify-center mr-3`}>
                              <i className="ri-book-line text-white text-xs"></i>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{subject}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-purple-600">{score as number}%</span>
                            {(score as number) >= 80 && <i className="ri-star-fill text-yellow-500"></i>}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${['from-blue-400 to-blue-600', 'from-green-400 to-green-600', 'from-orange-400 to-orange-600', 'from-red-400 to-red-600'][index % 4]} h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                            style={{ width: `${score as number}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="ri-bar-chart-line text-2xl text-gray-400"></i>
                        </div>
                        <p className="text-gray-500 font-medium">Complete more tests to see your subject performance</p>
                        <p className="text-xs text-gray-400 mt-1">Take practice tests to unlock detailed analytics</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Strengths</h2>
                <div className="space-y-2">
                  {currentUser.performance?.strengths?.map((strength: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-600"></i>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-gray-500">
                      Complete more tests to see your strengths
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Areas for Improvement</h2>
                <div className="space-y-2">
                  {currentUser.performance?.improvements?.map((improvement: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <i className="ri-arrow-up-line text-orange-600"></i>
                      <span className="text-sm text-gray-700">{improvement}</span>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-gray-500">
                      Complete more tests to see improvement areas
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fees & Payments Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            {/* Fee Overview */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fee Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">₹{currentUser.fees?.totalFee?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-600">Total Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">₹{currentUser.fees?.paidAmount?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-600">Paid Amount</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      currentUser.fees?.dueAmount > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    ₹{currentUser.fees?.dueAmount?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600">Due Amount</div>
                </div>
              </div>
            </div>

            {/* Installments */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Installments</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUser.fees?.installments?.map((installment: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{installment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(installment.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {installment.paidDate ? new Date(installment.paidDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              installment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                installment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {installment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {installment.paymentMethod || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>
              <div className="space-y-4">
                {currentUser.fees?.paymentHistory?.map((payment: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">₹{payment.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{payment.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900">{new Date(payment.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-600 capitalize">{payment.method}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Transaction ID: {payment.transactionId} | Receipt: {payment.receiptNo}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discounts */}
            {currentUser.fees?.discounts?.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Discounts Applied</h2>
                <div className="space-y-3">
                  {currentUser.fees.discounts.map((discount: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <div className="font-medium text-gray-900">{discount.reason}</div>
                        <div className="text-sm text-gray-600">Applied on {new Date(discount.appliedDate).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                        </div>
                        <div className="text-sm text-gray-600">By {discount.appliedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Header */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ri-search-fill text-2xl text-white"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Quick Search
                    </h2>
                    <p className="text-indigo-600">Find materials, tests, notes, and announcements</p>
                  </div>
                </div>
                <div className="text-sm text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">
                  {Object.values(searchResults).flat().length} results
                </div>
              </div>

              {/* Search Input */}
              <div className="relative mb-4">
                <div className="relative">
                  <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
                  <input
                    type="text"
                    placeholder="Search for materials, tests, notes, announcements..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      performSearch(e.target.value, searchCategory);
                    }}
                    className="w-full pl-12 pr-12 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 text-lg bg-white/80 backdrop-blur-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className="ri-close-circle-line text-xl"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Search Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                {['all', 'materials', 'tests', 'notes', 'announcements'].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSearchCategory(category);
                      performSearch(searchQuery, category);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      searchCategory === category
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:scale-105'
                    }`}
                  >
                    <i className={`${
                      category === 'all' ? 'ri-apps-fill' :
                      category === 'materials' ? 'ri-book-fill' :
                      category === 'tests' ? 'ri-quiz-fill' :
                      category === 'notes' ? 'ri-sticky-note-fill' :
                      'ri-megaphone-fill'
                    } mr-2`}></i>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Quick Search Suggestions */}
              {!searchQuery && searchHistory.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-indigo-600 mb-2">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.slice(0, 5).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(query)}
                        className="px-3 py-1 bg-white text-indigo-600 border border-indigo-200 rounded-full text-sm hover:bg-indigo-50 transition-colors"
                      >
                        <i className="ri-history-line mr-1"></i>
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {!searchQuery && (
                <div>
                  <h3 className="text-sm font-medium text-indigo-600 mb-2">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Banking Basics', 'Practice Tests', 'Current Affairs', 'Mathematics', 'English Grammar', 'General Knowledge'].map((query) => (
                      <button
                        key={query}
                        onClick={() => handleQuickSearch(query)}
                        className="px-3 py-1 bg-white text-indigo-600 border border-indigo-200 rounded-full text-sm hover:bg-indigo-50 transition-colors"
                      >
                        <i className="ri-fire-line mr-1"></i>
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="text-indigo-600 font-medium">Searching...</span>
                </div>
              </div>
            )}

            {/* Search Results */}
            {!isSearching && searchQuery && (
              <div className="space-y-6">
                {/* Materials Results */}
                {searchResults.materials.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <i className="ri-book-fill text-white"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Study Materials ({searchResults.materials.length})</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.materials.map((material) => (
                        <div key={material.id} className="border border-purple-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <i className={`${
                                material.type === 'pdf' ? 'ri-file-pdf-fill text-red-500' :
                                material.type === 'video' ? 'ri-video-fill text-blue-500' :
                                material.type === 'quiz' ? 'ri-quiz-fill text-green-500' :
                                'ri-file-text-fill text-gray-500'
                              } text-xl`}></i>
                              <span className="text-sm font-medium text-purple-600">{material.category}</span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{material.size}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{material.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleDownloadMaterial(material.id)}
                              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-medium mr-2"
                            >
                              <i className="ri-download-fill mr-2"></i>
                              Download
                            </button>
                            <button className="bg-purple-50 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                              <i className="ri-bookmark-fill"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tests Results */}
                {searchResults.tests.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <i className="ri-quiz-fill text-white"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Practice Tests ({searchResults.tests.length})</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.tests.map((test) => (
                        <div key={test.id} className="border border-orange-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{test.category}</span>
                            <span className="text-sm text-gray-500">{test.duration} min</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{test.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{test.questions.length} Questions • {test.duration} Minutes</p>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={handleTakeTest}
                              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium mr-2"
                            >
                              <i className="ri-play-fill mr-2"></i>
                              Start Test
                            </button>
                            <button className="bg-orange-50 text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors">
                              <i className="ri-information-fill"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Results */}
                {searchResults.notes.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <i className="ri-sticky-note-fill text-white"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Notes ({searchResults.notes.length})</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.notes.map((note) => (
                        <div key={note.id} className="border border-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{note.subject}</span>
                            <span className="text-xs text-gray-500">{new Date(note.lastModified).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{note.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{note.content}</p>
                          <div className="flex items-center justify-between">
                            <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium mr-2">
                              <i className="ri-eye-fill mr-2"></i>
                              View Note
                            </button>
                            <button className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                              <i className="ri-share-fill"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Announcements Results */}
                {searchResults.announcements.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <i className="ri-megaphone-fill text-white"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Announcements ({searchResults.announcements.length})</h3>
                    </div>
                    <div className="space-y-3">
                      {searchResults.announcements.map((announcement) => (
                        <div key={announcement.id} className="border border-green-100 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                announcement.priority === 'high' ? 'bg-red-500' :
                                announcement.priority === 'medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}></div>
                              <span className="text-sm font-medium text-green-600">{announcement.priority.toUpperCase()} PRIORITY</span>
                            </div>
                            <span className="text-xs text-gray-500">{new Date(announcement.date).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{announcement.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{announcement.content}</p>
                          <button className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
                            <i className="ri-arrow-right-line mr-1"></i>
                            Read More
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {Object.values(searchResults).every(results => results.length === 0) && searchQuery && (
                  <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-search-line text-2xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find anything matching "<span className="font-medium text-indigo-600">{searchQuery}</span>"
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="text-sm text-gray-500">Try searching for:</span>
                      {['Banking', 'SSC', 'Railway', 'UPSC'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleQuickSearch(suggestion)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 underline"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Study Materials Tab */}
        {activeTab === 'materials' && categoryData && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{categoryData.name} Study Materials</h2>
                <div className="text-sm text-gray-500">
                  Downloaded: {currentUser.progress?.materialsDownloaded || 0} | Available: {categoryData.materials.length}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{categoryData.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryData.materials.map((material) => (
                  <div key={material.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <i
                          className={`${material.type === 'pdf' ? 'ri-file-pdf-line text-red-500' :
                            material.type === 'video' ? 'ri-video-line text-blue-500' :
                              material.type === 'quiz' ? 'ri-quiz-line text-green-500' :
                                'ri-file-text-line text-gray-500'
                          } text-xl`}
                        ></i>
                        <span className="text-sm text-gray-500 capitalize">{material.type}</span>
                      </div>
                      <span className="text-sm text-gray-400">{material.size}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{material.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleDownloadMaterial(material.id)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer mr-2"
                      >
                        Download
                      </button>
                      <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <i className="ri-bookmark-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Practice Tests Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Practice Tests</h2>
                <div className="text-sm text-gray-500">
                  Available Tests: {practiceTests.length} | Completed: {currentUser.progress?.testsCompleted || 0} | Average: {currentUser.progress?.averageScore || 0}%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practiceTests.map((test, index) => (
                  <div key={test.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{test.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p>Questions: {test.totalQuestions}</p>
                      <p>Duration: {test.duration} minutes</p>
                      <p>Total Marks: {test.totalMarks}</p>
                      <p>Category: {test.category}</p>
                      <p>Type: <span className="capitalize">{test.type}</span></p>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Description:</p>
                      <p className="text-sm text-gray-700">{test.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {test.subjects.map((subject, subIndex) => (
                        <span key={subIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {subject}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          // Navigate to a dedicated test page with the test ID
                          alert(`Starting ${test.name}!\n\nFeatures:\n- ${test.totalQuestions} real questions\n- ${test.duration} minutes timer\n- Question navigation\n- Hindi/English language toggle\n- Detailed results with explanations\n- Progress tracking\n\nClick OK to proceed to test interface.`);
                          // In a real implementation, you would navigate to /test/${test.id}
                          window.open(`/test?id=${test.id}&name=${encodeURIComponent(test.name)}`, '_blank');
                        }}
                        className="flex-1 py-2 px-4 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Start Test
                      </button>
                      <button 
                        onClick={() => {
                          alert(`Test Instructions for ${test.name}:\n\n• Total Questions: ${test.totalQuestions}\n• Duration: ${test.duration} minutes\n• Total Marks: ${test.totalMarks}\n• Subjects: ${test.subjects.join(', ')}\n• Language: English/Hindi toggle available\n• Navigation: Move between questions freely\n• Auto-submit when time expires\n• Detailed explanations provided\n\nGood luck!`);
                        }}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 cursor-pointer"
                        title="Test Instructions"
                      >
                        <i className="ri-information-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Available Practice Tests:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium mb-2">📚 Current Affairs & Static GK</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• 100 comprehensive questions</li>
                      <li>• History, Geography, Politics</li>
                      <li>• Sports, Current Events</li>
                      <li>• Science & Technology</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">🧠 Reasoning & Logical Thinking</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• 100 reasoning questions</li>
                      <li>• Logical reasoning patterns</li>
                      <li>• Verbal & Non-verbal reasoning</li>
                      <li>• Problem-solving techniques</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">🔢 Basic Mathematics</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• 100 mathematical problems</li>
                      <li>• Arithmetic & Algebra</li>
                      <li>• Geometry & Mensuration</li>
                      <li>• Quantitative aptitude</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Key Features:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Bilingual support (English/Hindi) for questions and explanations</li>
                    <li>Real-time timer with auto-submit functionality</li>
                    <li>Question navigation palette for easy movement</li>
                    <li>Detailed results with correct answers and explanations</li>
                    <li>Progress tracking and performance analytics</li>
                    <li>Mobile-responsive design for practice anywhere</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tests Completed</span>
                      <span className="text-sm text-gray-500">{currentUser.progress?.testsCompleted || 0}/50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${getProgressPercentage(currentUser.progress?.testsCompleted || 0, 50)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Study Materials</span>
                      <span className="text-sm text-gray-500">{currentUser.progress?.materialsDownloaded || 0}/20</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${getProgressPercentage(currentUser.progress?.materialsDownloaded || 0, 20)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Study Hours</span>
                      <span className="text-sm text-gray-500">{currentUser.progress?.studyHours || 0}/300</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${getProgressPercentage(currentUser.progress?.studyHours || 0, 300)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Attendance</span>
                      <span className="text-sm text-gray-500">{currentUser.attendance?.present || 0}/{currentUser.attendance?.totalDays || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${getAttendancePercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</h2>
                <div className="space-y-3">
                  {currentUser.performance?.weeklyTests?.map((tests: number, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Week {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(tests / 25) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{tests}</span>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      Weekly progress data will appear after completing tests
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}
