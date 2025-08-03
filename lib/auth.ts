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

// Vercel-compatible localStorage-based data functions with enhanced debugging
async function loadAuthData(): Promise<AuthData> {
  try {
    console.log('🔄 Loading auth data...');
    
    // First, try to load from localStorage
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('authData');
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          console.log('✅ Loading auth data from localStorage, students:', parsedData.students?.length || 0);
          return parsedData;
        } catch (parseError) {
          console.error('❌ Error parsing localStorage data:', parseError);
          localStorage.removeItem('authData'); // Clear corrupted data
        }
      } else {
        console.log('📝 No data found in localStorage');
      }
    }
    
    // If localStorage is empty or corrupted, try to load from API (fallback)
    try {
      console.log('🌐 Attempting to load from API...');
      const response = await fetch('/api/auth');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Save to localStorage for future use
          if (typeof window !== 'undefined') {
            localStorage.setItem('authData', JSON.stringify(result.data));
            console.log('💾 Loaded from API and cached to localStorage, students:', result.data.students?.length || 0);
          }
          return result.data;
        }
      }
      console.log('⚠️ API load unsuccessful');
    } catch (apiError) {
      console.log('⚠️ API not available, using default data');
    }
    
    // If both fail, initialize with default data
    console.log('🏗️ Initializing with default auth data');
    if (typeof window !== 'undefined') {
      localStorage.setItem('authData', JSON.stringify(defaultAuthData));
      console.log('💾 Default data saved to localStorage, students:', defaultAuthData.students.length);
    }
    return defaultAuthData;
  } catch (error) {
    console.error('❌ Error loading auth data:', error);
    return defaultAuthData;
  }
}

async function saveAuthData(data: AuthData): Promise<boolean> {
  try {
    console.log('💾 Saving auth data, students:', data.students?.length || 0);
    
    // Always save to localStorage for Vercel compatibility
    if (typeof window !== 'undefined') {
      localStorage.setItem('authData', JSON.stringify(data));
      console.log('✅ Auth data saved to localStorage successfully');
      
      // Also trigger a storage event to sync across tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'authData',
        newValue: JSON.stringify(data),
        storageArea: localStorage
      }));
    }
    
    // Try to save to API as well (if available), but don't fail if it doesn't work
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('🌐 Auth data also saved to API:', result.success);
      } else {
        console.log('⚠️ API save failed with status:', response.status);
      }
    } catch (apiError) {
      console.log('⚠️ API save failed, but localStorage save succeeded');
    }
    
    return true; // Return true since localStorage save succeeded
  } catch (error) {
    console.error('❌ Error saving auth data:', error);
    return false;
  }
}

export async function authenticate(username: string, password: string): Promise<{ success: boolean; user?: Admin | Student; role?: 'admin' | 'student' }> {
  try {
    const authData = await loadAuthData();
    
    console.log('Authentication attempt:', { username, password });
    console.log('Available students:', authData.students.map(s => ({ email: s.email, mobile: s.mobile, name: s.name })));
    
    // Check admin credentials
    const admin = authData.admins.find(a => a.username === username && a.password === password);
    if (admin) {
      console.log('Admin authentication successful');
      return { success: true, user: admin, role: 'admin' };
    }
    
    // Check student credentials (email as username, mobile as password)
    // Use case-insensitive email matching
    const student = authData.students.find(s => 
      s.email.toLowerCase() === username.toLowerCase() && s.mobile === password
    );
    
    if (student) {
      console.log('Student authentication successful:', student.name);
      return { success: true, user: student, role: 'student' };
    }
    
    console.log('Authentication failed - no matching credentials found');
    return { success: false };
  } catch (error) {
    console.error('Error during authentication:', error);
    return { success: false };
  }
}

// Initialize auth data on first load
export async function initializeAuthData(): Promise<void> {
  try {
    console.log('🚀 Initializing authentication data...');
    const authData = await loadAuthData();
    console.log('✅ Auth data initialized with', authData.students.length, 'students and', authData.admins.length, 'admins');
    
    // Log all students for debugging
    console.log('📋 Current students in system:');
    authData.students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} - ${student.email} - ${student.mobile}`);
    });
  } catch (error) {
    console.error('❌ Error initializing auth data:', error);
  }
}

// Debug function to check current auth data
export async function debugAuthData(): Promise<void> {
  try {
    console.log('🔍 Debug: Checking current auth data...');
    const authData = await loadAuthData();
    
    console.log('📊 Auth Data Summary:', {
      totalStudents: authData.students.length,
      totalAdmins: authData.admins.length
    });
    
    console.log('👥 All Students:');
    authData.students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name}`, {
        email: student.email,
        mobile: student.mobile,
        id: student.id,
        joinDate: student.joinDate
      });
    });
    
    // Check localStorage directly
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('authData');
      if (localData) {
        const parsed = JSON.parse(localData);
        console.log('💾 LocalStorage contains:', parsed.students.length, 'students');
      } else {
        console.log('❌ No data in localStorage');
      }
    }
  } catch (error) {
    console.error('❌ Error in debugAuthData:', error);
  }
}

// Function to force refresh auth data
export async function refreshAuthData(): Promise<void> {
  try {
    console.log('🔄 Forcing auth data refresh...');
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authData');
      console.log('🗑️ Cleared localStorage');
    }
    
    // Reinitialize
    await initializeAuthData();
  } catch (error) {
    console.error('❌ Error refreshing auth data:', error);
  }
}

export async function getAllStudents(): Promise<Student[]> {
  const authData = await loadAuthData();
  return authData.students;
}

export async function addStudent(student: Omit<Student, 'id' | 'role'>): Promise<boolean> {
  try {
    console.log('🔄 Adding new student:', student.name);
    const authData = await loadAuthData();
    
    // Check if student with same email already exists
    const existingStudent = authData.students.find(s => s.email.toLowerCase() === student.email.toLowerCase());
    if (existingStudent) {
      console.error('❌ Student with this email already exists:', student.email);
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
    
    console.log('👤 Creating student:', {
      name: newStudent.name,
      email: newStudent.email,
      mobile: newStudent.mobile,
      username: newStudent.username,
      id: newStudent.id
    });
    
    // Add to students array
    authData.students.push(newStudent);
    
    // Save the updated data
    const saved = await saveAuthData(authData);
    
    if (saved) {
      console.log('✅ Student added successfully:', newStudent.name);
      
      // Verify the student was actually saved by reloading data
      const verificationData = await loadAuthData();
      const verifiedStudent = verificationData.students.find(s => s.id === newStudent.id);
      
      if (verifiedStudent) {
        console.log('✅ Student verification successful:', verifiedStudent.name);
        
        // Also verify authentication will work
        const authTest = verificationData.students.find(s => 
          s.email.toLowerCase() === newStudent.email.toLowerCase() && 
          s.mobile === newStudent.mobile
        );
        
        if (authTest) {
          console.log('✅ Authentication test passed for new student');
        } else {
          console.error('❌ Authentication test failed for new student');
        }
        
        return true;
      } else {
        console.error('❌ Student verification failed - not found after save');
        return false;
      }
    } else {
      console.error('❌ Failed to save student data');
      return false;
    }
  } catch (error) {
    console.error('❌ Error in addStudent:', error);
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
    console.log('🔐 Authenticating student with:', { email, mobile });
    const authData = await loadAuthData();
    
    console.log('👥 Available students:', authData.students.map(s => ({ 
      name: s.name,
      email: s.email, 
      mobile: s.mobile,
      id: s.id 
    })));
    
    // Normalize inputs
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMobile = mobile.trim();
    
    console.log('🔍 Searching for:', { normalizedEmail, normalizedMobile });
    
    // Authenticate using email and mobile number (mobile is used as password)
    const student = authData.students.find(s => {
      const studentEmailMatch = s.email.toLowerCase() === normalizedEmail;
      const studentMobileMatch = s.mobile === normalizedMobile;
      
      console.log(`📋 Checking ${s.name}:`, {
        email: s.email,
        emailMatch: studentEmailMatch,
        mobile: s.mobile, 
        mobileMatch: studentMobileMatch,
        overallMatch: studentEmailMatch && studentMobileMatch
      });
      
      return studentEmailMatch && studentMobileMatch;
    });
    
    if (student) {
      console.log('✅ Student authentication successful:', {
        name: student.name,
        email: student.email,
        mobile: student.mobile,
        id: student.id
      });
      return student;
    } else {
      console.log('❌ No student found with provided credentials');
      console.log('🔍 Double-checking with exact matches:');
      
      // Extra debugging - check each student individually
      authData.students.forEach((s, index) => {
        console.log(`Student ${index + 1}:`, {
          name: s.name,
          storedEmail: s.email,
          inputEmail: normalizedEmail,
          emailMatch: s.email === normalizedEmail,
          storedMobile: s.mobile,
          inputMobile: normalizedMobile,
          mobileMatch: s.mobile === normalizedMobile
        });
      });
      
      return null;
    }
  } catch (error) {
    console.error('❌ Error in authenticateStudent:', error);
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
