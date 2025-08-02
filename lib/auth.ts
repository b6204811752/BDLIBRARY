
// Modified code
// This is the full code with all the markers replaced

export interface Student {
  id: string;
  name: string;
  email: string;
  mobile: string;
  shift: 'morning' | 'afternoon' | 'evening';
  jobCategory: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'suspended';
  attendance: {
    present: number;
    absent: number;
    totalDays: number;
    monthlyAttendance: { [month: string]: { present: number; total: number } };
  };
  progress: {
    testsCompleted: number;
    materialsDownloaded: number;
    studyHours: number;
    lastLogin: string;
    averageScore: number;
    completionRate: number;
    currentStreak: number;
    totalPoints: number;
  };
  performance: {
    weeklyTests: number[];
    monthlyProgress: number[];
    subjectWiseScore: { [key: string]: number };
    strengths: string[];
    improvements: string[];
  };
  notifications: {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    read: boolean;
    timestamp: string;
  }[];
  fees: {
    courseFee: number;
    totalFee: number;
    paidAmount: number;
    dueAmount: number;
    installments: {
      id: string;
      amount: number;
      dueDate: string;
      paidDate?: string;
      status: 'pending' | 'paid' | 'overdue';
      paymentMethod?: 'cash' | 'card' | 'upi' | 'bank_transfer';
      transactionId?: string;
    }[];
    paymentHistory: {
      id: string;
      amount: number;
      date: string;
      method: 'cash' | 'card' | 'upi' | 'bank_transfer';
      transactionId: string;
      receiptNo: string;
      description: string;
    }[];
    discounts: {
      id: string;
      type: 'percentage' | 'fixed';
      value: number;
      reason: string;
      appliedDate: string;
      appliedBy: string;
    }[];
  };
  library: {
    booksIssued: {
      id: string;
      bookName: string;
      issueDate: string;
      returnDate?: string;
      dueDate: string;
      status: 'issued' | 'returned' | 'overdue';
      fine?: number;
    }[];
    fines: {
      id: string;
      amount: number;
      reason: string;
      date: string;
      status: 'pending' | 'paid';
    }[];
  };
  examHistory: {
    id: string;
    examName: string;
    date: string;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    rank: number;
    subjects: {
      name: string;
      marks: number;
      totalMarks: number;
    }[];
  }[];
  counseling: {
    sessions: {
      id: string;
      date: string;
      counselor: string;
      topic: string;
      notes: string;
      nextSession?: string;
    }[];
    careerGuidance: {
      id: string;
      date: string;
      advisor: string;
      recommendations: string[];
      followUp: string;
    }[];
  };
  certificates: {
    id: string;
    name: string;
    issueDate: string;
    certificateNo: string;
    type: 'course_completion' | 'achievement' | 'participation';
    downloadLink: string;
  }[];
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  lastLogin: string;
  permissions: string[];
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  author: string;
  targetAudience: 'all' | 'morning' | 'afternoon' | 'evening' | string[];
  expiryDate?: string;
}

export interface AuthData {
  students: Student[];
  admin: Admin;
  announcements: Announcement[];
  systemStats: {
    totalLogins: number;
    activeUsers: number;
    testsToday: number;
    materialsDownloaded: number;
    lastUpdated: string;
  };
}

const defaultAuthData: AuthData = {
  students: [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      mobile: '9876543210',
      shift: 'morning',
      jobCategory: 'Banking',
      enrollmentDate: '2024-01-15',
      status: 'active',
      attendance: {
        present: 45,
        absent: 5,
        totalDays: 50,
        monthlyAttendance: {
          '2024-01': { present: 20, total: 22 },
          '2024-02': { present: 25, total: 28 },
        },
      },
      progress: {
        testsCompleted: 15,
        materialsDownloaded: 8,
        studyHours: 120,
        lastLogin: '2024-01-20',
        averageScore: 85,
        completionRate: 78,
        currentStreak: 5,
        totalPoints: 1250,
      },
      performance: {
        weeklyTests: [12, 15, 18, 14],
        monthlyProgress: [70, 75, 80, 85],
        subjectWiseScore: {
          Mathematics: 90,
          English: 85,
          Reasoning: 80,
          'General Knowledge': 75,
        },
        strengths: ['Mathematics', 'Logical Reasoning'],
        improvements: ['General Knowledge', 'Current Affairs'],
      },
      notifications: [
        {
          id: '1',
          message: 'New study material uploaded for Banking exam',
          type: 'info',
          read: false,
          timestamp: '2024-01-20T10:30:00',
        },
      ],
      fees: {
        courseFee: 25000,
        totalFee: 25000,
        paidAmount: 15000,
        dueAmount: 10000,
        installments: [
          {
            id: '1',
            amount: 12500,
            dueDate: '2024-01-15',
            paidDate: '2024-01-15',
            status: 'paid',
            paymentMethod: 'upi',
            transactionId: 'TXN123456',
          },
          {
            id: '2',
            amount: 12500,
            dueDate: '2024-02-15',
            status: 'pending',
          },
        ],
        paymentHistory: [
          {
            id: '1',
            amount: 12500,
            date: '2024-01-15',
            method: 'upi',
            transactionId: 'TXN123456',
            receiptNo: 'RCP001',
            description: 'First installment payment',
          },
          {
            id: '2',
            amount: 2500,
            date: '2024-01-20',
            method: 'cash',
            transactionId: 'CASH001',
            receiptNo: 'RCP002',
            description: 'Additional payment',
          },
        ],
        discounts: [
          {
            id: '1',
            type: 'percentage',
            value: 10,
            reason: 'Early bird discount',
            appliedDate: '2024-01-15',
            appliedBy: 'admin',
          },
        ],
      },
      library: {
        booksIssued: [
          {
            id: '1',
            bookName: 'Banking Quantitative Aptitude',
            issueDate: '2024-01-16',
            dueDate: '2024-02-16',
            status: 'issued',
          },
          {
            id: '2',
            bookName: 'General Knowledge 2024',
            issueDate: '2024-01-10',
            returnDate: '2024-01-25',
            dueDate: '2024-02-10',
            status: 'returned',
          },
        ],
        fines: [],
      },
      examHistory: [
        {
          id: '1',
          examName: 'Banking Mock Test 1',
          date: '2024-01-18',
          totalMarks: 100,
          obtainedMarks: 85,
          percentage: 85,
          rank: 5,
          subjects: [
            { name: 'Mathematics', marks: 25, totalMarks: 30 },
            { name: 'English', marks: 20, totalMarks: 25 },
            { name: 'Reasoning', marks: 22, totalMarks: 25 },
            { name: 'General Knowledge', marks: 18, totalMarks: 20 },
          ],
        },
      ],
      counseling: {
        sessions: [
          {
            id: '1',
            date: '2024-01-17',
            counselor: 'Dr. Priya Sharma',
            topic: 'Exam Strategy Planning',
            notes: 'Focus on time management and weak areas',
            nextSession: '2024-02-01',
          },
        ],
        careerGuidance: [
          {
            id: '1',
            date: '2024-01-19',
            advisor: 'Mr. Amit Singh',
            recommendations: ['Focus on SBI PO', 'Prepare for IBPS Clerk'],
            followUp: 'Weekly progress review',
          },
        ],
      },
      certificates: [
        {
          id: '1',
          name: 'Banking Foundation Course',
          issueDate: '2024-01-20',
          certificateNo: 'CERT001',
          type: 'course_completion',
          downloadLink: '#',
        },
      ],
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@email.com',
      mobile: '9876543211',
      shift: 'afternoon',
      jobCategory: 'SSC',
      enrollmentDate: '2024-01-10',
      status: 'active',
      attendance: {
        present: 42,
        absent: 8,
        totalDays: 50,
        monthlyAttendance: {
          '2024-01': { present: 18, total: 22 },
          '2024-02': { present: 24, total: 28 },
        },
      },
      progress: {
        testsCompleted: 22,
        materialsDownloaded: 12,
        studyHours: 180,
        lastLogin: '2024-01-19',
        averageScore: 78,
        completionRate: 85,
        currentStreak: 8,
        totalPoints: 1580,
      },
      performance: {
        weeklyTests: [18, 20, 22, 19],
        monthlyProgress: [65, 70, 75, 78],
        subjectWiseScore: {
          Mathematics: 75,
          English: 80,
          Reasoning: 85,
          'General Knowledge': 70,
        },
        strengths: ['English', 'Reasoning'],
        improvements: ['Mathematics', 'General Science'],
      },
      notifications: [
        {
          id: '2',
          message: 'Your test score for Mathematics is available',
          type: 'success',
          read: false,
          timestamp: '2024-01-19T14:15:00',
        },
      ],
      fees: {
        courseFee: 20000,
        totalFee: 18000,
        paidAmount: 18000,
        dueAmount: 0,
        installments: [
          {
            id: '1',
            amount: 18000,
            dueDate: '2024-01-10',
            paidDate: '2024-01-10',
            status: 'paid',
            paymentMethod: 'bank_transfer',
            transactionId: 'TXN789012',
          },
        ],
        paymentHistory: [
          {
            id: '1',
            amount: 18000,
            date: '2024-01-10',
            method: 'bank_transfer',
            transactionId: 'TXN789012',
            receiptNo: 'RCP003',
            description: 'Full course payment',
          },
        ],
        discounts: [
          {
            id: '1',
            type: 'fixed',
            value: 2000,
            reason: 'Merit scholarship',
            appliedDate: '2024-01-10',
            appliedBy: 'admin',
          },
        ],
      },
      library: {
        booksIssued: [
          {
            id: '1',
            bookName: 'SSC General Studies',
            issueDate: '2024-01-12',
            dueDate: '2024-02-12',
            status: 'issued',
          },
        ],
        fines: [],
      },
      examHistory: [
        {
          id: '1',
          examName: 'SSC Mock Test 1',
          date: '2024-01-16',
          totalMarks: 200,
          obtainedMarks: 156,
          percentage: 78,
          rank: 3,
          subjects: [
            { name: 'Mathematics', marks: 38, totalMarks: 50 },
            { name: 'English', marks: 40, totalMarks: 50 },
            { name: 'Reasoning', marks: 42, totalMarks: 50 },
            { name: 'General Knowledge', marks: 36, totalMarks: 50 },
          ],
        },
      ],
      counseling: {
        sessions: [
          {
            id: '1',
            date: '2024-01-15',
            counselor: 'Dr. Rajesh Kumar',
            topic: 'Study Schedule Optimization',
            notes: 'Recommended 6-hour daily study plan',
            nextSession: '2024-02-05',
          },
        ],
        careerGuidance: [
          {
            id: '1',
            date: '2024-01-18',
            advisor: 'Ms. Neha Gupta',
            recommendations: ['Target SSC CGL', 'Focus on General Studies'],
            followUp: 'Monthly progress tracking',
          },
        ],
      },
      certificates: [],
    },
    {
      id: '3',
      name: 'Amit Singh',
      email: 'amit@email.com',
      mobile: '9876543212',
      shift: 'evening',
      jobCategory: 'Railway',
      enrollmentDate: '2024-01-12',
      status: 'active',
      attendance: {
        present: 38,
        absent: 12,
        totalDays: 50,
        monthlyAttendance: {
          '2024-01': { present: 16, total: 22 },
          '2024-02': { present: 22, total: 28 },
        },
      },
      progress: {
        testsCompleted: 18,
        materialsDownloaded: 10,
        studyHours: 150,
        lastLogin: '2024-01-18',
        averageScore: 72,
        completionRate: 68,
        currentStreak: 3,
        totalPoints: 980,
      },
      performance: {
        weeklyTests: [14, 16, 18, 17],
        monthlyProgress: [60, 65, 68, 72],
        subjectWiseScore: {
          Mathematics: 70,
          English: 75,
          Reasoning: 72,
          'General Knowledge': 68,
        },
        strengths: ['English', 'Communication'],
        improvements: ['Mathematics', 'Technical Knowledge'],
      },
      notifications: [
        {
          id: '3',
          message: 'Reminder: Complete your pending assignments',
          type: 'warning',
          read: false,
          timestamp: '2024-01-18T16:45:00',
        },
      ],
      fees: {
        courseFee: 22000,
        totalFee: 22000,
        paidAmount: 8000,
        dueAmount: 14000,
        installments: [
          {
            id: '1',
            amount: 8000,
            dueDate: '2024-01-12',
            paidDate: '2024-01-12',
            status: 'paid',
            paymentMethod: 'cash',
            transactionId: 'CASH002',
          },
          {
            id: '2',
            amount: 7000,
            dueDate: '2024-02-12',
            status: 'overdue',
          },
          {
            id: '3',
            amount: 7000,
            dueDate: '2024-03-12',
            status: 'pending',
          },
        ],
        paymentHistory: [
          {
            id: '1',
            amount: 8000,
            date: '2024-01-12',
            method: 'cash',
            transactionId: 'CASH002',
            receiptNo: 'RCP004',
            description: 'Initial payment',
          },
        ],
        discounts: [],
      },
      library: {
        booksIssued: [
          {
            id: '1',
            bookName: 'Railway Technical Guide',
            issueDate: '2024-01-14',
            dueDate: '2024-02-14',
            status: 'overdue',
            fine: 50,
          },
        ],
        fines: [
          {
            id: '1',
            amount: 50,
            reason: 'Late return of Railway Technical Guide',
            date: '2024-02-15',
            status: 'pending',
          },
        ],
      },
      examHistory: [
        {
          id: '1',
          examName: 'Railway Mock Test 1',
          date: '2024-01-17',
          totalMarks: 120,
          obtainedMarks: 86,
          percentage: 72,
          rank: 8,
          subjects: [
            { name: 'Mathematics', marks: 21, totalMarks: 30 },
            { name: 'English', marks: 22, totalMarks: 30 },
            { name: 'Reasoning', marks: 22, totalMarks: 30 },
            { name: 'Technical', marks: 21, totalMarks: 30 },
          ],
        },
      ],
      counseling: {
        sessions: [
          {
            id: '1',
            date: '2024-01-16',
            counselor: 'Prof. Suresh Patel',
            topic: 'Motivation and Goal Setting',
            notes: 'Need to improve consistency in studies',
            nextSession: '2024-02-10',
          },
        ],
        careerGuidance: [
          {
            id: '1',
            date: '2024-01-20',
            advisor: 'Mr. Vikram Joshi',
            recommendations: ['Focus on RRB NTPC', 'Improve technical skills'],
            followUp: 'Bi-weekly check-ins',
          },
        ],
      },
      certificates: [],
    },
  ],
  admin: {
    id: 'admin1',
    username: 'admin',
    password: 'admin123',
    lastLogin: '2024-01-20T09:00:00',
    permissions: ['manage_students', 'view_reports', 'create_announcements', 'system_settings'],
  },
  announcements: [
    {
      id: '1',
      title: 'New Banking Course Launch',
      message: 'Advanced Banking preparation course starting next week with updated syllabus',
      priority: 'high',
      date: '2024-01-15',
      author: 'Admin',
      targetAudience: 'all',
      expiryDate: '2024-02-15',
    },
    {
      id: '2',
      title: 'Holiday Notice',
      message: 'Institute closed on Republic Day. Online materials will be available',
      priority: 'medium',
      date: '2024-01-20',
      author: 'Admin',
      targetAudience: 'all',
      expiryDate: '2024-01-26',
    },
  ],
  systemStats: {
    totalLogins: 156,
    activeUsers: 45,
    testsToday: 23,
    materialsDownloaded: 89,
    lastUpdated: '2024-01-20T10:00:00',
  },
};

// Real-time data management
let dataChangeListeners: (() => void)[] = [];

export function subscribeToDataChanges(callback: () => void): () => void {
  dataChangeListeners.push(callback);
  return () => {
    dataChangeListeners = dataChangeListeners.filter((listener) => listener !== callback);
  };
}

function notifyDataChange(): void {
  dataChangeListeners.forEach((listener) => listener());
}

export function getAuthData(): AuthData {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bdLibraryAuth');
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return defaultAuthData;
}

export function saveAuthData(data: AuthData): void {
  if (typeof window !== 'undefined') {
    data.systemStats.lastUpdated = new Date().toISOString();
    localStorage.setItem('bdLibraryAuth', JSON.stringify(data));
    notifyDataChange();
  }
}

export function authenticateStudent(email: string, mobile: string): Student | null {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.email === email && s.mobile === mobile);
  if (student) {
    student.progress.lastLogin = new Date().toISOString();
    authData.systemStats.totalLogins++;
    saveAuthData(authData);
  }
  return student || null;
}

export function authenticateAdmin(username: string, password: string): Admin | null {
  const authData = getAuthData();
  if (authData.admin.username === username && authData.admin.password === password) {
    authData.admin.lastLogin = new Date().toISOString();
    saveAuthData(authData);
    return authData.admin;
  }
  return null;
}

export function addStudent(student: Omit<Student, 'id' | 'progress' | 'attendance' | 'performance' | 'notifications' | 'status'>): Student {
  const authData = getAuthData();
  const newStudent: Student = {
    ...student,
    id: Date.now().toString(),
    status: 'active',
    attendance: {
      present: 0,
      absent: 0,
      totalDays: 0,
      monthlyAttendance: {},
    },
    progress: {
      testsCompleted: 0,
      materialsDownloaded: 0,
      studyHours: 0,
      lastLogin: new Date().toISOString(),
      averageScore: 0,
      completionRate: 0,
      currentStreak: 0,
      totalPoints: 0,
    },
    performance: {
      weeklyTests: [],
      monthlyProgress: [],
      subjectWiseScore: {},
      strengths: [],
      improvements: [],
    },
    notifications: [
      {
        id: Date.now().toString(),
        message: 'Welcome to BD Library GOH! Start your preparation journey.',
        type: 'info',
        read: false,
        timestamp: new Date().toISOString(),
      },
    ],
    fees: {
      courseFee: 0,
      totalFee: 0,
      paidAmount: 0,
      dueAmount: 0,
      installments: [],
      paymentHistory: [],
      discounts: [],
    },
    library: {
      booksIssued: [],
      fines: [],
    },
    examHistory: [],
    counseling: {
      sessions: [],
      careerGuidance: [],
    },
    certificates: [],
  };
  authData.students.push(newStudent);
  saveAuthData(authData);
  return newStudent;
}

export function updateStudent(id: string, updates: Partial<Student>): void {
  const authData = getAuthData();
  const studentIndex = authData.students.findIndex((s) => s.id === id);
  if (studentIndex !== -1) {
    authData.students[studentIndex] = { ...authData.students[studentIndex], ...updates };
    saveAuthData(authData);
  }
}

export function deleteStudent(id: string): void {
  const authData = getAuthData();
  authData.students = authData.students.filter((s) => s.id !== id);
  saveAuthData(authData);
}

export function updateStudentProgress(id: string, progress: Partial<Student['progress']>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === id);
  if (student) {
    student.progress = { ...student.progress, ...progress };

    // Update system stats
    if (progress.testsCompleted) {
      authData.systemStats.testsToday++;
    }
    if (progress.materialsDownloaded) {
      authData.systemStats.materialsDownloaded++;
    }

    saveAuthData(authData);
  }
}

export function addNotification(studentId: string, notification: Omit<Student['notifications'][0], 'id' | 'timestamp'>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    student.notifications.unshift({
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    });
    saveAuthData(authData);
  }
}

export function markNotificationAsRead(studentId: string, notificationId: string): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const notification = student.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      saveAuthData(authData);
    }
  }
}

export function addAnnouncement(announcement: Omit<Announcement, 'id' | 'date'>): void {
  const authData = getAuthData();
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
  };
  authData.announcements.unshift(newAnnouncement);

  // Add notification to relevant students
  const targetStudents = announcement.targetAudience === 'all' ? authData.students : authData.students.filter((s) => s.shift === announcement.targetAudience);

  targetStudents.forEach((student) => {
    addNotification(student.id, {
      message: `New announcement: ${announcement.title}`,
      type: 'info',
      read: false,
    });
  });

  saveAuthData(authData);
}

export function deleteAnnouncement(id: string): void {
  const authData = getAuthData();
  authData.announcements = authData.announcements.filter((a) => a.id !== id);
  saveAuthData(authData);
}

export function getSystemStats(): AuthData['systemStats'] {
  const authData = getAuthData();
  return authData.systemStats;
}

export function updateSystemStats(stats: Partial<AuthData['systemStats']>): void {
  const authData = getAuthData();
  authData.systemStats = { ...authData.systemStats, ...stats };
  saveAuthData(authData);
}

export function getCurrentUser(): { type: 'student' | 'admin' | null; data: Student | Admin | null } {
  if (typeof window !== 'undefined') {
    const current = localStorage.getItem('currentUser');
    if (current) {
      return JSON.parse(current);
    }
  }
  return { type: null, data: null };
}

export function setCurrentUser(type: 'student' | 'admin', data: Student | Admin): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify({ type, data }));
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
  }
}

// Real-time analytics
export function getAnalytics() {
  const authData = getAuthData();
  const students = authData.students;

  return {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.status === 'active').length,
    averageAttendance: students.reduce((acc, s) => acc + (s.attendance.present / s.attendance.totalDays || 0), 0) / students.length * 100,
    averageScore: students.reduce((acc, s) => acc + s.progress.averageScore, 0) / students.length,
    topPerformers: students.sort((a, b) => b.progress.totalPoints - a.progress.totalPoints).slice(0, 5),
    shiftDistribution: {
      morning: students.filter((s) => s.shift === 'morning').length,
      afternoon: students.filter((s) => s.shift === 'afternoon').length,
      evening: students.filter((s) => s.shift === 'evening').length,
    },
    categoryDistribution: students.reduce((acc, s) => {
      acc[s.jobCategory] = (acc[s.jobCategory] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number }),
  };
}

// Bulk operations
export function bulkUpdateStudents(updates: { id: string; data: Partial<Student> }[]): void {
  const authData = getAuthData();
  updates.forEach((update) => {
    const studentIndex = authData.students.findIndex((s) => s.id === update.id);
    if (studentIndex !== -1) {
      authData.students[studentIndex] = { ...authData.students[studentIndex], ...update.data };
    }
  });
  saveAuthData(authData);
}

export function exportStudentData(format: 'csv' | 'json' = 'csv'): string {
  const authData = getAuthData();
  const students = authData.students;

  if (format === 'json') {
    return JSON.stringify(students, null, 2);
  }

  // CSV format
  const headers = ['ID', 'Name', 'Email', 'Mobile', 'Shift', 'Category', 'Status', 'Tests', 'Materials', 'Hours', 'Score'];
  const rows = students.map((s) => [
    s.id,
    s.name,
    s.email,
    s.mobile,
    s.shift,
    s.jobCategory,
    s.status,
    s.progress.testsCompleted,
    s.progress.materialsDownloaded,
    s.progress.studyHours,
    s.progress.averageScore,
  ]);

  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}

// Fee management functions
export function addPayment(studentId: string, payment: Omit<Student['fees']['paymentHistory'][0], 'id'>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const newPayment = {
      ...payment,
      id: Date.now().toString(),
    };
    student.fees.paymentHistory.push(newPayment);
    student.fees.paidAmount += payment.amount;
    student.fees.dueAmount = student.fees.totalFee - student.fees.paidAmount;

    // Update installment status if applicable
    student.fees.installments.forEach((installment) => {
      if (installment.status === 'pending' && student.fees.paidAmount >= installment.amount) {
        installment.status = 'paid';
        installment.paidDate = payment.date;
        installment.paymentMethod = payment.method;
        installment.transactionId = payment.transactionId;
      }
    });

    saveAuthData(authData);
  }
}

export function applyDiscount(studentId: string, discount: Omit<Student['fees']['discounts'][0], 'id'>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const newDiscount = {
      ...discount,
      id: Date.now().toString(),
    };
    student.fees.discounts.push(newDiscount);

    // Calculate discount amount
    const discountAmount =
      discount.type === 'percentage' ? (student.fees.courseFee * discount.value) / 100 : discount.value;

    student.fees.totalFee = student.fees.courseFee - discountAmount;
    student.fees.dueAmount = student.fees.totalFee - student.fees.paidAmount;

    saveAuthData(authData);
  }
}

export function addInstallment(studentId: string, installment: Omit<Student['fees']['installments'][0], 'id'>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const newInstallment = {
      ...installment,
      id: Date.now().toString(),
    };
    student.fees.installments.push(newInstallment);
    saveAuthData(authData);
  }
}

// Library management functions
export function issueBook(studentId: string, book: Omit<Student['library']['booksIssued'][0], 'id'>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const newBook = {
      ...book,
      id: Date.now().toString(),
    };
    student.library.booksIssued.push(newBook);
    saveAuthData(authData);
  }
}

export function returnBook(studentId: string, bookId: string): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const book = student.library.booksIssued.find((b) => b.id === bookId);
    if (book) {
      book.returnDate = new Date().toISOString().split('T')[0];
      book.status = 'returned';

      // Check for fine
      const dueDate = new Date(book.dueDate);
      const returnDate = new Date(book.returnDate);
      if (returnDate > dueDate) {
        const daysLate = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const fine = daysLate * 10; // 10 rupees per day
        book.fine = fine;

        student.library.fines.push({
          id: Date.now().toString(),
          amount: fine,
          reason: `Late return of ${book.bookName}`,
          date: book.returnDate,
          status: 'pending',
        });
      }

      saveAuthData(authData);
    }
  }
}

// Exam management functions
export function addExamResult(studentId: string, exam: Omit<Student['examHistory'][0], 'id'>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const newExam = {
      ...exam,
      id: Date.now().toString(),
    };
    student.examHistory.push(newExam);

    // Update progress
    student.progress.testsCompleted++;
    student.progress.averageScore = (student.progress.averageScore + exam.percentage) / 2;

    saveAuthData(authData);
  }
}

// Counseling management functions
export function addCounselingSession(studentId: string, session: Omit<Student['counseling']['sessions'][0], 'id'>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const newSession = {
      ...session,
      id: Date.now().toString(),
    };
    student.counseling.sessions.push(newSession);
    saveAuthData(authData);
  }
}

export function addCareerGuidance(studentId: string, guidance: Omit<Student['counseling']['careerGuidance'][0], 'id'>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const newGuidance = {
      ...guidance,
      id: Date.now().toString(),
    };
    student.counseling.careerGuidance.push(newGuidance);
    saveAuthData(authData);
  }
}

// Certificate management functions
export function issueCertificate(studentId: string, certificate: Omit<Student['certificates'][0], 'id'>): void {
  const authData = getAuthData();
  const student = authData.students.find((s) => s.id === studentId);
  if (student) {
    const newCertificate = {
      ...certificate,
      id: Date.now().toString(),
    };
    student.certificates.push(newCertificate);
    saveAuthData(authData);
  }
}

// Enhanced analytics with fees
export function getFinancialAnalytics() {
  const authData = getAuthData();
  const students = authData.students;

  const totalRevenue = students.reduce((sum, s) => sum + s.fees.paidAmount, 0);
  const totalDues = students.reduce((sum, s) => sum + s.fees.dueAmount, 0);
  const totalDiscounts = students.reduce(
    (sum, s) =>
      sum +
      s.fees.discounts.reduce((discSum, disc) => {
        return discSum + (disc.type === 'percentage' ? (s.fees.courseFee * disc.value) / 100 : disc.value);
      }, 0),
    0
  );

  return {
    totalRevenue,
    totalDues,
    totalDiscounts,
    overduePayments: students.filter((s) => s.fees.installments.some((inst) => inst.status === 'overdue')).length,
    monthlyRevenue: getMonthlyRevenue(students),
    paymentMethodStats: getPaymentMethodStats(students),
    defaulters: students.filter((s) => s.fees.dueAmount > 0),
  };
}

function getMonthlyRevenue(students: Student[]) {
  const monthlyData: { [key: string]: number } = {};

  students.forEach((student) => {
    student.fees.paymentHistory.forEach((payment) => {
      const month = payment.date.substring(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + payment.amount;
    });
  });

  return monthlyData;
}

function getPaymentMethodStats(students: Student[]) {
  const stats: { [key: string]: { count: number; amount: number } } = {};

  students.forEach((student) => {
    student.fees.paymentHistory.forEach((payment) => {
      if (!stats[payment.method]) {
        stats[payment.method] = { count: 0, amount: 0 };
      }
      stats[payment.method].count++;
      stats[payment.method].amount += payment.amount;
    });
  });

  return stats;
}
