// Modified code - File-based storage authentication system

export interface Student {
  id: string;
  name: string;
  email: string;
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
      username: 'john_doe',
      password: 'password123',
      role: 'student',
      course: 'Computer Science',
      duration: 6,
      monthlyFees: 5000,
      libraryAccess: true,
      examsPassed: 2,
      counselingBooked: false,
      joinDate: '2024-01-15'
    },
    {
      id: 'student2',
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      username: 'rajesh_kumar',
      password: 'student123',
      role: 'student',
      course: 'Banking',
      duration: 12,
      monthlyFees: 4500,
      libraryAccess: true,
      examsPassed: 3,
      counselingBooked: true,
      joinDate: '2024-02-01'
    },
    {
      id: 'student3',
      name: 'Priya Sharma',
      email: 'priya@email.com',
      username: 'priya_sharma',
      password: 'student123',
      role: 'student',
      course: 'SSC',
      duration: 8,
      monthlyFees: 3500,
      libraryAccess: true,
      examsPassed: 1,
      counselingBooked: false,
      joinDate: '2024-01-20'
    },
    {
      id: 'student4',
      name: 'Amit Singh',
      email: 'amit@email.com',
      username: 'amit_singh',
      password: 'student123',
      role: 'student',
      course: 'Railway',
      duration: 10,
      monthlyFees: 4000,
      libraryAccess: true,
      examsPassed: 4,
      counselingBooked: true,
      joinDate: '2024-01-10'
    }
  ],
  announcements: []
};

// API-based data functions for persistent file storage
async function loadAuthData(): Promise<AuthData> {
  try {
    const response = await fetch('/api/auth');
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
  
  // Check student credentials
  const student = authData.students.find(s => s.username === username && s.password === password);
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
  const authData = await loadAuthData();
  
  const newStudent: Student = {
    ...student,
    id: 'student' + Date.now(),
    role: 'student'
  };
  
  authData.students.push(newStudent);
  return await saveAuthData(authData);
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
    const stored = localStorage.getItem('authData');
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return defaultAuthData;
}

// Export getAuthData for backward compatibility
export { getAuthData };

// Session management functions
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

// Student authentication function for login page
export async function authenticateStudent(email: string, mobile: string): Promise<Student | null> {
  const authData = await loadAuthData();
  // For now, authenticate by email only since mobile field doesn't exist in new interface
  const student = authData.students.find(s => s.email === email);
  return student || null;
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

// Legacy function - use addStudent instead
export function authenticateAdmin(username: string, password: string): Admin | null {
  const authData = getAuthData();
  const admin = authData.admins.find(a => a.username === username && a.password === password);
  return admin || null;
}
