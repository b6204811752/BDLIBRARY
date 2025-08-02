export interface StudyMaterial {
  id: string;
  title: string;
  category: string;
  type: 'pdf' | 'video' | 'quiz' | 'notes';
  description: string;
  downloadUrl: string;
  uploadDate: string;
  size: string;
}

export interface JobCategory {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  examPattern: string;
  materials: StudyMaterial[];
}

export const jobCategories: JobCategory[] = [
  {
    id: 'banking',
    name: 'Banking Exams',
    description: 'SBI, IBPS, RRB Banking preparation materials',
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness', 'Computer Knowledge'],
    examPattern: 'Prelims + Mains + Interview',
    materials: [
      {
        id: 'bank1',
        title: 'Banking Quantitative Aptitude Complete Guide',
        category: 'banking',
        type: 'pdf',
        description: 'Comprehensive guide covering all quantitative aptitude topics for banking exams',
        downloadUrl: '#',
        uploadDate: '2024-01-15',
        size: '2.5 MB'
      },
      {
        id: 'bank2',
        title: 'Banking Reasoning Video Lectures',
        category: 'banking',
        type: 'video',
        description: 'Video lectures on logical reasoning for banking exams',
        downloadUrl: '#',
        uploadDate: '2024-01-12',
        size: '150 MB'
      },
      {
        id: 'bank3',
        title: 'Banking Mock Test Series',
        category: 'banking',
        type: 'quiz',
        description: 'Practice tests for banking exam preparation',
        downloadUrl: '#',
        uploadDate: '2024-01-18',
        size: '1.2 MB'
      }
    ]
  },
  {
    id: 'ssc',
    name: 'SSC Exams',
    description: 'SSC CGL, CHSL, MTS, GD preparation materials',
    subjects: ['General Intelligence', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension'],
    examPattern: 'Tier 1 + Tier 2 + Tier 3',
    materials: [
      {
        id: 'ssc1',
        title: 'SSC General Studies Complete Notes',
        category: 'ssc',
        type: 'notes',
        description: 'Complete general studies notes for SSC exams',
        downloadUrl: '#',
        uploadDate: '2024-01-10',
        size: '3.2 MB'
      },
      {
        id: 'ssc2',
        title: 'SSC English Practice Papers',
        category: 'ssc',
        type: 'pdf',
        description: 'English practice papers with solutions',
        downloadUrl: '#',
        uploadDate: '2024-01-14',
        size: '1.8 MB'
      }
    ]
  },
  {
    id: 'railway',
    name: 'Railway Exams',
    description: 'RRB NTPC, Group D, JE preparation materials',
    subjects: ['Mathematics', 'General Intelligence', 'General Awareness', 'General Science'],
    examPattern: 'CBT 1 + CBT 2 + Skill Test',
    materials: [
      {
        id: 'rail1',
        title: 'Railway Mathematics Formula Book',
        category: 'railway',
        type: 'pdf',
        description: 'Important mathematics formulas for railway exams',
        downloadUrl: '#',
        uploadDate: '2024-01-16',
        size: '1.5 MB'
      },
      {
        id: 'rail2',
        title: 'Railway General Science Video Course',
        category: 'railway',
        type: 'video',
        description: 'Complete general science video course',
        downloadUrl: '#',
        uploadDate: '2024-01-11',
        size: '200 MB'
      }
    ]
  },
  {
    id: 'upsc',
    name: 'UPSC Civil Services',
    description: 'IAS, IPS, IFS preparation materials',
    subjects: ['History', 'Geography', 'Polity', 'Economy', 'Environment', 'Current Affairs'],
    examPattern: 'Prelims + Mains + Interview',
    materials: [
      {
        id: 'upsc1',
        title: 'UPSC History Complete Notes',
        category: 'upsc',
        type: 'notes',
        description: 'Comprehensive history notes for UPSC preparation',
        downloadUrl: '#',
        uploadDate: '2024-01-13',
        size: '4.5 MB'
      }
    ]
  },
  {
    id: 'state',
    name: 'State Government Jobs',
    description: 'Various state government job preparation materials',
    subjects: ['General Knowledge', 'Current Affairs', 'Reasoning', 'Mathematics'],
    examPattern: 'Written Test + Interview',
    materials: [
      {
        id: 'state1',
        title: 'State Government GK Handbook',
        category: 'state',
        type: 'pdf',
        description: 'General knowledge handbook for state government jobs',
        downloadUrl: '#',
        uploadDate: '2024-01-17',
        size: '2.8 MB'
      }
    ]
  },
  {
    id: 'defense',
    name: 'Defense Exams',
    description: 'NDA, CDS, AFCAT preparation materials',
    subjects: ['Mathematics', 'English', 'General Knowledge', 'Physics', 'Chemistry'],
    examPattern: 'Written Test + SSB Interview',
    materials: [
      {
        id: 'def1',
        title: 'Defense Mathematics Practice Book',
        category: 'defense',
        type: 'pdf',
        description: 'Mathematics practice book for defense exams',
        downloadUrl: '#',
        uploadDate: '2024-01-19',
        size: '2.1 MB'
      }
    ]
  }
];

export function getMaterialsByCategory(category: string): StudyMaterial[] {
  const jobCategory = jobCategories.find(cat => cat.id === category);
  return jobCategory?.materials || [];
}

export function getAllMaterials(): StudyMaterial[] {
  return jobCategories.flatMap(cat => cat.materials);
}

export function getMaterialById(id: string): StudyMaterial | undefined {
  return getAllMaterials().find(material => material.id === id);
}