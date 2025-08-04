'use client';

import { 
  Student, 
  Admin, 
  studentOperations, 
  adminOperations, 
  databaseOperations 
} from './database';

// Re-export types for backward compatibility
export type { Student, Admin };

// Current user state
let currentUser: { type: 'student' | 'admin'; data: Student | Admin } | null = null;

// Initialize the database system
export async function initializeAuthData(): Promise<void> {
  try {
    console.log('🚀 Initializing file-based database system...');
    
    // Force initialization if we're in a clean environment (like Vercel)
    if (typeof window !== 'undefined') {
      const existingData = localStorage.getItem('bd_library_database');
      if (!existingData) {
        console.log('🆕 No existing database found, initializing with default data...');
        // Force reset to ensure we have the latest structure with progress data
        await resetDatabase();
      }
    }
    
    // The database is automatically initialized when imported
    const stats = databaseOperations.stats();
    console.log('📊 Database Statistics:', stats);
    
    console.log('✅ File-based database system initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database system:', error);
    throw error;
  }
}

// Student Authentication
export async function authenticateStudent(email: string, mobile: string): Promise<Student | null> {
  console.log('🔐 Student authentication attempt:', { email, mobile });
  
  try {
    // Ensure database is initialized first
    await initializeAuthData();
    
    const student = studentOperations.authenticate(email, mobile);
    
    if (student) {
      console.log('✅ Student authentication successful:', student.name);
      return student;
    } else {
      console.log('❌ Student authentication failed: Invalid credentials');
      return null;
    }
  } catch (error) {
    console.error('❌ Student authentication error:', error);
    return null;
  }
}

// Admin Authentication
export async function authenticateAdmin(username: string, password: string): Promise<Admin | null> {
  console.log('🔐 Admin authentication attempt:', { username });
  
  try {
    const admin = adminOperations.authenticate(username, password);
    
    if (admin) {
      console.log('✅ Admin authentication successful:', admin.name);
      return admin;
    } else {
      console.log('❌ Admin authentication failed: Invalid credentials');
      return null;
    }
  } catch (error) {
    console.error('❌ Admin authentication error:', error);
    return null;
  }
}

// Set current user
export function setCurrentUser(type: 'student' | 'admin', userData: Student | Admin): void {
  currentUser = { type, data: userData };
  
  // Store in sessionStorage for persistence across page reloads
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('bd_library_current_user', JSON.stringify(currentUser));
      const userName = type === 'admin' ? (userData as Admin).username : userData.name;
      console.log('👤 Current user set:', { type, name: userName });
    } catch (error) {
      console.error('❌ Error saving current user:', error);
    }
  }
}

// Get current user
export function getCurrentUser(): { type: 'student' | 'admin'; data: Student | Admin } | null {
  if (currentUser) {
    return currentUser;
  }
  
  // Try to restore from sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('bd_library_current_user');
      if (stored) {
        currentUser = JSON.parse(stored);
        console.log('👤 Current user restored from session:', currentUser);
        return currentUser;
      }
    } catch (error) {
      console.error('❌ Error restoring current user:', error);
    }
  }
  
  return null;
}

// Clear current user (logout)
export function clearCurrentUser(): void {
  currentUser = null;
  
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem('bd_library_current_user');
      console.log('👤 Current user cleared');
    } catch (error) {
      console.error('❌ Error clearing current user:', error);
    }
  }
}

// Add new student (Admin function)
export async function addStudent(studentData: {
  name: string;
  email: string;
  mobile: string;
  course?: string;
}): Promise<Student | null> {
  console.log('➕ Adding new student:', studentData);
  
  try {
    const newStudent = studentOperations.add({
      name: studentData.name,
      email: studentData.email,
      mobile: studentData.mobile,
      course: studentData.course || 'General',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });
    
    console.log('✅ Student added successfully:', newStudent);
    
    // Test authentication immediately after adding
    const testAuth = await authenticateStudent(newStudent.email, newStudent.mobile);
    if (testAuth) {
      console.log('✅ New student authentication test passed');
    } else {
      console.warn('⚠️ New student authentication test failed');
    }
    
    return newStudent;
  } catch (error) {
    console.error('❌ Error adding student:', error);
    return null;
  }
}

// Get all students (Admin function)
export async function getAllStudents(): Promise<Student[]> {
  try {
    const students = studentOperations.getAll();
    console.log('📋 Retrieved all students:', students.length);
    return students;
  } catch (error) {
    console.error('❌ Error getting all students:', error);
    return [];
  }
}

// Update student (Admin function)
export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
  console.log('📝 Updating student:', { id, updates });
  
  try {
    const updated = studentOperations.update(id, updates);
    
    if (updated) {
      console.log('✅ Student updated successfully:', updated);
    } else {
      console.log('❌ Student update failed: Student not found');
    }
    
    return updated;
  } catch (error) {
    console.error('❌ Error updating student:', error);
    return null;
  }
}

// Delete student (Admin function)
export async function deleteStudent(id: string): Promise<boolean> {
  console.log('🗑️ Deleting student:', id);
  
  try {
    const success = studentOperations.delete(id);
    
    if (success) {
      console.log('✅ Student deleted successfully');
    } else {
      console.log('❌ Student deletion failed: Student not found');
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error deleting student:', error);
    return false;
  }
}

// Database management functions
export async function exportDatabase(): Promise<string> {
  try {
    const exported = databaseOperations.export();
    console.log('📤 Database exported successfully');
    return exported;
  } catch (error) {
    console.error('❌ Error exporting database:', error);
    return '';
  }
}

export async function importDatabase(jsonData: string): Promise<boolean> {
  try {
    const success = databaseOperations.import(jsonData);
    
    if (success) {
      console.log('📥 Database imported successfully');
    } else {
      console.log('❌ Database import failed');
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error importing database:', error);
    return false;
  }
}

export async function resetDatabase(): Promise<void> {
  try {
    databaseOperations.reset();
    console.log('🔄 Database reset successfully');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
}

// Debug functions
export async function debugAuthData(): Promise<void> {
  console.log('🔍 ===========================================');
  console.log('🔍 DEBUG: Current Authentication Data State');
  console.log('🔍 ===========================================');
  
  try {
    const stats = databaseOperations.stats();
    console.log('📊 Database Stats:', stats);
    
    const students = studentOperations.getAll();
    console.log('👥 Students in database:', students.length);
    students.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.name} (${student.email}, ${student.mobile}) - Status: ${student.status}`);
    });
    
    const admins = adminOperations.getAll();
    console.log('👤 Admins in database:', admins.length);
    admins.forEach((admin, index) => {
      console.log(`  ${index + 1}. ${admin.name} (${admin.username})`);
    });
    
    const currentUserInfo = getCurrentUser();
    if (currentUserInfo) {
      const userName = currentUserInfo.type === 'admin' 
        ? (currentUserInfo.data as Admin).username 
        : currentUserInfo.data.name;
      console.log('👤 Current User:', `${currentUserInfo.type} - ${userName}`);
    } else {
      console.log('👤 Current User: None');
    }
    
  } catch (error) {
    console.error('❌ Error in debug function:', error);
  }
  
  console.log('🔍 ===========================================');
}

export async function refreshAuthData(): Promise<void> {
  console.log('🔄 Refreshing authentication data...');
  
  try {
    // Force reload database stats
    const stats = databaseOperations.stats();
    console.log('✅ Authentication data refreshed:', stats);
  } catch (error) {
    console.error('❌ Error refreshing auth data:', error);
    throw error;
  }
}

// Test authentication function for debugging
export async function testAuthentication(email: string, mobile: string): Promise<{
  success: boolean;
  student?: Student;
  message: string;
}> {
  console.log('🧪 Testing authentication for:', { email, mobile });
  
  try {
    // First ensure database is initialized
    await initializeAuthData();
    
    const student = await authenticateStudent(email, mobile);
    
    if (student) {
      return {
        success: true,
        student,
        message: `Authentication successful for ${student.name}`
      };
    } else {
      return {
        success: false,
        message: 'Authentication failed: Invalid email or mobile number'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Authentication error: ${error}`
    };
  }
}

// Quick test function for demo credentials
export async function testDemoLogin(): Promise<void> {
  console.log('🎯 Testing demo login credentials...');
  
  const demoCredentials = [
    { email: 'rajesh@email.com', mobile: '9065541346', name: 'Rajesh Kumar' },
    { email: 'priya@email.com', mobile: '9876543211', name: 'Priya Sharma' },
    { email: 'amit@email.com', mobile: '9876543212', name: 'Amit Singh' },
    { email: 'john@example.com', mobile: '9876543210', name: 'John Doe' },
    { email: 'demo@student.com', mobile: '1234567890', name: 'Demo Student' }
  ];
  
  for (const cred of demoCredentials) {
    const result = await testAuthentication(cred.email, cred.mobile);
    console.log(`📝 ${cred.name}: ${result.success ? '✅ SUCCESS' : '❌ FAILED'} - ${result.message}`);
  }
}

// Additional missing functions for compatibility
export function logout(): void {
  clearCurrentUser();
}

export async function subscribeToDataChanges(callback: () => void): Promise<() => void> {
  // For file-based system, we can implement this with storage events
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', callback);
    // Return unsubscribe function
    return () => {
      window.removeEventListener('storage', callback);
    };
  }
  // Return empty function if not in browser
  return () => {};
}

export async function updateStudentProgress(studentId: string, progress: any): Promise<boolean> {
  try {
    const students = studentOperations.getAll();
    const student = students.find(s => s.id === studentId);
    
    if (student) {
      const updated = await updateStudent(studentId, { ...student, ...progress });
      return !!updated;
    }
    return false;
  } catch (error) {
    console.error('❌ Error updating student progress:', error);
    return false;
  }
}

export async function markNotificationAsRead(studentId: string, notificationId: string): Promise<boolean> {
  try {
    const students = studentOperations.getAll();
    const student = students.find(s => s.id === studentId);
    
    if (student && student.notifications) {
      const updatedNotifications = student.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      
      const updated = await updateStudent(studentId, { 
        ...student, 
        notifications: updatedNotifications 
      });
      return !!updated;
    }
    return false;
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    return false;
  }
}

// Expose test functions globally for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).testAuth = testAuthentication;
  (window as any).testDemoLogin = testDemoLogin;
  (window as any).debugAuth = debugAuthData;
  (window as any).initAuth = initializeAuthData;
}
