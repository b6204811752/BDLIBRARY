// Enhanced Fee Management System for BD Library

export interface FeeTransaction {
  id: string;
  studentId: string;
  amount: number;
  paymentMethod: 'cash' | 'upi' | 'bank_transfer' | 'card' | 'online';
  transactionId?: string;
  receiptNo: string;
  paymentDate: string;
  dueDate: string;
  month: string;
  year: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  description: string;
  discount?: number;
  fine?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeStructure {
  id: string;
  courseName: string;
  monthlyFee: number;
  registrationFee: number;
  libraryFee: number;
  examFee: number;
  materialFee: number;
  isActive: boolean;
  effectiveFrom: string;
}

export interface FeeReminder {
  id: string;
  studentId: string;
  dueDate: string;
  amount: number;
  reminderType: 'email' | 'sms' | 'notification';
  reminderDate: string;
  status: 'sent' | 'pending' | 'failed';
  attempts: number;
}

export interface FeeDiscount {
  id: string;
  studentId: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  reason: string;
  appliedBy: string;
  validFrom: string;
  validTill: string;
  isActive: boolean;
}

// Default fee structures
export const defaultFeeStructures: FeeStructure[] = [
  {
    id: 'fs1',
    courseName: 'SSC Preparation',
    monthlyFee: 3500,
    registrationFee: 1000,
    libraryFee: 500,
    examFee: 200,
    materialFee: 300,
    isActive: true,
    effectiveFrom: '2024-01-01'
  },
  {
    id: 'fs2',
    courseName: 'Banking Preparation',
    monthlyFee: 4500,
    registrationFee: 1500,
    libraryFee: 500,
    examFee: 300,
    materialFee: 400,
    isActive: true,
    effectiveFrom: '2024-01-01'
  },
  {
    id: 'fs3',
    courseName: 'Railway Preparation',
    monthlyFee: 4000,
    registrationFee: 1200,
    libraryFee: 500,
    examFee: 250,
    materialFee: 350,
    isActive: true,
    effectiveFrom: '2024-01-01'
  }
];

// Fee Management Functions
export const getFeeTransactions = (): FeeTransaction[] => {
  if (typeof window === 'undefined') return [];
  const transactions = localStorage.getItem('fee_transactions');
  return transactions ? JSON.parse(transactions) : [];
};

export const saveFeeTransaction = (transaction: FeeTransaction): void => {
  if (typeof window === 'undefined') return;
  const transactions = getFeeTransactions();
  const existingIndex = transactions.findIndex(t => t.id === transaction.id);
  
  if (existingIndex >= 0) {
    transactions[existingIndex] = { ...transaction, updatedAt: new Date().toISOString() };
  } else {
    transactions.push(transaction);
  }
  
  localStorage.setItem('fee_transactions', JSON.stringify(transactions));
};

export const createFeeTransaction = (
  studentId: string,
  amount: number,
  paymentMethod: FeeTransaction['paymentMethod'],
  description: string,
  createdBy: string,
  transactionId?: string
): FeeTransaction => {
  const now = new Date();
  const receiptNo = `BD${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  return {
    id: `fee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    amount,
    paymentMethod,
    transactionId,
    receiptNo,
    paymentDate: now.toISOString().split('T')[0],
    dueDate: now.toISOString().split('T')[0],
    month: now.toLocaleString('default', { month: 'long' }),
    year: now.getFullYear(),
    status: 'paid',
    description,
    createdBy,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
};

export const getStudentFeeHistory = (studentId: string): FeeTransaction[] => {
  const transactions = getFeeTransactions();
  return transactions.filter(t => t.studentId === studentId).sort((a, b) => 
    new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
  );
};

export const getOutstandingFees = (studentId: string): number => {
  const transactions = getFeeTransactions();
  const studentTransactions = transactions.filter(t => t.studentId === studentId);
  
  // Calculate total pending and overdue fees
  return studentTransactions
    .filter(t => t.status === 'pending' || t.status === 'overdue')
    .reduce((total, t) => total + t.amount, 0);
};

export const calculateMonthlyDue = (studentId: string, month: string, year: number): number => {
  // This would typically fetch from student's course fee structure
  // For now, using a base amount
  return 4000; // Default monthly fee
};

export const generateFeeReceipt = (transaction: FeeTransaction): string => {
  return `
    BD LIBRARY GOH - FEE RECEIPT
    ===========================
    Receipt No: ${transaction.receiptNo}
    Date: ${transaction.paymentDate}
    Student ID: ${transaction.studentId}
    Amount: ₹${transaction.amount}
    Payment Method: ${transaction.paymentMethod.toUpperCase()}
    Month: ${transaction.month} ${transaction.year}
    Transaction ID: ${transaction.transactionId || 'N/A'}
    
    Description: ${transaction.description}
    
    Thank you for your payment!
    ===========================
  `;
};

export const getFeeAnalytics = (startDate?: string, endDate?: string) => {
  const transactions = getFeeTransactions();
  const filteredTransactions = transactions.filter(t => {
    if (startDate && t.paymentDate < startDate) return false;
    if (endDate && t.paymentDate > endDate) return false;
    return true;
  });

  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = filteredTransactions
    .filter(t => t.status === 'pending' || t.status === 'overdue')
    .reduce((sum, t) => sum + t.amount, 0);

  const paymentMethodBreakdown = filteredTransactions
    .filter(t => t.status === 'paid')
    .reduce((acc, t) => {
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const monthlyRevenue = filteredTransactions
    .filter(t => t.status === 'paid')
    .reduce((acc, t) => {
      const monthYear = `${t.month} ${t.year}`;
      acc[monthYear] = (acc[monthYear] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return {
    totalRevenue,
    pendingAmount,
    paymentMethodBreakdown,
    monthlyRevenue,
    totalTransactions: filteredTransactions.length,
    paidTransactions: filteredTransactions.filter(t => t.status === 'paid').length,
    pendingTransactions: filteredTransactions.filter(t => t.status === 'pending').length,
    overdueTransactions: filteredTransactions.filter(t => t.status === 'overdue').length
  };
};

export const getFeeDefaulters = (): Array<{ studentId: string; outstandingAmount: number; daysPastDue: number }> => {
  const transactions = getFeeTransactions();
  const defaulters: Record<string, { amount: number; oldestDue: string }> = {};

  transactions
    .filter(t => t.status === 'pending' || t.status === 'overdue')
    .forEach(t => {
      if (!defaulters[t.studentId]) {
        defaulters[t.studentId] = { amount: 0, oldestDue: t.dueDate };
      }
      defaulters[t.studentId].amount += t.amount;
      if (t.dueDate < defaulters[t.studentId].oldestDue) {
        defaulters[t.studentId].oldestDue = t.dueDate;
      }
    });

  return Object.entries(defaulters).map(([studentId, data]) => {
    const daysPastDue = Math.floor(
      (new Date().getTime() - new Date(data.oldestDue).getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      studentId,
      outstandingAmount: data.amount,
      daysPastDue
    };
  });
};

export const sendFeeReminder = (studentId: string, amount: number, dueDate: string): FeeReminder => {
  const reminder: FeeReminder = {
    id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    dueDate,
    amount,
    reminderType: 'notification',
    reminderDate: new Date().toISOString(),
    status: 'sent',
    attempts: 1
  };

  // Save reminder (in real implementation, this would trigger actual notification)
  const reminders = getFeeReminders();
  reminders.push(reminder);
  saveFeeReminders(reminders);

  return reminder;
};

export const getFeeReminders = (): FeeReminder[] => {
  if (typeof window === 'undefined') return [];
  const reminders = localStorage.getItem('fee_reminders');
  return reminders ? JSON.parse(reminders) : [];
};

export const saveFeeReminders = (reminders: FeeReminder[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fee_reminders', JSON.stringify(reminders));
};

export const applyFeeDiscount = (
  studentId: string,
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  reason: string,
  appliedBy: string,
  validTill: string
): FeeDiscount => {
  const discount: FeeDiscount = {
    id: `discount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    discountType,
    discountValue,
    reason,
    appliedBy,
    validFrom: new Date().toISOString().split('T')[0],
    validTill,
    isActive: true
  };

  const discounts = getFeeDiscounts();
  discounts.push(discount);
  saveFeeDiscounts(discounts);

  return discount;
};

export const getFeeDiscounts = (): FeeDiscount[] => {
  if (typeof window === 'undefined') return [];
  const discounts = localStorage.getItem('fee_discounts');
  return discounts ? JSON.parse(discounts) : [];
};

export const saveFeeDiscounts = (discounts: FeeDiscount[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fee_discounts', JSON.stringify(discounts));
};

export const getActiveDiscountForStudent = (studentId: string): FeeDiscount | null => {
  const discounts = getFeeDiscounts();
  const today = new Date().toISOString().split('T')[0];
  
  return discounts.find(d => 
    d.studentId === studentId && 
    d.isActive && 
    d.validFrom <= today && 
    d.validTill >= today
  ) || null;
};
