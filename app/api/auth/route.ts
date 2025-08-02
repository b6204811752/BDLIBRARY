import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Data file path
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'auth.json');

// Interface for authentication data
interface AuthData {
  admins: Array<{
    id: string;
    username: string;
    password: string;
    role: 'admin';
  }>;
  students: Array<{
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
  }>;
}

// Default data structure
const defaultAuthData: AuthData = {
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
      joinDate: '2024-01-15'
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
      joinDate: '2024-02-01'
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
      joinDate: '2024-01-20'
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
      joinDate: '2024-01-10'
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
      joinDate: '2024-01-01'
    }
  ]
};

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read data from file
async function readDataFromFile(): Promise<AuthData> {
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
async function writeDataToFile(data: AuthData): Promise<void> {
  try {
    await ensureDataDirectory();
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Data saved to file successfully');
  } catch (error) {
    console.error('Error saving data to file:', error);
    throw error;
  }
}

// GET - Retrieve authentication data
export async function GET() {
  try {
    const data = await readDataFromFile();
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error reading auth data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read authentication data' },
      { status: 500 }
    );
  }
}

// POST - Save authentication data
export async function POST(request: NextRequest) {
  try {
    const authData: AuthData = await request.json();
    await writeDataToFile(authData);
    
    return NextResponse.json({
      success: true,
      message: 'Authentication data saved successfully'
    });
  } catch (error) {
    console.error('Error saving auth data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save authentication data' },
      { status: 500 }
    );
  }
}
