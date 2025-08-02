export interface ScheduleItem {
  id: string;
  shift: 'morning' | 'afternoon' | 'evening';
  time: string;
  subject: string;
  topic: string;
  instructor: string;
  room: string;
  category: string;
}

export const scheduleData: ScheduleItem[] = [
  // Morning Shift (6:00 AM - 12:00 PM)
  {
    id: 'm1',
    shift: 'morning',
    time: '6:00 AM - 8:00 AM',
    subject: 'Quantitative Aptitude',
    topic: 'Number System & Algebra',
    instructor: 'Prof. Rajesh Kumar',
    room: 'Room A1',
    category: 'banking'
  },
  {
    id: 'm2',
    shift: 'morning',
    time: '8:30 AM - 10:30 AM',
    subject: 'General Studies',
    topic: 'Indian History',
    instructor: 'Dr. Priya Sharma',
    room: 'Room A2',
    category: 'ssc'
  },
  {
    id: 'm3',
    shift: 'morning',
    time: '11:00 AM - 12:00 PM',
    subject: 'English',
    topic: 'Grammar & Comprehension',
    instructor: 'Ms. Anjali Singh',
    room: 'Room A3',
    category: 'banking'
  },
  
  // Afternoon Shift (12:00 PM - 6:00 PM)
  {
    id: 'a1',
    shift: 'afternoon',
    time: '12:00 PM - 2:00 PM',
    subject: 'Reasoning',
    topic: 'Logical Reasoning',
    instructor: 'Mr. Amit Gupta',
    room: 'Room B1',
    category: 'ssc'
  },
  {
    id: 'a2',
    shift: 'afternoon',
    time: '2:30 PM - 4:30 PM',
    subject: 'Mathematics',
    topic: 'Geometry & Trigonometry',
    instructor: 'Prof. Suresh Nair',
    room: 'Room B2',
    category: 'railway'
  },
  {
    id: 'a3',
    shift: 'afternoon',
    time: '5:00 PM - 6:00 PM',
    subject: 'Current Affairs',
    topic: 'Monthly Current Affairs',
    instructor: 'Dr. Kavita Joshi',
    room: 'Room B3',
    category: 'upsc'
  },
  
  // Evening Shift (6:00 PM - 10:00 PM)
  {
    id: 'e1',
    shift: 'evening',
    time: '6:00 PM - 8:00 PM',
    subject: 'General Science',
    topic: 'Physics & Chemistry',
    instructor: 'Dr. Ravi Patel',
    room: 'Room C1',
    category: 'railway'
  },
  {
    id: 'e2',
    shift: 'evening',
    time: '8:30 PM - 10:00 PM',
    subject: 'Computer Knowledge',
    topic: 'MS Office & Internet',
    instructor: 'Mr. Deepak Yadav',
    room: 'Room C2',
    category: 'banking'
  },
  {
    id: 'e3',
    shift: 'evening',
    time: '8:00 PM - 9:30 PM',
    subject: 'Essay Writing',
    topic: 'Essay Techniques',
    instructor: 'Prof. Meera Agarwal',
    room: 'Room C3',
    category: 'upsc'
  }
];

export function getScheduleByShift(shift: 'morning' | 'afternoon' | 'evening'): ScheduleItem[] {
  return scheduleData.filter(item => item.shift === shift);
}

export function getScheduleByCategory(category: string): ScheduleItem[] {
  return scheduleData.filter(item => item.category === category);
}

export function getTodaysSchedule(): ScheduleItem[] {
  return scheduleData;
}