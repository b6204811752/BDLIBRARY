

'use client';

import * as React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  getCurrentUser, 
  getAuthData, 
  addStudent, 
  deleteStudent, 
  updateStudent,
  Student, 
  updateStudentProgress,
  subscribeToDataChanges,
  getAnalytics,
  addAnnouncement,
  deleteAnnouncement,
  exportStudentData,
  bulkUpdateStudents,
  addNotification,
  addPayment,
  applyDiscount,
  addInstallment,
  issueBook,
  returnBook,
  addExamResult,
  addCounselingSession,
  addCareerGuidance,
  issueCertificate,
  getFinancialAnalytics
} from '@/lib/auth';

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
    shift: 'morning' as 'morning' | 'afternoon' | 'evening',
    jobCategory: 'Banking',
    courseFee: '',
    feeType: 'monthly' as 'one-time' | 'monthly',
    courseDurationMonths: '12',
    monthlyFees: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: new Date(2024, i, 1).toLocaleString('default', { month: 'long' }),
      amount: '',
      dueDate: '',
      status: 'pending' as 'pending' | 'paid' | 'overdue'
    }))
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
    const user = getCurrentUser();
    if (!user.type || user.type !== 'admin') {
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

    // Simulate real-time stats
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        onlineUsers: Math.floor(Math.random() * 20) + 5,
        activeTests: Math.floor(Math.random() * 10) + 1,
        newNotifications: Math.floor(Math.random() * 5)
      }));
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [router]);

  const loadData = () => {
    const authData = getAuthData();
    setStudents(authData.students);
    setAnnouncements(authData.announcements);
    setAnalytics(getAnalytics());
    setFinancialAnalytics(getFinancialAnalytics());

    // Update real-time stats
    setRealTimeStats(prev => ({
      ...prev,
      onlineUsers: authData.students.filter(s => {
        const lastLogin = new Date(s.progress.lastLogin);
        const now = new Date();
        return (now.getTime() - lastLogin.getTime()) < 300000; // 5 minutes
      }).length
    }));
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const courseDurationMonths = parseInt(newStudent.courseDurationMonths) || 12;
      const monthlyFeeAmount = parseFloat(newStudent.courseFee) || 0;
      const totalFee = monthlyFeeAmount * courseDurationMonths;

      // Generate monthly fees array based on the single monthly fee amount
      const monthlyFeesArray = Array.from({ length: courseDurationMonths }, (_, i) => ({
        month: i + 1,
        monthName: new Date(2024, i, 1).toLocaleString('default', { month: 'long' }),
        amount: monthlyFeeAmount.toString(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString().split('T')[0],
        status: 'pending' as 'pending' | 'paid' | 'overdue'
      }));

      const student = addStudent({
        name: newStudent.name,
        email: newStudent.email,
        mobile: newStudent.mobile,
        shift: newStudent.shift,
        jobCategory: newStudent.jobCategory,
        enrollmentDate: new Date().toISOString().split('T')[0],
        fees: {
          courseFee: totalFee,
          totalFee: totalFee,
          paidAmount: 0,
          dueAmount: totalFee,
          monthlyFee: monthlyFeeAmount,
          courseDurationMonths: courseDurationMonths,
          feeType: 'monthly',
          monthlyFees: monthlyFeesArray,
          installments: [],
          paymentHistory: [],
          discounts: []
        },
        library: {
          booksIssued: [],
          fines: []
        },
        examHistory: [],
        counseling: {
          sessions: [],
          careerGuidance: []
        },
        certificates: []
      });

      setNewStudent({
        name: '',
        email: '',
        mobile: '',
        shift: 'morning',
        jobCategory: 'Banking',
        courseFee: '',
        feeType: 'monthly',
        courseDurationMonths: '12',
        monthlyFees: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          monthName: new Date(2024, i, 1).toLocaleString('default', { month: 'long' }),
          amount: '',
          dueDate: '',
          status: 'pending' as 'pending' | 'paid' | 'overdue'
        }))
      });
      setShowAddModal(false);
      loadData();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = bulkStudents.split('\n').filter((line: string) => line.trim());

    lines.forEach((line: string) => {
      const [name, email, mobile, shift, jobCategory] = line.split(',').map((s: string) => s.trim());
      if (name && email && mobile && shift && jobCategory) {
        try {
          addStudent({
            name,
            email,
            mobile,
            shift: shift as 'morning' | 'afternoon' | 'evening',
            jobCategory,
            enrollmentDate: new Date().toISOString().split('T')[0],
            fees: {
              courseFee: 0,
              totalFee: 0,
              paidAmount: 0,
              dueAmount: 0,
              installments: [],
              paymentHistory: [],
              discounts: []
            },
            library: {
              booksIssued: [],
              fines: []
            },
            examHistory: [],
            counseling: {
              sessions: [],
              careerGuidance: []
            },
            certificates: []
          });
        } catch (error) {
          console.error('Error adding student:', error);
        }
      }
    });

    setBulkStudents('');
    setShowBulkUpload(false);
    loadData();
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
      loadData();
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      updateStudent(selectedStudent.id, selectedStudent);
      setShowEditModal(false);
      setSelectedStudent(null);
      loadData();
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      ...newAnnouncement,
      author: 'Admin'
    });
    setNewAnnouncement({
      title: '',
      message: '',
      priority: 'medium',
      targetAudience: 'all',
      expiryDate: ''
    });
    setShowAnnouncementModal(false);
    loadData();
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id);
      loadData();
    }
  };

  const resetStudentProgress = (studentId: string) => {
    if (confirm('Are you sure you want to reset this student\'s progress?')) {
      updateStudentProgress(studentId, {
        testsCompleted: 0,
        materialsDownloaded: 0,
        studyHours: 0,
        averageScore: 0,
        completionRate: 0,
        currentStreak: 0,
        totalPoints: 0
      });
      loadData();
    }
  };

  const toggleStudentStatus = (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateStudent(studentId, { status: newStatus });
    loadData();
  };

  const sendNotificationToStudent = (studentId: string, message: string) => {
    addNotification(studentId, {
      message,
      type: 'info',
      read: false
    });
    loadData();
  };

  const handleExport = (format: 'csv' | 'json') => {
    const data = exportStudentData(format);
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const filteredStudents = students.filter((student: Student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.mobile.includes(searchTerm);
    const matchesShift = filterShift === 'all' || student.shift === filterShift;
    const matchesCategory = filterCategory === 'all' || student.jobCategory === filterCategory;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesShift && matchesCategory && matchesStatus;
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
      case 'enrollmentDate':
        aValue = new Date(a.enrollmentDate);
        bValue = new Date(b.enrollmentDate);
        break;
      case 'progress':
        aValue = a.progress.totalPoints;
        bValue = b.progress.totalPoints;
        break;
      case 'attendance':
        aValue = a.attendance.present / a.attendance.totalDays || 0;
        bValue = b.attendance.present / b.attendance.totalDays || 0;
        break;
      case 'score':
        aValue = a.progress.averageScore;
        bValue = b.progress.averageScore;
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
      addPayment(paymentData.studentId, {
        amount: parseFloat(paymentData.amount),
        date: new Date().toISOString().split('T')[0],
        method: paymentData.method,
        transactionId: paymentData.transactionId,
        receiptNo: paymentData.receiptNo,
        description: paymentData.description
      });

      setPaymentData({
        studentId: '',
        amount: '',
        method: 'cash',
        transactionId: '',
        receiptNo: '',
        description: ''
      });
      setShowPaymentModal(false);
      loadData();
    }
  };

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountData.studentId && discountData.value) {
      applyDiscount(discountData.studentId, {
        type: discountData.type,
        value: parseFloat(discountData.value),
        reason: discountData.reason,
        appliedDate: new Date().toISOString().split('T')[0],
        appliedBy: 'admin'
      });

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
        issueBook(libraryData.studentId, {
          bookName: libraryData.bookName,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'issued'
        });
      } else if (libraryData.action === 'return' && libraryData.bookId) {
        returnBook(libraryData.studentId, libraryData.bookId);
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

      addExamResult(examData.studentId, {
        examName: examData.examName,
        date: new Date().toISOString().split('T')[0],
        totalMarks,
        obtainedMarks,
        percentage: Math.round((obtainedMarks / totalMarks) * 100),
        rank: Math.floor(Math.random() * 50) + 1,
        subjects: examData.subjects.map((sub: any) => ({
          name: sub.name,
          marks: parseInt(sub.marks),
          totalMarks: parseInt(sub.totalMarks)
        }))
      });

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
      addCounselingSession(counselingData.studentId, {
        date: new Date().toISOString().split('T')[0],
        counselor: counselingData.counselor,
        topic: counselingData.topic,
        notes: counselingData.notes,
        nextSession: counselingData.nextSession
      });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Real-time monitoring and management system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Online: {realTimeStats.onlineUsers}</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center space-x-2">
                <i className="ri-test-tube-line text-blue-600"></i>
                <span className="text-sm text-gray-600">Active Tests: {realTimeStats.activeTests}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[ 
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
                { id: 'students', label: 'Students', icon: 'ri-user-line' },
                { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' },
                { id: 'announcements', label: 'Announcements', icon: 'ri-megaphone-line' },
                { id: 'reports', label: 'Reports', icon: 'ri-file-chart-line' },
                { id: 'settings', label: 'Settings', icon: 'ri-settings-line' }
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
        {activeTab === 'dashboard' && analytics && financialAnalytics && (
          <div className="space-y-6">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-user-line text-xl text-blue-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
                    <p className="text-xs text-green-600">+{Math.floor(Math.random() * 5)} this week</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-money-rupee-circle-line text-xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{financialAnalytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">This month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="ri-money-rupee-circle-line text-xl text-red-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Dues</p>
                    <p className="text-2xl font-bold text-gray-900">₹{financialAnalytics.totalDues.toLocaleString()}</p>
                    <p className="text-xs text-red-600">{financialAnalytics.overduePayments} overdue</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-calendar-check-line text-xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.averageAttendance)}%</p>
                    <p className="text-xs text-green-600">+2% this month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="ri-trophy-line text-xl text-yellow-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Score</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.averageScore)}</p>
                    <p className="text-xs text-green-600">+3 pts this week</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="ri-discount-percent-line text-xl text-orange-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Discounts</p>
                    <p className="text-2xl font-bold text-gray-900">₹{financialAnalytics.totalDiscounts.toLocaleString()}</p>
                    <p className="text-xs text-orange-600">Total given</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-user-add-line"></i>
                  <span>Add Student</span>
                </button>
                <button
                  onClick={() => setShowBulkUpload(true)}
                  className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-file-upload-line"></i>
                  <span>Bulk Upload</span>
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-money-rupee-circle-line"></i>
                  <span>Add Payment</span>
                </button>
                <button
                  onClick={() => setShowDiscountModal(true)}
                  className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-discount-percent-line"></i>
                  <span>Apply Discount</span>
                </button>
                <button
                  onClick={() => setShowLibraryModal(true)}
                  className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-book-line"></i>
                  <span>Library</span>
                </button>
                <button
                  onClick={() => setShowExamModal(true)}
                  className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-quiz-line"></i>
                  <span>Add Exam</span>
                </button>
                <button
                  onClick={() => setShowCounselingModal(true)}
                  className="bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-user-heart-line"></i>
                  <span>Counseling</span>
                </button>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-award-line"></i>
                  <span>Certificate</span>
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-download-line"></i>
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method Stats</h2>
                <div className="space-y-3">
                  {Object.entries(financialAnalytics.paymentMethodStats).map(([method, stats]: [string, any]) => (
                    <div key={method} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className={`${method === 'cash' ? 'ri-money-rupee-circle-line' : method === 'card' ? 'ri-bank-card-line' : method === 'upi' ? 'ri-smartphone-line' : 'ri-bank-line'} text-blue-600`}></i>
                        <span className="text-sm text-gray-600 capitalize">{method}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{stats.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{stats.count} transactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Fee Defaulters</h2>
                <div className="space-y-3">
                  {financialAnalytics.defaulters.slice(0, 5).map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.mobile}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">₹{student.fees.dueAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Due amount</p>
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
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select
                    value={filterShift}
                    onChange={(e) => setFilterShift(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="all">All Shifts</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                  <div className="flex space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="enrollmentDate">Enrollment</option>
                      <option value="progress">Progress</option>
                      <option value="attendance">Attendance</option>
                      <option value="score">Score</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Students Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Students ({sortedStudents.length})</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-add-line"></i>
                    <span>Add Student</span>
                  </button>
                  <button
                    onClick={() => setShowBulkUpload(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-file-upload-line"></i>
                    <span>Bulk Upload</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-money-rupee-circle-line"></i>
                    <span>Payment</span>
                  </button>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-download-line"></i>
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium">{student.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">ID: {student.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.email}</div>
                          <div className="text-sm text-gray-500">{student.mobile}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.jobCategory}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.shift === 'morning' ? 'bg-yellow-100 text-yellow-800' :
                            student.shift === 'afternoon' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {student.shift}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Paid: ₹{student.fees.paidAmount.toLocaleString()}</div>
                          <div className={`text-sm ${student.fees.dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            Due: ₹{student.fees.dueAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Score: {student.progress.averageScore}%</div>
                          <div className="text-sm text-gray-500">Tests: {student.progress.testsCompleted}</div>
                          <div className="text-sm text-gray-500">Attendance: {Math.round((student.attendance.present / student.attendance.totalDays || 0) * 100)}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.status === 'active' ? 'bg-green-100 text-green-800' :
                            student.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer"
                              title="Edit Student"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => {
                                setPaymentData(prev => ({ ...prev, studentId: student.id }));
                                setShowPaymentModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 cursor-pointer"
                              title="Add Payment"
                            >
                              <i className="ri-money-rupee-circle-line"></i>
                            </button>
                            <button
                              onClick={() => {
                                setLibraryData(prev => ({ ...prev, studentId: student.id }));
                                setShowLibraryModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900 cursor-pointer"
                              title="Library"
                            >
                              <i className="ri-book-line"></i>
                            </button>
                            <button
                              onClick={() => sendNotificationToStudent(student.id, 'Important update from admin')}
                              className="text-orange-600 hover:text-orange-900 cursor-pointer"
                              title="Send Notification"
                            >
                              <i className="ri-notification-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                              title="Delete Student"
                            >
                              <i className="ri-delete-bin-line"></i>
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
          <div className="space-y-6">
            {/* Financial Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold text-green-600">₹{financialAnalytics.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Dues</span>
                    <span className="font-bold text-red-600">₹{financialAnalytics.totalDues.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discounts Given</span>
                    <span className="font-bold text-orange-600">₹{financialAnalytics.totalDiscounts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection Rate</span>
                    <span className="font-bold text-blue-600">
                      {Math.round((financialAnalytics.totalRevenue / (financialAnalytics.totalRevenue + financialAnalytics.totalDues)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Library Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Books Issued</span>
                    <span className="font-bold text-blue-600">
                      {students.reduce((sum, s) => sum + s.library.booksIssued.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overdue Books</span>
                    <span className="font-bold text-red-600">
                      {students.reduce((sum, s) => sum + s.library.booksIssued.filter(b => b.status === 'overdue').length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Fines</span>
                    <span className="font-bold text-orange-600">
                      ₹{students.reduce((sum, s) => sum + s.library.fines.reduce((fineSum, f) => fineSum + (f.status === 'pending' ? f.amount : 0), 0), 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Exams</span>
                    <span className="font-bold text-blue-600">
                      {students.reduce((sum, s) => sum + s.examHistory.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Performance</span>
                    <span className="font-bold text-green-600">
                      {Math.round(students.reduce((sum, s) => sum + s.progress.averageScore, 0) / students.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Top Performers</span>
                    <span className="font-bold text-purple-600">
                      {students.filter(s => s.progress.averageScore > 80).length}
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
                      {students.find(s => s.id === libraryData.studentId)?.library.booksIssued
                        .filter(book => book.status === 'issued')
                        .map(book => (
                          <option key={book.id} value={book.id}>{book.bookName}</option>
                        ))}
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
                    placeholder="Enter mobile number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select
                    value={newStudent.shift}
                    onChange={(e) => setNewStudent({ ...newStudent, shift: e.target.value as 'morning' | 'afternoon' | 'evening' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Category</label>
                  <select
                    value={newStudent.jobCategory}
                    onChange={(e) => setNewStudent({ ...newStudent, jobCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="Banking">Banking</option>
                    <option value="SSC">SSC</option>
                    <option value="Railway">Railway</option>
                    <option value="UPSC">UPSC</option>
                    <option value="State">State Government</option>
                    <option value="Defense">Defense</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Police">Police</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Duration (Months)</label>
                  <select
                    value={newStudent.courseDurationMonths}
                    onChange={(e) => setNewStudent({ ...newStudent, courseDurationMonths: e.target.value })}
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
                    value={newStudent.courseFee}
                    onChange={(e) => setNewStudent({ ...newStudent, courseFee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter monthly fee amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Total Fee Summary */}
                {newStudent.courseFee && newStudent.courseDurationMonths && (
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">Total Course Fee:</span>
                      <span className="text-lg font-bold text-blue-900">
                        ₹{(parseFloat(newStudent.courseFee) * parseInt(newStudent.courseDurationMonths)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-blue-600">Duration:</span>
                      <span className="text-xs text-blue-600">{newStudent.courseDurationMonths} months</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-blue-600">Monthly Fee:</span>
                      <span className="text-xs text-blue-600">₹{parseFloat(newStudent.courseFee).toLocaleString()}</span>
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
                        shift: 'morning',
                        jobCategory: 'Banking',
                        courseFee: '',
                        feeType: 'monthly',
                        courseDurationMonths: '12',
                        monthlyFees: Array.from({ length: 12 }, (_, i) => ({
                          month: i + 1,
                          monthName: new Date(2024, i, 1).toLocaleString('default', { month: 'long' }),
                          amount: '',
                          dueDate: '',
                          status: 'pending' as 'pending' | 'paid' | 'overdue'
                        }))
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
                    value={selectedStudent.mobile}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select
                    value={selectedStudent.shift}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, shift: e.target.value as 'morning' | 'afternoon' | 'evening' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Category</label>
                  <select
                    value={selectedStudent.jobCategory}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, jobCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="Banking">Banking</option>
                    <option value="SSC">SSC</option>
                    <option value="Railway">Railway</option>
                    <option value="UPSC">UPSC</option>
                    <option value="State">State Government</option>
                    <option value="Defense">Defense</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Police">Police</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedStudent.status}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, status: e.target.value as 'active' | 'inactive' | 'suspended' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
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
                <code className="text-xs bg-gray-200 p-2 rounded block">Name, Email, Mobile, Shift, JobCategory</code>
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
      </div>
    </div>
  );
}
