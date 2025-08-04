// Simple file-based database system for BD Library
export interface Student {
  id: string;
  name: string;
  email: string;
  mobile: string;
  course?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  progress?: {
    materialsDownloaded?: number;
    testsCompleted?: number;
    totalPoints?: number;
    currentStreak?: number;
    lastActive?: string;
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
  name: string;
  role: 'admin';
}

export interface DatabaseSchema {
  students: Student[];
  admins: Admin[];
  lastUpdated: string;
}

// Default database structure
export const defaultDatabase: DatabaseSchema = {
  students: [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      mobile: '9065541346',
      course: 'Web Development',
      enrollmentDate: '2024-01-15',
      status: 'active',
      progress: {
        materialsDownloaded: 5,
        testsCompleted: 2,
        totalPoints: 150,
        currentStreak: 3,
        lastActive: new Date().toISOString()
      }
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@email.com',
      mobile: '9876543211',
      course: 'Digital Marketing',
      enrollmentDate: '2024-01-20',
      status: 'active',
      progress: {
        materialsDownloaded: 3,
        testsCompleted: 1,
        totalPoints: 80,
        currentStreak: 1,
        lastActive: new Date().toISOString()
      }
    },
    {
      id: '3',
      name: 'Amit Singh',
      email: 'amit@email.com',
      mobile: '9876543212',
      course: 'Data Science',
      enrollmentDate: '2024-02-01',
      status: 'active',
      progress: {
        materialsDownloaded: 8,
        testsCompleted: 4,
        totalPoints: 320,
        currentStreak: 5,
        lastActive: new Date().toISOString()
      }
    },
    {
      id: '4',
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      course: 'Programming',
      enrollmentDate: '2024-02-10',
      status: 'active',
      progress: {
        materialsDownloaded: 2,
        testsCompleted: 1,
        totalPoints: 70,
        currentStreak: 2,
        lastActive: new Date().toISOString()
      }
    },
    {
      id: '5',
      name: 'Demo Student',
      email: 'demo@student.com',
      mobile: '1234567890',
      course: 'General',
      enrollmentDate: '2024-03-01',
      status: 'active',
      progress: {
        materialsDownloaded: 0,
        testsCompleted: 0,
        totalPoints: 0,
        currentStreak: 0,
        lastActive: new Date().toISOString()
      }
    }
  ],
  admins: [
    {
      id: 'admin1',
      username: 'admin',
      password: 'admin123',
      name: 'Administrator',
      role: 'admin'
    }
  ],
  lastUpdated: new Date().toISOString()
};

// Database operations
class FileDatabase {
  private static instance: FileDatabase;
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  static getInstance(): FileDatabase {
    if (!FileDatabase.instance) {
      FileDatabase.instance = new FileDatabase();
    }
    return FileDatabase.instance;
  }

  // Load database from localStorage or initialize with default data
  private loadDatabase(): DatabaseSchema {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bd_library_database');
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log('📁 Database loaded from localStorage:', {
            students: parsed.students?.length || 0,
            admins: parsed.admins?.length || 0,
            lastUpdated: parsed.lastUpdated
          });
          return parsed;
        }
      } catch (error) {
        console.error('❌ Error loading database:', error);
      }
    }
    
    console.log('🆕 Initializing new database with default data');
    return defaultDatabase;
  }

  // Save database to localStorage
  private saveDatabase(): void {
    if (typeof window !== 'undefined') {
      try {
        this.data.lastUpdated = new Date().toISOString();
        localStorage.setItem('bd_library_database', JSON.stringify(this.data));
        console.log('💾 Database saved successfully:', {
          students: this.data.students.length,
          admins: this.data.admins.length,
          lastUpdated: this.data.lastUpdated
        });
      } catch (error) {
        console.error('❌ Error saving database:', error);
      }
    }
  }

  // Student operations
  addStudent(student: Omit<Student, 'id'>): Student {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      enrollmentDate: student.enrollmentDate || new Date().toISOString().split('T')[0],
      status: 'active'
    };

    this.data.students.push(newStudent);
    this.saveDatabase();
    
    console.log('✅ Student added:', newStudent);
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const index = this.data.students.findIndex(s => s.id === id);
    if (index === -1) {
      console.log('❌ Student not found for update:', id);
      return null;
    }

    this.data.students[index] = { ...this.data.students[index], ...updates };
    this.saveDatabase();
    
    console.log('✅ Student updated:', this.data.students[index]);
    return this.data.students[index];
  }

  deleteStudent(id: string): boolean {
    const index = this.data.students.findIndex(s => s.id === id);
    if (index === -1) {
      console.log('❌ Student not found for deletion:', id);
      return false;
    }

    const deleted = this.data.students.splice(index, 1)[0];
    this.saveDatabase();
    
    console.log('🗑️ Student deleted:', deleted);
    return true;
  }

  getStudent(email: string, mobile: string): Student | null {
    const student = this.data.students.find(s => 
      s.email.toLowerCase() === email.toLowerCase() && 
      s.mobile === mobile &&
      s.status === 'active'
    );
    
    console.log('🔍 Student search:', { email, mobile, found: !!student });
    return student || null;
  }

  getAllStudents(): Student[] {
    console.log('📋 Getting all students:', this.data.students.length);
    return this.data.students;
  }

  // Admin operations
  getAdmin(username: string, password: string): Admin | null {
    const admin = this.data.admins.find(a => 
      a.username === username && 
      a.password === password
    );
    
    console.log('🔍 Admin search:', { username, found: !!admin });
    return admin || null;
  }

  getAllAdmins(): Admin[] {
    return this.data.admins;
  }

  // Database management
  exportDatabase(): string {
    console.log('📤 Exporting database');
    return JSON.stringify(this.data, null, 2);
  }

  importDatabase(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      
      // Validate structure
      if (!parsed.students || !parsed.admins || !Array.isArray(parsed.students) || !Array.isArray(parsed.admins)) {
        throw new Error('Invalid database structure');
      }

      this.data = parsed;
      this.saveDatabase();
      
      console.log('📥 Database imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing database:', error);
      return false;
    }
  }

  // Reset to default
  resetDatabase(): void {
    this.data = { ...defaultDatabase };
    this.saveDatabase();
    console.log('🔄 Database reset to default');
  }

  // Get database stats
  getStats() {
    return {
      totalStudents: this.data.students.length,
      activeStudents: this.data.students.filter(s => s.status === 'active').length,
      totalAdmins: this.data.admins.length,
      lastUpdated: this.data.lastUpdated
    };
  }
}

// Export singleton instance
export const database = FileDatabase.getInstance();

// Utility functions for easy access
export const studentOperations = {
  add: (student: Omit<Student, 'id'>) => database.addStudent(student),
  update: (id: string, updates: Partial<Student>) => database.updateStudent(id, updates),
  delete: (id: string) => database.deleteStudent(id),
  authenticate: (email: string, mobile: string) => database.getStudent(email, mobile),
  getAll: () => database.getAllStudents(),
};

export const adminOperations = {
  authenticate: (username: string, password: string) => database.getAdmin(username, password),
  getAll: () => database.getAllAdmins(),
};

export const databaseOperations = {
  export: () => database.exportDatabase(),
  import: (data: string) => database.importDatabase(data),
  reset: () => database.resetDatabase(),
  stats: () => database.getStats(),
};
