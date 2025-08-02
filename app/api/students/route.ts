import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Student } from '@/lib/auth';

// Data file path
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'students.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Default data structure
const defaultAuthData = {
  admins: [
    {
      id: 'admin1',
      username: 'admin',
      password: 'admin123',
      role: 'admin' as const
    }
  ],
  students: [
    {
      id: 'student1',
      name: 'John Doe',
      email: 'john@example.com',
      username: 'john_doe',
      password: 'password123',
      role: 'student' as const,
      course: 'Computer Science',
      duration: 6,
      monthlyFees: 5000,
      libraryAccess: true,
      examsPassed: 2,
      counselingBooked: false,
      joinDate: '2024-01-15'
    }
  ]
};

// Read data from file
async function readDataFromFile() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with default data
    console.log('Creating new data file with default data');
    await writeDataToFile(defaultAuthData);
    return defaultAuthData;
  }
}

// Write data to file
async function writeDataToFile(data: any) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Data saved to file successfully');
  } catch (error) {
    console.error('Error saving data to file:', error);
    throw error;
  }
}

// GET - Retrieve all students
export async function GET() {
  try {
    const data = await readDataFromFile();
    return NextResponse.json({
      success: true,
      students: data.students || []
    });
  } catch (error) {
    console.error('Error reading students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read students' },
      { status: 500 }
    );
  }
}

// POST - Add new student
export async function POST(request: NextRequest) {
  try {
    const newStudent = await request.json();
    const data = await readDataFromFile();
    
    // Generate unique ID
    const newId = 'student' + (Date.now());
    const studentWithId = {
      ...newStudent,
      id: newId,
      role: 'student' as const
    };
    
    // Add to students array
    if (!data.students) {
      data.students = [];
    }
    data.students.push(studentWithId);
    
    // Save to file
    await writeDataToFile(data);
    
    return NextResponse.json({
      success: true,
      student: studentWithId,
      message: 'Student added successfully'
    });
  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add student' },
      { status: 500 }
    );
  }
}

// PUT - Update student
export async function PUT(request: NextRequest) {
  try {
    const updatedStudent = await request.json();
    const data = await readDataFromFile();
    
    if (!data.students) {
      data.students = [];
    }
    
    // Find and update student
    const studentIndex = data.students.findIndex((s: Student) => s.id === updatedStudent.id);
    if (studentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }
    
    data.students[studentIndex] = updatedStudent;
    await writeDataToFile(data);
    
    return NextResponse.json({
      success: true,
      student: updatedStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE - Remove student
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('id');
    
    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }
    
    const data = await readDataFromFile();
    
    if (!data.students) {
      data.students = [];
    }
    
    // Filter out the student to delete
    const initialLength = data.students.length;
    data.students = data.students.filter((s: Student) => s.id !== studentId);
    
    if (data.students.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }
    
    await writeDataToFile(data);
    
    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
