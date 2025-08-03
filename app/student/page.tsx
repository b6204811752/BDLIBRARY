'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PracticeTest from '@/components/PracticeTest';
import { getCurrentUser, updateStudentProgress, subscribeToDataChanges, markNotificationAsRead, getAuthData } from '@/lib/auth';
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
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user.type || user.type !== 'student') {
      router.push('/login');
      return;
    }

    // Load initial data immediately
    loadData();
    setLoading(false);

    // Subscribe to real-time updates (but less frequently)
    const unsubscribe = subscribeToDataChanges(() => {
      loadData();
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
      unsubscribe();
      clearInterval(interval);
    };
  }, [router]);

  const loadData = () => {
    try {
      const user = getCurrentUser();
      if (user.data) {
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
    if (currentUser) {
      const newProgress = {
        materialsDownloaded: currentUser.progress.materialsDownloaded + 1,
        totalPoints: currentUser.progress.totalPoints + 10
      };

      updateStudentProgress(currentUser.id, newProgress);
      setCurrentUser({
        ...currentUser,
        progress: {
          ...currentUser.progress,
          ...newProgress
        }
      });
    }
  };

  const handleTakeTest = () => {
    if (currentUser) {
      const newProgress = {
        testsCompleted: currentUser.progress.testsCompleted + 1,
        totalPoints: currentUser.progress.totalPoints + 50,
        currentStreak: currentUser.progress.currentStreak + 1
      };

      updateStudentProgress(currentUser.id, newProgress);
      setCurrentUser({
        ...currentUser,
        progress: {
          ...currentUser.progress,
          ...newProgress
        }
      });
    }
  };

  const handleTestComplete = (score: number, totalMarks: number) => {
    if (currentUser) {
      const percentage = (score / totalMarks) * 100;
      const newProgress = {
        testsCompleted: (currentUser.progress?.testsCompleted || 0) + 1,
        totalPoints: (currentUser.progress?.totalPoints || 0) + score,
        currentStreak: (currentUser.progress?.currentStreak || 0) + 1,
        averageScore: percentage
      };

      updateStudentProgress(currentUser.id, newProgress);
      setCurrentUser({
        ...currentUser,
        progress: {
          ...currentUser.progress,
          ...newProgress
        }
      });
    }
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    if (currentUser) {
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
        {/* Enhanced Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 truncate">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                <span className="block sm:inline">
                  {currentUser.shift.charAt(0).toUpperCase() + currentUser.shift.slice(1)} Shift
                </span>
                <span className="hidden sm:inline"> • </span>
                <span className="block sm:inline">
                  {currentUser.jobCategory} Category
                </span>
              </p>
            </div>
            
            {/* Mobile-optimized action section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow flex items-center justify-center sm:justify-start space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-gray-600">Online: {realTimeData.onlineUsers}</span>
              </div>
              
              {/* Mobile-friendly notification button */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-full sm:w-auto bg-white p-2.5 sm:p-2 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer relative flex items-center justify-center"
                >
                  <i className="ri-notification-line text-lg sm:text-xl text-gray-600"></i>
                  <span className="ml-2 sm:hidden text-sm text-gray-600">Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg z-50 max-h-80 sm:max-h-96 overflow-y-auto border">
                    <div className="p-3 sm:p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="sm:hidden text-gray-400 hover:text-gray-600"
                        >
                          <i className="ri-close-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                    <div className="divide-y">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <i className="ri-notification-off-line text-2xl mb-2 block"></i>
                          <span className="text-sm">No notifications</span>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleMarkNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 leading-relaxed">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                              )}
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

        {/* Enhanced Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-1 sm:space-x-4 lg:space-x-8 min-w-max px-4 sm:px-0">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
                { id: 'fees', label: 'Fees & Payments', icon: 'ri-money-rupee-circle-line' },
                { id: 'materials', label: 'Study Materials', icon: 'ri-book-line' },
                { id: 'tests', label: 'Practice Tests', icon: 'ri-quiz-line' },
                { id: 'progress', label: 'Progress', icon: 'ri-bar-chart-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-3 lg:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} text-base sm:text-lg`}></i>
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-quiz-line text-sm sm:text-lg lg:text-xl text-blue-600"></i>
                  </div>
                  <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Tests Completed</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentUser.progress?.testsCompleted || 0}</p>
                    <p className="text-xs text-blue-600 hidden sm:block">Streak: {currentUser.progress?.currentStreak || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-money-rupee-circle-line text-sm sm:text-lg lg:text-xl text-green-600"></i>
                  </div>
                  <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Fees Paid</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">₹{(currentUser.fees?.paidAmount || 0).toLocaleString()}</p>
                    <p className="text-xs text-green-600 hidden sm:block">Due: ₹{(currentUser.fees?.dueAmount || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-book-line text-sm sm:text-lg lg:text-xl text-purple-600"></i>
                  </div>
                  <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Books Issued</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentUser.library?.booksIssued?.length || 0}</p>
                    <p className="text-xs text-purple-600 hidden sm:block">
                      {currentUser.library?.booksIssued?.filter((book: any) => book.status === 'issued').length || 0} active
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="ri-trophy-line text-sm sm:text-lg lg:text-xl text-yellow-600"></i>
                  </div>
                  <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Points</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentUser.progress?.totalPoints || 0}</p>
                    <p className="text-xs text-yellow-600 hidden sm:block">Rank: #{Math.floor(Math.random() * 10) + 1}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow hover:shadow-md transition-shadow col-span-2 sm:col-span-3 lg:col-span-1">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="ri-award-line text-sm sm:text-lg lg:text-xl text-red-600"></i>
                  </div>
                  <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Certificates</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentUser.certificates?.length || 0}</p>
                    <p className="text-xs text-red-600 hidden sm:block">Earned</p>
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

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Overview</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Average Score</span>
                      <span className="text-sm text-gray-500">{currentUser.progress?.averageScore || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${currentUser.progress?.averageScore || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                      <span className="text-sm text-gray-500">{currentUser.progress?.completionRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${currentUser.progress?.completionRate || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Attendance</span>
                      <span className="text-sm text-gray-500">{Math.round(getAttendancePercentage())}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${getAttendancePercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Subject Performance</h2>
                <div className="space-y-3">
                  {currentUser.performance?.subjectWiseScore && Object.entries(currentUser.performance.subjectWiseScore).map(([subject, score]) => (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{subject}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${score as number}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-10">{score as number}%</span>
                      </div>
                    </div>
                  ))}
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
