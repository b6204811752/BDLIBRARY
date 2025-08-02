
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCurrentUser, updateStudentProgress, subscribeToDataChanges, markNotificationAsRead, getAuthData } from '@/lib/auth';
import { jobCategories } from '@/lib/study-materials';
import { getScheduleByShift } from '@/lib/schedule';

export default function StudentDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
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
    setCurrentUser(user.data);
    loadData();
    setLoading(false);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToDataChanges(() => {
      loadData();
    });

    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        onlineUsers: Math.floor(Math.random() * 20) + 15,
        activeTests: Math.floor(Math.random() * 8) + 3,
        todayMaterials: Math.floor(Math.random() * 50) + 20
      }));
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [router]);

  const loadData = () => {
    const user = getCurrentUser();
    if (user.data) {
      setCurrentUser(user.data);
      // Ensure notifications is always an array
      setNotifications(user.data.notifications || []);

      // Load announcements
      const authData = getAuthData();
      const relevantAnnouncements = (authData.announcements || []).filter(
        (ann: any) => ann.targetAudience === 'all' || ann.targetAudience === user.data.shift
      );
      setAnnouncements(relevantAnnouncements);
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

  const schedule = getScheduleByShift(currentUser.shift);
  const categoryData = jobCategories.find(cat => cat.id === currentUser.jobCategory.toLowerCase());
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-gray-600">
                {currentUser.shift.charAt(0).toUpperCase() + currentUser.shift.slice(1)} Shift • {currentUser.jobCategory} Category
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Online: {realTimeData.onlineUsers}</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="bg-white p-2 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <i className="ri-notification-line text-xl text-gray-600"></i>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="divide-y">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleMarkNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
                { id: 'fees', label: 'Fees & Payments', icon: 'ri-money-rupee-circle-line' },
                { id: 'materials', label: 'Study Materials', icon: 'ri-book-line' },
                { id: 'library', label: 'Library', icon: 'ri-book-open-line' },
                { id: 'schedule', label: 'Schedule', icon: 'ri-calendar-line' },
                { id: 'tests', label: 'Practice Tests', icon: 'ri-quiz-line' },
                { id: 'progress', label: 'Progress', icon: 'ri-bar-chart-line' },
                { id: 'certificates', label: 'Certificates', icon: 'ri-award-line' },
                { id: 'announcements', label: 'Announcements', icon: 'ri-megaphone-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} text-lg`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                    <i className="ri-money-rupee-circle-line text-xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Fees Paid</p>
                    <p className="text-2xl font-bold text-gray-900">₹{currentUser.fees?.paidAmount?.toLocaleString() || 0}</p>
                    <p className="text-xs text-green-600">Due: ₹{currentUser.fees?.dueAmount?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-book-line text-xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Books Issued</p>
                    <p className="text-2xl font-bold text-gray-900">{currentUser.library?.booksIssued?.length || 0}</p>
                    <p className="text-xs text-purple-600">
                      {currentUser.library?.booksIssued?.filter((book: any) => book.status === 'issued').length || 0} active
                    </p>
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

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="ri-award-line text-xl text-red-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Certificates</p>
                    <p className="text-2xl font-bold text-gray-900">{currentUser.certificates?.length || 0}</p>
                    <p className="text-xs text-red-600">Earned</p>
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
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-10">{score}%</span>
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

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            {/* Currently Issued Books */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Currently Issued Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentUser.library?.booksIssued?.filter((book: any) => book.status === 'issued').map((book: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{book.bookName}</h3>
                        <p className="text-sm text-gray-600">Issued: {new Date(book.issueDate).toLocaleDateString()}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          book.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {book.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Due: {new Date(book.dueDate).toLocaleDateString()}
                    </div>
                    {book.fine && (
                      <div className="text-sm text-red-600 mt-2">
                        Fine: ₹{book.fine}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Book History */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Book History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUser.library?.booksIssued?.map((book: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.bookName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(book.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(book.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.returnDate ? new Date(book.returnDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              book.status === 'returned' ? 'bg-green-100 text-green-800' :
                                book.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {book.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.fine ? `₹${book.fine}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Fines */}
            {currentUser.library?.fines?.filter((fine: any) => fine.status === 'pending').length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Fines</h2>
                <div className="space-y-3">
                  {currentUser.library.fines.filter((fine: any) => fine.status === 'pending').map((fine: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <div className="font-medium text-gray-900">{fine.reason}</div>
                        <div className="text-sm text-gray-600">{new Date(fine.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">₹{fine.amount}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Certificates</h2>
              {currentUser.certificates?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.certificates.map((certificate: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{certificate.name}</h3>
                          <p className="text-sm text-gray-600">Certificate No: {certificate.certificateNo}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            certificate.type === 'course_completion' ? 'bg-green-100 text-green-800' :
                              certificate.type === 'achievement' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {certificate.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                        Download Certificate
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-award-line text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-500">No certificates earned yet</p>
                  <p className="text-sm text-gray-400 mt-2">Complete courses and achieve milestones to earn certificates</p>
                </div>
              )}
            </div>
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

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Your Schedule - {currentUser.shift.charAt(0).toUpperCase() + currentUser.shift.slice(1)} Shift</h2>
                <div className="text-sm text-gray-500">
                  Today: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedule.map((item, index) => {
                    const isCompleted = Math.random() > 0.3;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.topic}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.instructor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.room}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {isCompleted ? 'Completed' : 'Upcoming'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                  Completed: {currentUser.progress?.testsCompleted || 0} | Average: {currentUser.progress?.averageScore || 0}%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Mock Test 1', questions: 100, duration: '2 hours', difficulty: 'Easy', completed: true, score: 85 },
                  { name: 'Mock Test 2', questions: 150, duration: '3 hours', difficulty: 'Medium', completed: true, score: 78 },
                  { name: 'Mock Test 3', questions: 200, duration: '4 hours', difficulty: 'Hard', completed: false, score: null },
                  { name: 'Previous Year Paper 1', questions: 100, duration: '2 hours', difficulty: 'Medium', completed: true, score: 92 },
                  { name: 'Previous Year Paper 2', questions: 100, duration: '2 hours', difficulty: 'Medium', completed: false, score: null },
                  { name: 'Sectional Test - Math', questions: 50, duration: '1 hour', difficulty: 'Easy', completed: true, score: 88 }
                ].map((test, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{test.name}</h3>
                      {test.completed && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {test.score}%
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p>Questions: {test.questions}</p>
                      <p>Duration: {test.duration}</p>
                      <p>Difficulty: <span
                        className={`font-medium ${
                          test.difficulty === 'Easy' ? 'text-green-600' :
                            test.difficulty === 'Medium' ? 'text-yellow-600' :
                              'text-red-600'
                        }`}
                      >
                        {test.difficulty}
                      </span></p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleTakeTest}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                          test.completed
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {test.completed ? 'Retake' : 'Take Test'}
                      </button>
                      {test.completed && (
                        <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                          <i className="ri-eye-line"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Announcements</h2>

              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="ri-megaphone-line text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-500">No announcements available</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                                announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                            }`}
                          >
                            {announcement.priority}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{announcement.date}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{announcement.message}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {announcement.author}</span>
                        {announcement.expiryDate && (
                          <span>Expires: {announcement.expiryDate}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
