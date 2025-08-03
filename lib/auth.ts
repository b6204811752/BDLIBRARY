// Modified code - File-based storage authentication system

export interface Student {
  id: string;
  name: string;
  email: string;
  mobile: string;
  username: string;
  password: string;
  role: 'student';
  course: string;
  duration: number;
  monthlyFees: number;
  libraryAccess: boolean;
  examsPassed: number;
  counselingBooked: boolean;
  joinDate: string;
  shift: 'morning' | 'evening';
  jobCategory: string;
  attendance: {
    present: number;
    absent: number;
    totalDays: number;
  };
  progress: {
    materialsDownloaded: number;
    testsCompleted: number;
    totalPoints: number;
    currentStreak: number;
    lastActivity: string;
  };
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
  }>;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  role: 'admin';
}

export interface AuthData {
  admins: Admin[];
  students: Student[];
  announcements?: any[];
}

// Default data when file doesn't exist
export const defaultAuthData: AuthData = {
  admins: [
    {
      id: 'admin1',
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    }
  ],
  students: [
    {
      id: 'student1',
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      username: 'john_doe',
      password: '9876543210',
      role: 'student',
      course: 'Computer Science',
      duration: 6,
      monthlyFees: 5000,
      libraryAccess: true,
      examsPassed: 2,
      counselingBooked: false,
      joinDate: '2024-01-15',
      shift: 'morning',
      jobCategory: 'Government Jobs',
      attendance: {
        present: 22,
        absent: 3,
        totalDays: 25
      },
      progress: {
        materialsDownloaded: 15,
        testsCompleted: 8,
        totalPoints: 420,
        currentStreak: 5,
        lastActivity: '2024-01-20'
      },
      notifications: [
        {
          id: 'notif1',
          title: 'Welcome!',
          message: 'Welcome to BD Library. Your learning journey starts here.',
          type: 'info',
          read: false,
          createdAt: '2024-01-15'
        }
      ]
    },
    {
      id: 'student2',
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      mobile: '9065541346',
      username: 'rajesh_kumar',
      password: '9065541346',
      role: 'student',
      course: 'Banking',
      duration: 12,
      monthlyFees: 4500,
      libraryAccess: true,
      examsPassed: 3,
      counselingBooked: true,
      joinDate: '2024-02-01',
      shift: 'evening',
      jobCategory: 'Banking',
      attendance: {
        present: 28,
        absent: 2,
        totalDays: 30
      },
      progress: {
        materialsDownloaded: 25,
        testsCompleted: 12,
        totalPoints: 680,
        currentStreak: 8,
        lastActivity: '2024-02-05'
      },
      notifications: []
    },
    {
      id: 'student3',
      name: 'Priya Sharma',
      email: 'priya@email.com',
      mobile: '9876543211',
      username: 'priya_sharma',
      password: '9876543211',
      role: 'student',
      course: 'SSC',
      duration: 8,
      monthlyFees: 3500,
      libraryAccess: true,
      examsPassed: 1,
      counselingBooked: false,
      joinDate: '2024-01-20',
      shift: 'morning',
      jobCategory: 'SSC',
      attendance: {
        present: 18,
        absent: 4,
        totalDays: 22
      },
      progress: {
        materialsDownloaded: 12,
        testsCompleted: 5,
        totalPoints: 280,
        currentStreak: 3,
        lastActivity: '2024-01-25'
      },
      notifications: []
    },
    {
      id: 'student4',
      name: 'Amit Singh',
      email: 'amit@email.com',
      mobile: '9876543212',
      username: 'amit_singh',
      password: '9876543212',
      role: 'student',
      course: 'Railway',
      duration: 10,
      monthlyFees: 4000,
      libraryAccess: true,
      examsPassed: 4,
      counselingBooked: true,
      joinDate: '2024-01-10',
      shift: 'evening',
      jobCategory: 'Railway',
      attendance: {
        present: 35,
        absent: 1,
        totalDays: 36
      },
      progress: {
        materialsDownloaded: 30,
        testsCompleted: 18,
        totalPoints: 920,
        currentStreak: 12,
        lastActivity: '2024-01-30'
      },
      notifications: []
    },
    {
      id: 'demo1',
      name: 'Demo Student',
      email: 'demo@student.com',
      mobile: '1234567890',
      username: 'demo_student',
      password: '1234567890',
      role: 'student',
      course: 'General',
      duration: 6,
      monthlyFees: 3000,
      libraryAccess: true,
      examsPassed: 0,
      counselingBooked: false,
      joinDate: '2024-01-01',
      shift: 'morning',
      jobCategory: 'General',
      attendance: {
        present: 5,
        absent: 0,
        totalDays: 5
      },
      progress: {
        materialsDownloaded: 3,
        testsCompleted: 1,
        totalPoints: 50,
        currentStreak: 1,
        lastActivity: '2024-01-01'
      },
      notifications: [
        {
          id: 'demo_notif1',
          title: 'Demo Account',
          message: 'This is a demo student account for testing purposes.',
          type: 'info',
          read: false,
          createdAt: '2024-01-01'
        }
      ]
    }
  ],
  announcements: []
};

// API-based data functions for persistent file storage
async function loadAuthData(): Promise<AuthData> {
  try {
    const response = await fetch('/api/auth');
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      return defaultAuthData;
    }
    
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to load auth data:', result.error);
      return defaultAuthData;
    }
  } catch (error) {
    console.error('Error loading auth data:', error);
    return defaultAuthData;
  }
}

async function saveAuthData(data: AuthData): Promise<boolean> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error('Save API response not ok:', response.status, response.statusText);
      return false;
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error saving auth data:', error);
    return false;
  }
}

export async function authenticate(username: string, password: string): Promise<{ success: boolean; user?: Admin | Student; role?: 'admin' | 'student' }> {
  const authData = await loadAuthData();
  
  // Check admin credentials
  const admin = authData.admins.find(a => a.username === username && a.password === password);
  if (admin) {
    return { success: true, user: admin, role: 'admin' };
  }
  
  // Check student credentials (email as username, mobile as password)
  const student = authData.students.find(s => s.email === username && s.mobile === password);
  if (student) {
    return { success: true, user: student, role: 'student' };
  }
  
  return { success: false };
}

export async function getAllStudents(): Promise<Student[]> {
  const authData = await loadAuthData();
  return authData.students;
}

export async function addStudent(student: Omit<Student, 'id' | 'role'>): Promise<boolean> {
  try {
    const authData = await loadAuthData();
    
    // Check if student with same email already exists
    const existingStudent = authData.students.find(s => s.email.toLowerCase() === student.email.toLowerCase());
    if (existingStudent) {
      console.error('Student with this email already exists:', student.email);
      return false;
    }
    
    const newStudent: Student = {
      ...student,
      id: 'student' + Date.now(),
      role: 'student',
      // Ensure email and mobile are properly set for authentication
      email: student.email.trim().toLowerCase(),
      mobile: student.mobile.trim(),
      // Set username to email for consistency (though mobile is used as password)
      username: student.email.trim().toLowerCase()
    };
    
    console.log('Adding new student:', {
      name: newStudent.name,
      email: newStudent.email,
      mobile: newStudent.mobile,
      username: newStudent.username
    });
    
    authData.students.push(newStudent);
    const saved = await saveAuthData(authData);
    
    if (saved) {
      console.log('Student added successfully:', newStudent.name);
    } else {
      console.error('Failed to save student data');
    }
    
    return saved;
  } catch (error) {
    console.error('Error in addStudent:', error);
    return false;
  }
}

export async function updateStudent(updatedStudent: Student): Promise<boolean> {
  const authData = await loadAuthData();
  
  const index = authData.students.findIndex(s => s.id === updatedStudent.id);
  if (index === -1) {
    return false;
  }
  
  authData.students[index] = updatedStudent;
  return await saveAuthData(authData);
}

export async function deleteStudent(studentId: string): Promise<boolean> {
  const authData = await loadAuthData();
  
  const initialLength = authData.students.length;
  authData.students = authData.students.filter(s => s.id !== studentId);
  
  if (authData.students.length === initialLength) {
    return false; // Student not found
  }
  
  return await saveAuthData(authData);
}

// Legacy localStorage functions for backward compatibility (will be removed)
function getAuthData(): AuthData {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('authData');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
      // Clear corrupted data
      localStorage.removeItem('authData');
    }
  }
  return defaultAuthData;
}

// Export getAuthData for backward compatibility
export { getAuthData };

// Session management functions
export function getCurrentUser(): { type: 'student' | 'admin' | null; data: Student | Admin | null } {
  if (typeof window !== 'undefined') {
    try {
      const current = localStorage.getItem('currentUser');
      if (current) {
        return JSON.parse(current);
      }
    } catch (error) {
      console.error('Error parsing current user data:', error);
      // Clear corrupted data
      localStorage.removeItem('currentUser');
    }
  }
  return { type: null, data: null };
}

export function setCurrentUser(type: 'student' | 'admin', data: Student | Admin): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('currentUser', JSON.stringify({ type, data }));
    } catch (error) {
      console.error('Error setting current user data:', error);
    }
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
  }
}

// Student authentication function for login page
export async function authenticateStudent(email: string, mobile: string): Promise<Student | null> {
  try {
    const authData = await loadAuthData();
    
    // Debug logging
    console.log('Authenticating student with email:', email, 'mobile:', mobile);
    console.log('Available students:', authData.students.map(s => ({ email: s.email, mobile: s.mobile, name: s.name })));
    
    // Authenticate using email and mobile number (mobile is used as password)
    const student = authData.students.find(s => 
      s.email.toLowerCase() === email.toLowerCase() && s.mobile === mobile
    );
    
    if (student) {
      console.log('Student found:', student.name);
    } else {
      console.log('No student found with provided credentials');
    }
    
    return student || null;
  } catch (error) {
    console.error('Error in authenticateStudent:', error);
    return null;
  }
}

// Placeholder functions for features that will be implemented later
export function subscribeToDataChanges(callback: () => void): () => void {
  console.log('Real-time data changes feature coming soon');
  return () => {}; // Return empty unsubscribe function
}

export async function updateStudentProgress(studentId: string, progress: any): Promise<void> {
  console.log('Student progress update feature coming soon');
}

export function markNotificationAsRead(studentId: string, notificationId: string): void {
  console.log('Mark notification as read feature coming soon');
}

// Admin authentication function
export async function authenticateAdmin(username: string, password: string): Promise<Admin | null> {
  try {
    const authData = await loadAuthData();
    console.log('Authenticating admin with username:', username);
    
    const admin = authData.admins.find(a => a.username === username && a.password === password);
    
    if (admin) {
      console.log('Admin found:', admin.username);
    } else {
      console.log('No admin found with provided credentials');
    }
    
    return admin || null;
  } catch (error) {
    console.error('Error in authenticateAdmin:', error);
    return null;
  }
}
