export interface Question {
  id: string;
  question: string;
  questionHindi: string;
  options: string[];
  optionsHindi: string[];
  correctAnswer: number;
  explanation: string;
  explanationHindi: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
}

export interface TestSet {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  totalQuestions: number;
  duration: number; // in minutes
  totalMarks: number;
  subjects: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  questions: Question[];
  type: 'mock' | 'previous-year' | 'sectional' | 'practice';
  isActive: boolean;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  startTime: Date;
  endTime?: Date;
  answers: { [questionId: string]: number | null };
  timeSpent: { [questionId: string]: number }; // in seconds
  score?: number;
  totalMarks: number;
  percentage?: number;
  status: 'in-progress' | 'completed' | 'submitted';
  isReviewed: boolean;
  bookmarkedQuestions: string[];
  flaggedQuestions: string[];
}

// Sample test data with real questions
export const practiceTests: TestSet[] = [
  {
    id: 'ssc-cgl-mock-1',
    name: 'SSC CGL Mock Test 1',
    nameHindi: 'एसएससी सीजीएल मॉक टेस्ट 1',
    description: 'Complete mock test covering all sections of SSC CGL',
    descriptionHindi: 'एसएससी सीजीएल के सभी वर्गों को कवर करने वाला पूर्ण मॉक टेस्ट',
    totalQuestions: 100,
    duration: 60, // 60 minutes
    totalMarks: 200,
    subjects: ['General Intelligence', 'General Awareness', 'Quantitative Aptitude', 'English'],
    difficulty: 'Medium',
    category: 'SSC',
    type: 'mock',
    isActive: true,
    questions: [
      {
        id: 'q1',
        question: 'If COMPUTER is coded as RFUVQNPC, then MEDICINE will be coded as:',
        questionHindi: 'यदि COMPUTER को RFUVQNPC के रूप में कोडित किया जाता है, तो MEDICINE को कोडित किया जाएगा:',
        options: ['EOJDJMOD', 'EOJDIMOE', 'EOJDMODE', 'EOJDMEDO'],
        optionsHindi: ['EOJDJMOD', 'EOJDIMOE', 'EOJDMODE', 'EOJDMEDO'],
        correctAnswer: 1,
        explanation: 'Each letter is moved 4 positions forward in the alphabet. M+4=Q, E+4=I, D+4=H, I+4=M, C+4=G, I+4=M, N+4=R, E+4=I',
        explanationHindi: 'प्रत्येक अक्षर को वर्णमाला में 4 स्थान आगे बढ़ाया जाता है। M+4=Q, E+4=I, D+4=H, I+4=M, C+4=G, I+4=M, N+4=R, E+4=I',
        subject: 'General Intelligence',
        difficulty: 'Medium',
        marks: 2
      },
      {
        id: 'q2',
        question: 'Find the missing number in the series: 2, 6, 12, 20, 30, ?',
        questionHindi: 'श्रृंखला में लुप्त संख्या ज्ञात कीजिए: 2, 6, 12, 20, 30, ?',
        options: ['42', '40', '38', '44'],
        optionsHindi: ['42', '40', '38', '44'],
        correctAnswer: 0,
        explanation: 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42',
        explanationHindi: 'पैटर्न n(n+1) है: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42',
        subject: 'General Intelligence',
        difficulty: 'Easy',
        marks: 2
      },
      {
        id: 'q3',
        question: 'Who is known as the "Father of the Indian Constitution"?',
        questionHindi: '"भारतीय संविधान के जनक" के रूप में किसे जाना जाता है?',
        options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Dr. B.R. Ambedkar', 'Sardar Patel'],
        optionsHindi: ['महात्मा गांधी', 'जवाहरलाल नेहरू', 'डॉ. बी.आर. अम्बेडकर', 'सरदार पटेल'],
        correctAnswer: 2,
        explanation: 'Dr. B.R. Ambedkar is known as the Father of the Indian Constitution as he was the chairman of the Drafting Committee.',
        explanationHindi: 'डॉ. बी.आर. अम्बेडकर को भारतीय संविधान के जनक के रूप में जाना जाता है क्योंकि वे मसौदा समिति के अध्यक्ष थे।',
        subject: 'General Awareness',
        difficulty: 'Easy',
        marks: 2
      },
      {
        id: 'q4',
        question: 'What is the square root of 144?',
        questionHindi: '144 का वर्गमूल क्या है?',
        options: ['11', '12', '13', '14'],
        optionsHindi: ['11', '12', '13', '14'],
        correctAnswer: 1,
        explanation: '√144 = 12, because 12 × 12 = 144',
        explanationHindi: '√144 = 12, क्योंकि 12 × 12 = 144',
        subject: 'Quantitative Aptitude',
        difficulty: 'Easy',
        marks: 2
      },
      {
        id: 'q5',
        question: 'Choose the correct synonym for "Abundant":',
        questionHindi: '"Abundant" का सही समानार्थी शब्द चुनें:',
        options: ['Scarce', 'Plentiful', 'Limited', 'Rare'],
        optionsHindi: ['दुर्लभ', 'प्रचुर', 'सीमित', 'विरल'],
        correctAnswer: 1,
        explanation: 'Abundant means existing or available in large quantities; plentiful.',
        explanationHindi: 'Abundant का अर्थ है बड़ी मात्रा में मौजूद या उपलब्ध; प्रचुर।',
        subject: 'English',
        difficulty: 'Easy',
        marks: 2
      }
    ]
  },
  {
    id: 'banking-mock-1',
    name: 'Banking Awareness Mock Test',
    nameHindi: 'बैंकिंग जागरूकता मॉक टेस्ट',
    description: 'Banking and Financial Awareness Test',
    descriptionHindi: 'बैंकिंग और वित्तीय जागरूकता परीक्षा',
    totalQuestions: 50,
    duration: 45,
    totalMarks: 100,
    subjects: ['Banking Awareness', 'Financial Awareness'],
    difficulty: 'Medium',
    category: 'Banking',
    type: 'mock',
    isActive: true,
    questions: [
      {
        id: 'b1',
        question: 'What is the full form of NEFT?',
        questionHindi: 'NEFT का पूरा नाम क्या है?',
        options: [
          'National Electronic Funds Transfer',
          'New Electronic Funds Transfer',
          'National Electronic Financial Transfer',
          'Net Electronic Funds Transfer'
        ],
        optionsHindi: [
          'राष्ट्रीय इलेक्ट्रॉनिक धन हस्तांतरण',
          'नया इलेक्ट्रॉनिक धन हस्तांतरण',
          'राष्ट्रीय इलेक्ट्रॉनिक वित्तीय हस्तांतरण',
          'नेट इलेक्ट्रॉनिक धन हस्तांतरण'
        ],
        correctAnswer: 0,
        explanation: 'NEFT stands for National Electronic Funds Transfer, which is an electronic payment system maintained by RBI.',
        explanationHindi: 'NEFT का मतलब राष्ट्रीय इलेक्ट्रॉनिक धन हस्तांतरण है, जो RBI द्वारा बनाए रखा जाने वाला एक इलेक्ट्रॉनिक भुगतान प्रणाली है।',
        subject: 'Banking Awareness',
        difficulty: 'Easy',
        marks: 2
      },
      {
        id: 'b2',
        question: 'What is the current repo rate in India (as of 2024)?',
        questionHindi: 'भारत में वर्तमान रेपो दर क्या है (2024 तक)?',
        options: ['6.50%', '6.25%', '6.75%', '7.00%'],
        optionsHindi: ['6.50%', '6.25%', '6.75%', '7.00%'],
        correctAnswer: 0,
        explanation: 'As of 2024, the repo rate in India is 6.50%, as set by the Reserve Bank of India.',
        explanationHindi: '2024 तक, भारत में रेपो दर 6.50% है, जैसा कि भारतीय रिजर्व बैंक द्वारा निर्धारित किया गया है।',
        subject: 'Banking Awareness',
        difficulty: 'Medium',
        marks: 2
      }
    ]
  }
];

// Test attempt management functions
export const createTestAttempt = (testId: string, studentId: string): TestAttempt => {
  return {
    id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    testId,
    studentId,
    startTime: new Date(),
    answers: {},
    timeSpent: {},
    totalMarks: 0,
    status: 'in-progress',
    isReviewed: false,
    bookmarkedQuestions: [],
    flaggedQuestions: []
  };
};

export const saveTestAttempt = (attempt: TestAttempt) => {
  const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
  const existingIndex = attempts.findIndex((a: TestAttempt) => a.id === attempt.id);
  
  if (existingIndex >= 0) {
    attempts[existingIndex] = attempt;
  } else {
    attempts.push(attempt);
  }
  
  localStorage.setItem('testAttempts', JSON.stringify(attempts));
};

export const getTestAttempt = (attemptId: string): TestAttempt | null => {
  const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
  return attempts.find((a: TestAttempt) => a.id === attemptId) || null;
};

export const getStudentAttempts = (studentId: string, testId?: string): TestAttempt[] => {
  const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
  return attempts.filter((a: TestAttempt) => 
    a.studentId === studentId && (!testId || a.testId === testId)
  );
};

export const calculateScore = (attempt: TestAttempt, test: TestSet): number => {
  let totalScore = 0;
  
  Object.keys(attempt.answers).forEach(questionId => {
    const question = test.questions.find(q => q.id === questionId);
    const answer = attempt.answers[questionId];
    
    if (question && answer !== null && answer === question.correctAnswer) {
      totalScore += question.marks;
    }
  });
  
  return totalScore;
};
