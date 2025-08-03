
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  getAllStudents,
  addStudent, 
  deleteStudent, 
  updateStudent,
  Admin,
  getCurrentUser,
  debugAuthData,
  refreshAuthData,
  authenticateStudent,
  testAuthentication,
  exportDatabase,
  importDatabase,
  resetDatabase
} from '@/lib/auth';
import { Student } from '@/lib/database';
import {
  getFeeTransactions,
  createFeeTransaction,
  getStudentFeeHistory,
  getOutstandingFees,
  getFeeAnalytics,
  getFeeDefaulters,
  generateFeeReceipt,
  sendFeeReminder,
  applyFeeDiscount,
  FeeTransaction
} from '@/lib/fee-management';
import {
  getLeaderboardByCategory,
  getTopPerformers,
  getStudentStats,
  createLeaderboardEntry,
  checkAndAwardAchievements
} from '@/lib/leaderboard';
import {
  getNotifications,
  createNotification,
  triggerFeeReminderNotifications,
  sendAnnouncementToAll,
  getUnreadCount,
  runNotificationJobs
} from '@/lib/notifications';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [financialAnalytics, setFinancialAnalytics] = useState<any>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showCounselingModal, setShowCounselingModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Data states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    mobile: '',
    username: '',
    password: '',
    course: '',
    duration: 6,
    monthlyFees: 0,
    libraryAccess: false,
    examsPassed: 0,
    counselingBooked: false,
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [bulkStudents, setBulkStudents] = useState('');
  const [announcements, setAnnouncements] = useState<any>([]);
  const [newAnnouncement, setNewAnnouncement] = useState<{
    title: string;
    message: string;
    priority: 'medium' | 'low' | 'high';
    targetAudience: string[] | 'all' | 'morning' | 'afternoon' | 'evening';
    expiryDate: string;
  }>({
    title: '',
    message: '',
    priority: 'medium',
    targetAudience: 'all',
    expiryDate: ''
  });

  // Real-time updates
  const [realTimeStats, setRealTimeStats] = useState({
    onlineUsers: 0,
    activeTests: 0,
    newNotifications: 0
  });

  // Fee management states
  const [feeTransactions, setFeeTransactions] = useState<FeeTransaction[]>([]);
  const [feeAnalytics, setFeeAnalytics] = useState<any>(null);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedStudentForFee, setSelectedStudentForFee] = useState<Student | null>(null);

  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Message and error states
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Payment, discount, library, exam, and counseling data states
  const [paymentData, setPaymentData] = useState({
    studentId: '',
    amount: '',
    method: 'cash' as 'cash' | 'card' | 'upi' | 'bank_transfer',
    transactionId: '',
    receiptNo: '',
    description: ''
  });

  const [discountData, setDiscountData] = useState({
    studentId: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    reason: ''
  });

  const [libraryData, setLibraryData] = useState({
    studentId: '',
    bookName: '',
    action: 'issue' as 'issue' | 'return',
    bookId: ''
  });

  const [examData, setExamData] = useState({
    studentId: '',
    examName: '',
    totalMarks: '',
    obtainedMarks: '',
    subjects: [{ name: '', marks: '', totalMarks: '' }]
  });

  const [counselingData, setCounselingData] = useState({
    studentId: '',
    counselor: '',
    topic: '',
    notes: '',
    nextSession: ''
  });

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated admin
    const checkAuth = async () => {
      const user = getCurrentUser();
      if (!user || !user.type || user.type !== 'admin') {
        router.push('/login');
        return;
      }
      
      setCurrentUser(user.data);
      await loadData();
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  const loadData = async () => {
    try {
      const studentsData = await getAllStudents();
      setStudents(studentsData);
      // Set empty arrays for missing features that will be implemented later
      setAnnouncements([]);
      setAnalytics({
        totalStudents: studentsData.length,
        activeStudents: studentsData.length,
        averageAttendance: 0,
        averageScore: 0,
        topPerformers: [],
        shiftDistribution: { morning: 0, afternoon: 0, evening: 0 },
        categoryDistribution: {}
      });
      setFinancialAnalytics({
        totalRevenue: 0,
        totalDues: 0,
        totalDiscounts: 0,
        overduePayments: 0,
        monthlyRevenue: {},
        paymentMethodStats: {},
        defaulters: []
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await addStudent({
        name: newStudent.name,
        email: newStudent.email,
        mobile: newStudent.mobile,
        course: newStudent.course || 'General'
      });

      if (success) {
        setMessage('Student added successfully!');
        setNewStudent({
          name: '',
          email: '',
          mobile: '',
          username: '',
          password: '',
          course: '',
          duration: 6,
          monthlyFees: 0,
          libraryAccess: false,
          examsPassed: 0,
          counselingBooked: false,
          joinDate: new Date().toISOString().split('T')[0]
        });
        setShowAddModal(false);
        
        // Show success popup
        setSuccessMessage(`Student "${newStudent.name}" has been successfully added!`);
        setShowSuccessPopup(true);
        
        // Auto-hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
        
        await loadData(); // Refresh the student list
      } else {
        setError('Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const lines = bulkStudents.split('\n').filter((line: string) => line.trim());
    let successCount = 0;
    let errorCount = 0;

    for (const line of lines) {
      const [name, email, course] = line.split(',').map((s: string) => s.trim());
      if (name && email && course) {
        try {
          await addStudent({
            name,
            email,
            mobile: '9999999999', // Default mobile number
            course: course || 'General'
          });
          successCount++;
        } catch (error) {
          console.error('Error adding student:', error);
          errorCount++;
        }
      }
    }

    setBulkStudents('');
    setShowBulkUpload(false);
    
    if (successCount > 0) {
      setMessage(`Successfully added ${successCount} student${successCount > 1 ? 's' : ''}!${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
    }
    
    await loadData();
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const success = await deleteStudent(id);
      if (success) {
        await loadData();
      } else {
        console.error('Failed to delete student');
      }
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      const success = await updateStudent(selectedStudent.id, selectedStudent);
      if (success) {
        setShowEditModal(false);
        setSelectedStudent(null);
        await loadData();
      } else {
        console.error('Failed to update student');
      }
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    // Announcements feature will be implemented later
    console.log('Announcements feature coming soon');
    setNewAnnouncement({
      title: '',
      message: '',
      priority: 'medium',
      targetAudience: 'all',
      expiryDate: ''
    });
    setShowAnnouncementModal(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      console.log('Delete announcement feature coming soon');
    }
  };

  const resetStudentProgress = (studentId: string) => {
    if (confirm('Are you sure you want to reset this student\'s progress?')) {
      console.log('Reset progress feature coming soon');
    }
  };

  const toggleStudentStatus = async (studentId: string, currentStatus: string) => {
    console.log('Toggle status feature coming soon');
  };

  const sendNotificationToStudent = (studentId: string, message: string) => {
    console.log('Send notification feature coming soon');
  };

  const handleExport = (format: 'csv' | 'json') => {
    console.log('Export feature coming soon');
    setShowExportModal(false);
  };

  const filteredStudents = students.filter((student: Student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    // Remove filters that don't exist in simplified Student interface                    
    return matchesSearch;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'email':
        aValue = a.email;
        bValue = b.email;
        break;
      case 'joinDate':
        aValue = new Date(a.enrollmentDate);
        bValue = new Date(b.enrollmentDate);
        break;
      case 'progress':
        aValue = 0; // examsPassed not available in simplified interface
        bValue = 0;
        break;
      case 'attendance':
        aValue = 0; // Attendance not available in simplified interface
        bValue = 0;
        break;
      case 'score':
        aValue = 0; // Use 0 as default score
        bValue = 0;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    </div>;
  }

  if (!currentUser) {
    return null;
  }

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentData.studentId && paymentData.amount) {
      // Payment feature will be implemented later
      console.log('Payment feature coming soon');

      setPaymentData({
        studentId: '',
        amount: '',
        method: 'cash',
        transactionId: '',
        receiptNo: '',
        description: ''
      });
      setShowPaymentModal(false);
    }
  };

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountData.studentId && discountData.value) {
      // Discount feature will be implemented later
      console.log('Discount feature coming soon');

      setDiscountData({
        studentId: '',
        type: 'percentage',
        value: '',
        reason: ''
      });
      setShowDiscountModal(false);
      loadData();
    }
  };

  const handleLibraryAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (libraryData.studentId) {
      if (libraryData.action === 'issue' && libraryData.bookName) {
        // Library book issue feature will be implemented later
        console.log('Library book issue feature coming soon');
      } else if (libraryData.action === 'return' && libraryData.bookId) {
        console.log('Return book feature coming soon');
      }

      setLibraryData({
        studentId: '',
        bookName: '',
        action: 'issue',
        bookId: ''
      });
      setShowLibraryModal(false);
      loadData();
    }
  };

  const handleAddExamResult = (e: React.FormEvent) => {
    e.preventDefault();

    if (examData.studentId && examData.examName) {
      const totalMarks = parseInt(examData.totalMarks);
      const obtainedMarks = parseInt(examData.obtainedMarks);

      // Exam result feature will be implemented later
      console.log('Exam result feature coming soon');

      setExamData({
        studentId: '',
        examName: '',
        totalMarks: '',
        obtainedMarks: '',
        subjects: [{ name: '', marks: '', totalMarks: '' }]
      });
      setShowExamModal(false);
      loadData();
    }
  };

  const handleAddCounselingSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (counselingData.studentId) {
      // Counseling session feature will be implemented later
      console.log('Counseling session feature coming soon');

      setCounselingData({
        studentId: '',
        counselor: '',
        topic: '',
        notes: '',
        nextSession: ''
      });
      setShowCounselingModal(false);
      loadData();
    }
  };

  const handleViewStudent = (student: Student) => {
    console.log('View student details:', student);
    // View student feature will be implemented later
  };

  const handleStudentPayment = (student: Student) => {
    setPaymentData({
      studentId: student.id,
      amount: '',
      description: '',
      method: 'cash',
      transactionId: '',
      receiptNo: ''
    });
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Admin Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="ri-admin-fill text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg">Real-time monitoring and management system</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-sm font-medium text-gray-700">System Status: Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-time-line text-gray-500"></i>
                  <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Real-time Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 rounded-xl shadow-lg border border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Online Users</p>
                    <p className="text-white text-xl font-bold">{realTimeStats.onlineUsers}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="ri-user-line text-white text-lg"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 rounded-xl shadow-lg border border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Tests</p>
                    <p className="text-white text-xl font-bold">{realTimeStats.activeTests}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="ri-test-tube-line text-white text-lg"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 rounded-xl shadow-lg border border-purple-400 col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Notifications</p>
                    <p className="text-white text-xl font-bold">{realTimeStats.newNotifications}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="ri-notification-line text-white text-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <nav className="flex flex-wrap">
              {[ 
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-fill', color: 'blue' },
                { id: 'students', label: 'Students', icon: 'ri-user-fill', color: 'green' },
                { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-fill', color: 'purple' },
                { id: 'database', label: 'Database', icon: 'ri-database-fill', color: 'indigo' },
                { id: 'announcements', label: 'Announcements', icon: 'ri-megaphone-fill', color: 'orange' },
                { id: 'reports', label: 'Reports', icon: 'ri-file-chart-fill', color: 'red' },
                { id: 'debug', label: 'Debug', icon: 'ri-bug-fill', color: 'yellow' },
                { id: 'settings', label: 'Settings', icon: 'ri-settings-fill', color: 'gray' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-4 font-medium text-sm transition-all duration-300 cursor-pointer border-b-4 hover:bg-gray-50 flex-1 justify-center min-w-0 ${
                    activeTab === tab.id
                      ? `border-blue-500 bg-blue-50 text-blue-700`
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    activeTab === tab.id 
                      ? `bg-blue-500 text-white shadow-lg scale-110` 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <i className={`${tab.icon} text-lg`}></i>
                  </div>
                  <span className="font-semibold truncate">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Enhanced Dashboard Tab */}
        {activeTab === 'dashboard' && analytics && financialAnalytics && (
          <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-400">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Students</p>
                    <p className="text-3xl font-bold mb-2">{analytics.totalStudents}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <i className="ri-arrow-up-line text-green-300"></i>
                        <span className="text-green-300 text-sm font-medium">+{Math.floor(Math.random() * 5)} this week</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <i className="ri-user-fill text-3xl text-white"></i>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-400/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-100">Active: {analytics.activeStudents}</span>
                    <span className="text-blue-100">Growth: +5.2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-400">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold mb-2">₹{financialAnalytics.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <i className="ri-arrow-up-line text-green-300"></i>
                        <span className="text-green-300 text-sm font-medium">This month</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <i className="ri-money-rupee-circle-fill text-3xl text-white"></i>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-400/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-100">Target: ₹{(financialAnalytics.totalRevenue * 1.2).toLocaleString()}</span>
                    <span className="text-green-100">Monthly: +12.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-red-400">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-red-100 text-sm font-medium mb-1">Total Dues</p>
                    <p className="text-3xl font-bold mb-2">₹{financialAnalytics.totalDues.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <i className="ri-alert-line text-red-300"></i>
                        <span className="text-red-300 text-sm font-medium">{financialAnalytics.overduePayments} overdue</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <i className="ri-money-rupee-circle-line text-3xl text-white"></i>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-red-400/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-100">Collection Rate: 78%</span>
                    <span className="text-red-100">Urgent: {Math.ceil(financialAnalytics.overduePayments/2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-400">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-purple-100 text-sm font-medium mb-1">Avg Attendance</p>
                    <p className="text-3xl font-bold mb-2">{Math.round(analytics.averageAttendance)}%</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <i className="ri-arrow-up-line text-purple-300"></i>
                        <span className="text-purple-300 text-sm font-medium">+2% this month</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <i className="ri-calendar-check-fill text-3xl text-white"></i>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-400/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-100">Target: 90%</span>
                    <span className="text-purple-100">Weekly: +1.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-yellow-400">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-yellow-100 text-sm font-medium mb-1">Avg Score</p>
                    <p className="text-3xl font-bold mb-2">{Math.round(analytics.averageScore)}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <i className="ri-arrow-up-line text-yellow-300"></i>
                        <span className="text-yellow-300 text-sm font-medium">+3 pts this week</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <i className="ri-trophy-fill text-3xl text-white"></i>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-yellow-400/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-100">Top Score: 95</span>
                    <span className="text-yellow-100">Improvement: +8%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-orange-400">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-orange-100 text-sm font-medium mb-1">Discounts Given</p>
                    <p className="text-3xl font-bold mb-2">₹{financialAnalytics.totalDiscounts.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <i className="ri-discount-percent-line text-orange-300"></i>
                        <span className="text-orange-300 text-sm font-medium">Total given</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <i className="ri-discount-percent-fill text-3xl text-white"></i>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-orange-400/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-orange-100">Students: {Math.floor(financialAnalytics.totalDiscounts/1000)}</span>
                    <span className="text-orange-100">Avg: ₹{Math.round(financialAnalytics.totalDiscounts/Math.max(1, Math.floor(financialAnalytics.totalDiscounts/1000)))}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
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
                  <p className="text-gray-600 text-lg">Streamline your administrative tasks</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                  {/* Add Student */}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-blue-200 hover:border-blue-400 relative overflow-hidden quick-action-button"
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-user-add-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle icon-glow"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-blue-700 transition-colors">Add Student</h3>
                      <p className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">Register new students</p>
                      
                      {/* Progress indicator */}
                      <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-3/4 transform transition-all duration-500 group-hover:w-full"></div>
                      </div>
                      
                      {/* Floating badge */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce floating-badge">
                        <i className="ri-add-line text-white text-xs font-bold"></i>
                      </div>
                    </div>
                  </button>

                  {/* Bulk Upload */}
                  <button
                    onClick={() => setShowBulkUpload(true)}
                    className="group bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-indigo-200 hover:border-indigo-400 relative overflow-hidden quick-action-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 to-indigo-600/0 group-hover:from-indigo-400/10 group-hover:to-indigo-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-file-upload-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle icon-glow"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-indigo-700 transition-colors">Bulk Upload</h3>
                      <p className="text-xs text-gray-600 group-hover:text-indigo-600 transition-colors">Import multiple records</p>
                      
                      <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full w-1/2 transform transition-all duration-500 group-hover:w-full"></div>
                      </div>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce floating-badge">
                        <i className="ri-upload-line text-white text-xs"></i>
                      </div>
                    </div>
                  </button>

                  {/* Add Payment */}
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-green-200 hover:border-green-400 relative overflow-hidden quick-action-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/10 group-hover:to-green-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-money-rupee-circle-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle icon-glow"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-green-700 transition-colors">Add Payment</h3>
                      <p className="text-xs text-gray-600 group-hover:text-green-600 transition-colors">Record fee payments</p>
                      
                      <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full w-4/5 transform transition-all duration-500 group-hover:w-full"></div>
                      </div>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce floating-badge">
                        <span className="text-white text-xs font-bold">₹</span>
                      </div>
                    </div>
                  </button>

                  {/* Apply Discount */}
                  <button
                    onClick={() => setShowDiscountModal(true)}
                    className="group bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-orange-200 hover:border-orange-400 relative overflow-hidden quick-action-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-orange-600/0 group-hover:from-orange-400/10 group-hover:to-orange-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-discount-percent-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle icon-glow"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-orange-700 transition-colors">Apply Discount</h3>
                      <p className="text-xs text-gray-600 group-hover:text-orange-600 transition-colors">Manage fee discounts</p>
                      
                      <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-2/3 transform transition-all duration-500 group-hover:w-full"></div>
                      </div>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce floating-badge">
                        <span className="text-white text-xs font-bold">%</span>
                      </div>
                    </div>
                  </button>

                  {/* Library Management */}
                  <button
                    onClick={() => setShowLibraryModal(true)}
                    className="group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-purple-200 hover:border-purple-400 relative overflow-hidden quick-action-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/10 group-hover:to-purple-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-book-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle icon-glow"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-purple-700 transition-colors">Library</h3>
                      <p className="text-xs text-gray-600 group-hover:text-purple-600 transition-colors">Book management</p>
                      
                      <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-3/5 transform transition-all duration-500 group-hover:w-full"></div>
                      </div>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce floating-badge">
                        <i className="ri-book-line text-white text-xs"></i>
                      </div>
                    </div>
                  </button>

                  {/* Quick Announcements */}
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="group bg-white hover:bg-gradient-to-br hover:from-pink-50 hover:to-pink-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-pink-200 hover:border-pink-400 relative overflow-hidden quick-action-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/0 to-pink-600/0 group-hover:from-pink-400/10 group-hover:to-pink-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-megaphone-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle icon-glow"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-pink-700 transition-colors">Announcements</h3>
                      <p className="text-xs text-gray-600 group-hover:text-pink-600 transition-colors">Broadcast messages</p>
                      
                      <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full w-1/2 transform transition-all duration-500 group-hover:w-full"></div>
                      </div>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce floating-badge">
                        <i className="ri-volume-up-line text-white text-xs"></i>
                      </div>
                    </div>
                  </button>

                  {/* Exam Management */}
                  <button
                    onClick={() => setShowExamModal(true)}
                    className="group bg-white hover:bg-gradient-to-br hover:from-cyan-50 hover:to-cyan-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-cyan-200 hover:border-cyan-400 relative overflow-hidden quick-action-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-cyan-600/0 group-hover:from-cyan-400/10 group-hover:to-cyan-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-quiz-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle icon-glow"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-cyan-700 transition-colors">Exams</h3>
                      <p className="text-xs text-gray-600 group-hover:text-cyan-600 transition-colors">Manage exam results</p>
                      
                      <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full w-1/2 transform transition-all duration-500 group-hover:w-full"></div>
                      </div>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce floating-badge">
                        <i className="ri-question-line text-white text-xs"></i>
                      </div>
                    </div>
                  </button>

                  {/* Export Data */}
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="group bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-gray-200 hover:border-gray-400 relative overflow-hidden quick-action-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400/0 to-gray-600/0 group-hover:from-gray-400/10 group-hover:to-gray-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-download-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle icon-glow"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-gray-700 transition-colors">Export Data</h3>
                      <p className="text-xs text-gray-600 group-hover:text-gray-600 transition-colors">Download reports</p>
                      
                      <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gray-500 to-gray-600 rounded-full w-full transform transition-all duration-500"></div>
                      </div>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce floating-badge">
                        <i className="ri-check-line text-white text-xs"></i>
                      </div>
                    </div>
                  </button>

                  {/* Certificate Management */}
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="group bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-yellow-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border-2 border-yellow-200 hover:border-yellow-400 relative overflow-hidden quick-action-button col-span-2 sm:col-span-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-600/0 group-hover:from-yellow-400/10 group-hover:to-yellow-600/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <i className="ri-award-fill text-2xl sm:text-3xl text-white group-hover:animate-wiggle icon-glow"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 group-hover:text-yellow-700 transition-colors">Certificates</h3>
                      <p className="text-xs text-gray-600 group-hover:text-yellow-600 transition-colors">Issue certificates</p>
                      
                      <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full w-1/3 transform transition-all duration-500 group-hover:w-full"></div>
                      </div>
                      
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-bounce floating-badge">
                        <i className="ri-star-fill text-white text-xs"></i>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Quick Stats and Tips Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/60 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <i className="ri-bar-chart-fill text-white text-sm"></i>
                      </div>
                      <h4 className="font-semibold text-gray-800">Today's Activity</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{Math.floor(Math.random() * 10) + 5}</p>
                        <p className="text-xs text-gray-600">New Students</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">₹{(Math.floor(Math.random() * 50) + 20) * 1000}</p>
                        <p className="text-xs text-gray-600">Payments</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-600">{Math.floor(Math.random() * 5) + 2}</p>
                        <p className="text-xs text-gray-600">Announcements</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/60 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <i className="ri-lightbulb-fill text-white text-sm"></i>
                      </div>
                      <h4 className="font-semibold text-gray-800">Admin Tip</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {[
                        "Use bulk upload to save time when adding multiple students.",
                        "Regular announcements keep students and parents informed.",
                        "Monitor payment dues weekly to maintain cash flow.",
                        "Export data regularly for backup and analysis.",
                        "Use discounts strategically to improve enrollment."
                      ][Math.floor(Math.random() * 5)]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Financial Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-2xl shadow-xl border border-indigo-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ri-wallet-fill text-white text-xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Payment Methods</h2>
                </div>
                <div className="space-y-4">
                  {Object.entries(financialAnalytics.paymentMethodStats).map(([method, stats]: [string, any]) => (
                    <div key={method} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          method === 'cash' ? 'bg-green-100' : 
                          method === 'card' ? 'bg-blue-100' : 
                          method === 'upi' ? 'bg-purple-100' : 'bg-gray-100'
                        }`}>
                          <i className={`${
                            method === 'cash' ? 'ri-money-rupee-circle-fill text-green-600' : 
                            method === 'card' ? 'ri-bank-card-fill text-blue-600' : 
                            method === 'upi' ? 'ri-smartphone-fill text-purple-600' : 'ri-bank-fill text-gray-600'
                          }`}></i>
                        </div>
                        <span className="font-semibold text-gray-700 capitalize">{method}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{stats.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{stats.count} transactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-red-50 p-8 rounded-2xl shadow-xl border border-red-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ri-alarm-warning-fill text-white text-xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Fee Defaulters</h2>
                </div>
                <div className="space-y-4">
                  {financialAnalytics.defaulters.slice(0, 5).map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-sm">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">₹{student.monthlyFees}</p>
                        <p className="text-sm text-gray-500">Monthly fee</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Enhanced Search and Filter Controls */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ri-filter-fill text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Advanced Filters
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterShift('all');
                    setFilterCategory('all');
                    setFilterStatus('all');
                    setSortBy('name');
                    setSortOrder('asc');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Reset Filters
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Search by name, email, or mobile..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shift</label>
                  <select
                    value={filterShift}
                    onChange={(e) => setFilterShift(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white"
                  >
                    <option value="all">All Shifts</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="Banking">Banking</option>
                    <option value="SSC">SSC</option>
                    <option value="Railway">Railway</option>
                    <option value="UPSC">UPSC</option>
                    <option value="State">State Government</option>
                    <option value="Defense">Defense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
                  <div className="flex space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white"
                    >
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="joinDate">Join Date</option>
                      <option value="progress">Progress</option>
                      <option value="attendance">Attendance</option>
                      <option value="score">Score</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-3 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-300 bg-white"
                    >
                      <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line text-gray-600`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Students Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ri-group-fill text-white"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Students Management
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Total {sortedStudents.length} students registered
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg font-medium cursor-pointer"
                  >
                    <i className="ri-add-line text-lg"></i>
                    <span>Add Student</span>
                  </button>
                  <button
                    onClick={() => setShowBulkUpload(true)}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg font-medium cursor-pointer"
                  >
                    <i className="ri-file-upload-line text-lg"></i>
                    <span>Bulk Upload</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg font-medium cursor-pointer"
                  >
                    <i className="ri-money-rupee-circle-line text-lg"></i>
                    <span>Payment</span>
                  </button>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-lg font-medium cursor-pointer"
                  >
                    <i className="ri-download-line text-lg"></i>
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-blue-100">
                        <div className="flex items-center space-x-2">
                          <i className="ri-user-fill text-blue-500"></i>
                          <span>Student</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-blue-100">
                        <div className="flex items-center space-x-2">
                          <i className="ri-phone-fill text-green-500"></i>
                          <span>Contact</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-blue-100">
                        <div className="flex items-center space-x-2">
                          <i className="ri-book-fill text-purple-500"></i>
                          <span>Course Info</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-blue-100">
                        <div className="flex items-center space-x-2">
                          <i className="ri-money-rupee-circle-fill text-yellow-500"></i>
                          <span>Fee Status</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-blue-100">
                        <div className="flex items-center space-x-2">
                          <i className="ri-bar-chart-fill text-indigo-500"></i>
                          <span>Performance</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-blue-100">
                        <div className="flex items-center space-x-2">
                          <i className="ri-shield-check-fill text-green-500"></i>
                          <span>Status</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-blue-100">
                        <div className="flex items-center space-x-2">
                          <i className="ri-settings-fill text-gray-500"></i>
                          <span>Actions</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {sortedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group">
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <span className="text-white font-bold text-lg">{student.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{student.name}</div>
                              <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-block mt-1">ID: {student.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-900">
                              <i className="ri-mail-fill text-blue-500"></i>
                              <span>{student.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <i className="ri-phone-fill text-green-500"></i>
                              <span>{student.mobile}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-900">{student.course}</div>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            student.libraryAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student.libraryAccess ? 'Library Access' : 'No Library Access'}
                          </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-900">
                              <i className="ri-time-fill text-orange-500"></i>
                              <span>Duration: {student.duration} months</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm font-medium text-green-600">
                              <i className="ri-money-rupee-circle-fill text-green-500"></i>
                              <span>₹{student.monthlyFees}/month</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                                <i className="ri-trophy-fill text-white text-sm"></i>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">Exams Passed</div>
                                <div className="text-lg font-bold text-purple-600">{student.examsPassed}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <i className={`ri-calendar-check-fill ${student.counselingBooked ? 'text-green-500' : 'text-gray-400'}`}></i>
                              <span className={student.counselingBooked ? 'text-green-600 font-medium' : 'text-gray-500'}>
                                Counseling {student.counselingBooked ? 'Booked' : 'Not Booked'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <i className="ri-calendar-fill text-blue-500"></i>
                              <span>Joined: {student.joinDate}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-xl shadow-lg ${
                            student.libraryAccess ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                          }`}>
                            <i className={`${student.libraryAccess ? 'ri-check-fill' : 'ri-close-fill'} mr-2`}></i>
                            {student.libraryAccess ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:text-blue-700 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                              title="Edit Student"
                            >
                              <i className="ri-edit-2-fill"></i>
                            </button>
                            <button
                              onClick={() => handleViewStudent(student)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 hover:text-green-700 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                              title="View Details"
                            >
                              <i className="ri-eye-fill"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:text-red-700 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                              title="Delete Student"
                            >
                              <i className="ri-delete-bin-fill"></i>
                            </button>
                            <button
                              onClick={() => handleStudentPayment(student)}
                              className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 hover:text-yellow-700 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                              title="Payment History"
                            >
                              <i className="ri-money-rupee-circle-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Analytics Tab */}
        {activeTab === 'analytics' && analytics && financialAnalytics && (
          <div className="space-y-8">
            {/* Financial Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-xl border border-green-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ri-money-rupee-circle-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Revenue Overview</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium">Total Revenue</span>
                    <span className="font-bold text-green-600 text-lg">₹{financialAnalytics.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium">Pending Dues</span>
                    <span className="font-bold text-red-600 text-lg">₹{financialAnalytics.totalDues.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium">Discounts Given</span>
                    <span className="font-bold text-orange-600 text-lg">₹{financialAnalytics.totalDiscounts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm">
                    <span className="text-gray-700 font-semibold">Collection Rate</span>
                    <span className="font-bold text-blue-700 text-xl">
                      {Math.round((financialAnalytics.totalRevenue / (financialAnalytics.totalRevenue + financialAnalytics.totalDues)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ri-book-open-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Library Stats</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium">Library Access</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {students.filter(s => s.libraryAccess).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium">Total Students</span>
                    <span className="font-bold text-green-600 text-lg">
                      {students.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium">Counseling Booked</span>
                    <span className="font-bold text-orange-600 text-lg">
                      {students.filter(s => s.counselingBooked).length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-xl border border-purple-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="ri-trophy-fill text-white text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Exam Performance</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium">Total Exams Passed</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {students.reduce((sum, s) => sum + s.examsPassed, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium">Avg Exams Per Student</span>
                    <span className="font-bold text-green-600 text-lg">
                      {Math.round(students.reduce((sum, s) => sum + s.examsPassed, 0) / students.length)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">High Performers</span>
                    <span className="font-bold text-purple-600">
                      {students.filter(s => s.examsPassed > 2).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Modals */}
        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Payment</h3>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={paymentData.studentId}
                    onChange={(e) => setPaymentData({ ...paymentData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                  <input
                    type="text"
                    value={paymentData.receiptNo}
                    onChange={(e) => setPaymentData({ ...paymentData, receiptNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={paymentData.description}
                    onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    maxLength={500}
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Add Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Discount Modal */}
        {showDiscountModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Apply Discount</h3>
              <form onSubmit={handleApplyDiscount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={discountData.studentId}
                    onChange={(e) => setDiscountData({ ...discountData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={discountData.type}
                    onChange={(e) => setDiscountData({ ...discountData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value {discountData.type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={discountData.value}
                    onChange={(e) => setDiscountData({ ...discountData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={discountData.reason}
                    onChange={(e) => setDiscountData({ ...discountData, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    maxLength={500}
                    required
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDiscountModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Apply Discount
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Library Modal */}
        {showLibraryModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Library Management</h3>
              <form onSubmit={handleLibraryAction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={libraryData.studentId}
                    onChange={(e) => setLibraryData({ ...libraryData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <select
                    value={libraryData.action}
                    onChange={(e) => setLibraryData({ ...libraryData, action: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="issue">Issue Book</option>
                    <option value="return">Return Book</option>
                  </select>
                </div>
                {libraryData.action === 'issue' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
                    <input
                      type="text"
                      value={libraryData.bookName}
                      onChange={(e) => setLibraryData({ ...libraryData, bookName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}
                {libraryData.action === 'return' && libraryData.studentId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Book to Return</label>
                    <select
                      value={libraryData.bookId}
                      onChange={(e) => setLibraryData({ ...libraryData, bookId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                      required
                    >
                      <option value="">Select Book</option>
                      {/* Book selection will be implemented when library system is added */}
                      <option value="book1">Sample Book 1</option>
                      <option value="book2">Sample Book 2</option>
                      <option value="book3">Sample Book 3</option>
                    </select>
                  </div>
                )}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLibraryModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {libraryData.action === 'issue' ? 'Issue Book' : 'Return Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Student</h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={newStudent.mobile}
                    onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter 10-digit mobile number"
                    required
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Student Login Credentials</h4>
                  <p className="text-sm text-blue-700">
                    The student will login using:
                  </p>
                  <ul className="text-sm text-blue-700 mt-1 ml-4 list-disc">
                    <li><strong>Username:</strong> Email address entered above</li>
                    <li><strong>Password:</strong> Mobile number entered above</li>
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <input
                    type="text"
                    value={newStudent.course}
                    onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter course name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Duration (Months)</label>
                  <select
                    value={newStudent.duration}
                    onChange={(e) => setNewStudent({ ...newStudent, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="18">18 Months</option>
                    <option value="24">24 Months</option>
                  </select>
                </div>

                {/* Monthly Fee Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee Amount (₹)</label>
                  <input
                    type="number"
                    value={newStudent.monthlyFees}
                    onChange={(e) => setNewStudent({ ...newStudent, monthlyFees: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter monthly fee amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Total Fee Summary */}
                {newStudent.monthlyFees > 0 && newStudent.duration && (
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">Total Course Fee:</span>
                      <span className="text-lg font-bold text-blue-900">
                        ₹{(newStudent.monthlyFees * newStudent.duration).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-blue-600">Duration:</span>
                      <span className="text-xs text-blue-600">{newStudent.duration} months</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-blue-600">Monthly Fee:</span>
                      <span className="text-xs text-blue-600">₹{newStudent.monthlyFees.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewStudent({
                        name: '',
                        email: '',
                        mobile: '',
                        username: '',
                        password: '',
                        course: '',
                        duration: 6,
                        monthlyFees: 0,
                        libraryAccess: false,
                        examsPassed: 0,
                        counselingBooked: false,
                        joinDate: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Student</h3>
              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={selectedStudent.name}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={selectedStudent.email}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={selectedStudent.mobile || ''}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                  <input
                    type="number"
                    value={selectedStudent.duration}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                    max="24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <input
                    type="text"
                    value={selectedStudent.course}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter course name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Library Access</label>
                  <select
                    value={selectedStudent.libraryAccess ? 'true' : 'false'}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, libraryAccess: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedStudent(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Update Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkUpload && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Bulk Upload Students</h3>
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-2">Format: Each line should contain:</p>
                <code className="text-xs bg-gray-200 p-2 rounded block">Name, Email, Course</code>
                <p className="text-xs text-gray-500 mt-2">Example: John Doe, john@email.com, 9876543210, morning, Banking</p>
              </div>
              <form onSubmit={handleBulkUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Data</label>
                  <textarea
                    value={bulkStudents}
                    onChange={(e) => setBulkStudents(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    placeholder="Enter student data, one per line..."
                    required
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBulkUpload(false);
                      setBulkStudents('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Upload Students
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-bounce-in">
              <div className="p-6">
                {/* Success Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                
                {/* Success Message */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Success!
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {successMessage}
                </p>
                
                {/* Action Buttons */}
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowSuccessPopup(false)}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                  >
                    Great!
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessPopup(false);
                      setShowAddModal(true);
                    }}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Add Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Tab */}
        {activeTab === 'debug' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-xl border border-yellow-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="ri-bug-fill text-white"></i>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Authentication Debug Panel
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Debug Actions */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i className="ri-tools-fill text-yellow-600 mr-2"></i>
                    Debug Actions
                  </h4>
                  
                  <div className="space-y-4">
                    <button
                      onClick={async () => {
                        console.log('🔍 Running debug check...');
                        await debugAuthData();
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <i className="ri-search-line"></i>
                      <span>Check Current Auth Data</span>
                    </button>

                    <button
                      onClick={async () => {
                        console.log('🔄 Refreshing auth data...');
                        await refreshAuthData();
                        await loadData(); // Reload the admin data
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <i className="ri-refresh-line"></i>
                      <span>Refresh Auth Data</span>
                    </button>

                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          localStorage.clear();
                          console.log('🗑️ LocalStorage cleared');
                          window.location.reload();
                        }
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <i className="ri-delete-bin-line"></i>
                      <span>Clear All Data & Reload</span>
                    </button>
                  </div>
                </div>

                {/* Test Authentication */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i className="ri-shield-check-line text-green-600 mr-2"></i>
                    Test Authentication
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Test Email</label>
                      <input
                        type="email"
                        placeholder="Enter email to test"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="testEmail"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Test Mobile</label>
                      <input
                        type="tel"
                        placeholder="Enter mobile to test"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="testMobile"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        const email = (document.getElementById('testEmail') as HTMLInputElement)?.value;
                        const mobile = (document.getElementById('testMobile') as HTMLInputElement)?.value;
                        
                        if (email && mobile) {
                          console.log('🧪 Testing authentication for:', { email, mobile });
                          const result = await authenticateStudent(email, mobile);
                          if (result) {
                            console.log('✅ Authentication test PASSED:', result.name);
                            alert(`✅ Authentication successful for ${result.name}`);
                          } else {
                            console.log('❌ Authentication test FAILED');
                            alert('❌ Authentication failed');
                          }
                        } else {
                          alert('Please enter both email and mobile');
                        }
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <i className="ri-play-line"></i>
                      <span>Test Authentication</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Data Summary */}
              <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="ri-database-line text-purple-600 mr-2"></i>
                  Current Data Summary
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                    <div className="text-sm text-blue-800">Total Students</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {students.filter(s => s.joinDate === new Date().toISOString().split('T')[0]).length}
                    </div>
                    <div className="text-sm text-green-800">Added Today</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                      {typeof window !== 'undefined' && localStorage.getItem('authData') ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-purple-800">LocalStorage Data</div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">Instructions:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use "Check Current Auth Data" to see all students in console</li>
                    <li>• Use "Test Authentication" to verify login credentials work</li>
                    <li>• Check browser console for detailed debug information</li>
                    <li>• If students still can't login, try "Refresh Auth Data"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database Management Tab */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="ri-database-fill text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">File-Based Database Management</h3>
                    <p className="text-indigo-100 text-sm">Manage your data with a simple file-based approach</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Database Info */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <i className="ri-information-line text-indigo-600 mr-2"></i>
                      Database Information
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Storage Method:</span>
                        <span className="font-semibold text-indigo-600">localStorage (Browser)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-semibold text-gray-800">{students.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Active Students:</span>
                        <span className="font-semibold text-green-600">
                          {students.filter(s => s.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-semibold text-gray-600 text-sm">
                          {new Date().toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-white/60 rounded-lg border border-indigo-200">
                      <h5 className="font-semibold text-gray-800 mb-2">How it works:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Data is stored in browser's localStorage</li>
                        <li>• Acts like a simple JSON database file</li>
                        <li>• Persists across browser sessions</li>
                        <li>• Admin can export/import data easily</li>
                        <li>• Perfect for small to medium datasets</li>
                      </ul>
                    </div>
                  </div>

                  {/* Database Operations */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <i className="ri-tools-line text-blue-600 mr-2"></i>
                      Database Operations
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Export Database */}
                      <button
                        onClick={async () => {
                          try {
                            const data = await exportDatabase();
                            const blob = new Blob([data], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `bd_library_database_${new Date().toISOString().split('T')[0]}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            alert('✅ Database exported successfully!');
                          } catch (error) {
                            alert('❌ Failed to export database');
                            console.error('Export error:', error);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <i className="ri-download-line text-lg"></i>
                        <span>Export Database (JSON)</span>
                      </button>

                      {/* Import Database */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Import Database File:
                        </label>
                        <input
                          type="file"
                          accept=".json"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const text = await file.text();
                                const success = await importDatabase(text);
                                if (success) {
                                  alert('✅ Database imported successfully!');
                                  window.location.reload(); // Refresh to show new data
                                } else {
                                  alert('❌ Failed to import database. Please check the file format.');
                                }
                              } catch (error) {
                                alert('❌ Error importing database');
                                console.error('Import error:', error);
                              }
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Reset Database */}
                      <button
                        onClick={async () => {
                          if (confirm('⚠️ Are you sure you want to reset the database? This will restore default demo data and cannot be undone!')) {
                            try {
                              await resetDatabase();
                              alert('✅ Database reset successfully!');
                              window.location.reload(); // Refresh to show reset data
                            } catch (error) {
                              alert('❌ Failed to reset database');
                              console.error('Reset error:', error);
                            }
                          }
                        }}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <i className="ri-refresh-line text-lg"></i>
                        <span>Reset to Default Data</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* File-Based Concept Explanation */}
                <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <i className="ri-lightbulb-line text-yellow-600 mr-2"></i>
                    File-Based Database Concept
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">✅ Advantages:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Simple to understand and implement</li>
                        <li>• No database server required</li>
                        <li>• Easy backup and restore (just copy files)</li>
                        <li>• Perfect for small applications</li>
                        <li>• Human-readable JSON format</li>
                        <li>• Version control friendly</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">⚠️ Considerations:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Limited to single-user access</li>
                        <li>• No advanced querying capabilities</li>
                        <li>• Manual backup management needed</li>
                        <li>• File size limitations on large datasets</li>
                        <li>• No built-in data validation</li>
                        <li>• Concurrent access handling required</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-100/50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      <i className="ri-information-line mr-1"></i>
                      <strong>Current Implementation:</strong> This system uses localStorage as a file-like database. 
                      In a real file-based system, you would store data in JSON files on your server and read/write them as needed.
                      For production use, consider upgrading to a proper database like SQLite, PostgreSQL, or MongoDB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
