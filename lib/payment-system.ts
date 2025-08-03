// Comprehensive Payment & Financial Management System
// File: lib/payment-system.ts

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'razorpay' | 'stripe' | 'paytm' | 'phonepe' | 'gpay' | 'bank';
  isActive: boolean;
  config: {
    apiKey: string;
    secretKey: string;
    webhookSecret: string;
    merchantId?: string;
  };
  supportedMethods: PaymentMethod[];
  processingFee: number; // percentage
  settlementTime: number; // hours
}

export interface PaymentMethod {
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi' | 'cryptocurrency';
  subType?: string; // visa, mastercard, paytm, etc.
  isActive: boolean;
}

export interface Transaction {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  type: 'fee' | 'fine' | 'deposit' | 'refund' | 'scholarship';
  category: string; // tuition, library, exam, etc.
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  gatewayId: string;
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  metadata: {
    description: string;
    dueDate?: Date;
    lateFee?: number;
    discount?: number;
    installmentNumber?: number;
    totalInstallments?: number;
    originalTransactionId?: string;
    [key: string]: any; // Allow additional metadata fields
  };
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
  refundId?: string;
  invoiceId?: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'sent' | 'viewed' | 'overdue' | 'paid' | 'cancelled';
  paymentTerms: string;
  notes?: string;
  attachments?: string[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
  category: string;
}

export interface PaymentPlan {
  id: string;
  studentId: string;
  totalAmount: number;
  installments: Installment[];
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
  createdAt: Date;
  notes?: string;
}

export interface Installment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  paidAmount: number;
  paidDate?: Date;
  lateFee: number;
  transactionId?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  type: 'merit' | 'need' | 'sports' | 'special';
  amount: number;
  percentage?: number; // if percentage-based
  eligibilityCriteria: {
    minimumMarks?: number;
    familyIncome?: number;
    category?: string[];
    other?: string;
  };
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  maxRecipients: number;
  currentRecipients: number;
}

export interface FinancialReport {
  period: { start: Date; end: Date };
  summary: {
    totalRevenue: number;
    totalCollected: number;
    totalPending: number;
    totalOverdue: number;
    refundsIssued: number;
    scholarshipsAwarded: number;
  };
  byCategory: Record<string, number>;
  byPaymentMethod: Record<string, number>;
  monthlyTrends: { month: string; revenue: number; collected: number }[];
  defaultersList: StudentFinancialSummary[];
  topPayingStudents: StudentFinancialSummary[];
}

export interface StudentFinancialSummary {
  studentId: string;
  studentName: string;
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  lastPaymentDate?: Date;
  paymentHistory: Transaction[];
  upcomingDues: Installment[];
}

// Comprehensive Payment Service
export class PaymentService {
  // Payment Processing
  static async initiatePayment(
    studentId: string,
    amount: number,
    type: string,
    category: string,
    paymentMethod: string,
    gatewayId: string
  ): Promise<{ transactionId: string; paymentUrl?: string; qrCode?: string }> {
    // Create transaction record
    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      amount,
      currency: 'INR',
      type: type as any,
      category,
      status: 'pending',
      paymentMethod,
      gatewayId,
      metadata: {
        description: `${type} payment for ${category}`
      },
      createdAt: new Date()
    };

    await this.saveTransaction(transaction);

    // Process through payment gateway
    const gateway = await this.getPaymentGateway(gatewayId);
    const paymentResult = await this.processPaymentGateway(gateway, transaction);

    return {
      transactionId: transaction.id,
      paymentUrl: paymentResult.paymentUrl,
      qrCode: paymentResult.qrCode
    };
  }

  static async handlePaymentCallback(
    gatewayId: string,
    gatewayTransactionId: string,
    status: string,
    gatewayResponse: any
  ): Promise<void> {
    const transaction = await this.getTransactionByGatewayId(gatewayTransactionId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Update transaction status
    transaction.status = status === 'success' ? 'completed' : 'failed';
    transaction.gatewayTransactionId = gatewayTransactionId;
    transaction.gatewayResponse = gatewayResponse;
    transaction.completedAt = new Date();

    if (status === 'failed') {
      transaction.failureReason = gatewayResponse.error?.description || 'Payment failed';
    }

    await this.updateTransaction(transaction);

    // Process post-payment actions
    if (transaction.status === 'completed') {
      await this.handleSuccessfulPayment(transaction);
    }

    // Send notifications
    await this.sendPaymentNotification(transaction);
  }

  // Invoice Management
  static async generateInvoice(studentId: string, items: InvoiceItem[], dueDate: Date): Promise<Invoice> {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + taxAmount;

    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      studentId,
      invoiceNumber: await this.generateInvoiceNumber(),
      issueDate: new Date(),
      dueDate,
      items,
      subtotal,
      taxAmount,
      discountAmount: 0,
      totalAmount,
      paidAmount: 0,
      balanceAmount: totalAmount,
      status: 'sent',
      paymentTerms: '30 days'
    };

    await this.saveInvoice(invoice);
    await this.sendInvoiceToStudent(invoice);

    return invoice;
  }

  static async applyDiscount(invoiceId: string, discountAmount: number, reason: string): Promise<void> {
    const invoice = await this.getInvoice(invoiceId);
    
    invoice.discountAmount = discountAmount;
    invoice.totalAmount = invoice.subtotal + invoice.taxAmount - discountAmount;
    invoice.balanceAmount = invoice.totalAmount - invoice.paidAmount;

    await this.updateInvoice(invoice);
    await this.logDiscountApplication(invoiceId, discountAmount, reason);
  }

  // Payment Plans & EMI
  static async createPaymentPlan(
    studentId: string,
    totalAmount: number,
    numberOfInstallments: number,
    firstDueDate: Date
  ): Promise<PaymentPlan> {
    const installmentAmount = Math.ceil(totalAmount / numberOfInstallments);
    const installments: Installment[] = [];

    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = new Date(firstDueDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      installments.push({
        id: `inst_${Date.now()}_${i}`,
        installmentNumber: i + 1,
        amount: i === numberOfInstallments - 1 
          ? totalAmount - (installmentAmount * (numberOfInstallments - 1)) // Adjust last installment
          : installmentAmount,
        dueDate,
        status: 'pending',
        paidAmount: 0,
        lateFee: 0
      });
    }

    const paymentPlan: PaymentPlan = {
      id: `plan_${Date.now()}`,
      studentId,
      totalAmount,
      installments,
      status: 'active',
      createdAt: new Date()
    };

    await this.savePaymentPlan(paymentPlan);
    return paymentPlan;
  }

  // Scholarship Management
  static async applyScholarship(studentId: string, scholarshipId: string): Promise<{
    approved: boolean;
    amount: number;
    reason?: string;
  }> {
    const scholarship = await this.getScholarship(scholarshipId);
    const student = await this.getStudent(studentId);
    
    // Check eligibility
    const eligibility = await this.checkScholarshipEligibility(student, scholarship);
    
    if (!eligibility.eligible) {
      return { approved: false, amount: 0, reason: eligibility.reason };
    }

    // Calculate scholarship amount
    const amount = scholarship.percentage 
      ? (student.totalFees * scholarship.percentage / 100)
      : scholarship.amount;

    // Apply scholarship
    await this.applyScholarshipToStudent(studentId, scholarshipId, amount);
    
    return { approved: true, amount };
  }

  // Financial Analytics & Reporting
  static async generateFinancialReport(startDate: Date, endDate: Date): Promise<FinancialReport> {
    const transactions = await this.getTransactionsInRange(startDate, endDate);
    const summary = this.calculateFinancialSummary(transactions);
    const monthlyTrends = await this.calculateMonthlyTrends(startDate, endDate);
    const defaulters = await this.getDefaultersList();

    return {
      period: { start: startDate, end: endDate },
      summary,
      byCategory: this.groupByCategory(transactions),
      byPaymentMethod: this.groupByPaymentMethod(transactions),
      monthlyTrends,
      defaultersList: defaulters,
      topPayingStudents: await this.getTopPayingStudents(10)
    };
  }

  static async getStudentFinancialSummary(studentId: string): Promise<StudentFinancialSummary> {
    const transactions = await this.getStudentTransactions(studentId);
    const paymentPlan = await this.getStudentPaymentPlan(studentId);
    const upcomingDues = paymentPlan?.installments.filter(i => i.status === 'pending') || [];

    const totalFees = transactions
      .filter(t => t.type === 'fee')
      .reduce((sum, t) => sum + t.amount, 0);

    const paidAmount = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      studentId,
      studentName: await this.getStudentName(studentId),
      totalFees,
      paidAmount,
      pendingAmount: totalFees - paidAmount,
      overdueAmount: upcomingDues
        .filter(due => due.dueDate < new Date())
        .reduce((sum, due) => sum + due.amount, 0),
      lastPaymentDate: transactions
        .filter(t => t.status === 'completed')
        .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())[0]?.completedAt,
      paymentHistory: transactions,
      upcomingDues
    };
  }

  // Auto-collection & Reminders
  static async setupAutoCollection(): Promise<void> {
    // Set up cron jobs for automatic fee collection
    // Send payment reminders before due dates
    // Process late fees for overdue payments
    // Generate and send monthly statements
  }

  static async sendPaymentReminder(studentId: string, installmentId: string): Promise<void> {
    const student = await this.getStudent(studentId);
    const installment = await this.getInstallment(installmentId);
    
    // Send multi-channel reminder (email, SMS, push notification)
    await this.sendReminderNotification(student, installment);
  }

  // Refund Processing
  static async processRefund(transactionId: string, amount: number, reason: string): Promise<string> {
    const originalTransaction = await this.getTransaction(transactionId);
    
    // Create refund transaction
    const refundTransaction: Transaction = {
      id: `rfnd_${Date.now()}`,
      studentId: originalTransaction.studentId,
      amount: -amount, // Negative amount for refund
      currency: originalTransaction.currency,
      type: 'refund',
      category: originalTransaction.category,
      status: 'processing',
      paymentMethod: originalTransaction.paymentMethod,
      gatewayId: originalTransaction.gatewayId,
      metadata: {
        description: `Refund for ${originalTransaction.id}: ${reason}`,
        originalTransactionId: transactionId
      },
      createdAt: new Date()
    };

    await this.saveTransaction(refundTransaction);

    // Process refund through payment gateway
    const gateway = await this.getPaymentGateway(originalTransaction.gatewayId);
    await this.processRefundGateway(gateway, originalTransaction, amount);

    return refundTransaction.id;
  }

  // Private helper methods (implementation details)
  private static async saveTransaction(transaction: Transaction): Promise<void> {
    // Save to database
  }

  private static async getPaymentGateway(gatewayId: string): Promise<PaymentGateway> {
    // Fetch from database
    return {} as PaymentGateway;
  }

  private static async processPaymentGateway(gateway: PaymentGateway, transaction: Transaction): Promise<any> {
    // Gateway-specific implementation
    return { paymentUrl: '', qrCode: '' };
  }

  private static async getTransactionByGatewayId(gatewayTransactionId: string): Promise<Transaction | null> {
    return null;
  }

  private static async updateTransaction(transaction: Transaction): Promise<void> {
    // Update in database
  }

  private static async handleSuccessfulPayment(transaction: Transaction): Promise<void> {
    // Update student balance, payment plan, etc.
  }

  private static async sendPaymentNotification(transaction: Transaction): Promise<void> {
    // Send notification to student
  }

  private static async generateInvoiceNumber(): Promise<string> {
    return `INV-${Date.now()}`;
  }

  private static async saveInvoice(invoice: Invoice): Promise<void> {
    // Save to database
  }

  private static async sendInvoiceToStudent(invoice: Invoice): Promise<void> {
    // Send invoice via email
  }

  private static async getInvoice(invoiceId: string): Promise<Invoice> {
    return {} as Invoice;
  }

  private static async updateInvoice(invoice: Invoice): Promise<void> {
    // Update in database
  }

  private static async logDiscountApplication(invoiceId: string, amount: number, reason: string): Promise<void> {
    // Log discount for audit trail
  }

  private static async savePaymentPlan(plan: PaymentPlan): Promise<void> {
    // Save to database
  }

  private static async getScholarship(scholarshipId: string): Promise<Scholarship> {
    return {} as Scholarship;
  }

  private static async getStudent(studentId: string): Promise<any> {
    return {};
  }

  private static async checkScholarshipEligibility(student: any, scholarship: Scholarship): Promise<{
    eligible: boolean;
    reason?: string;
  }> {
    return { eligible: true };
  }

  private static async applyScholarshipToStudent(studentId: string, scholarshipId: string, amount: number): Promise<void> {
    // Apply scholarship
  }

  private static async getTransactionsInRange(start: Date, end: Date): Promise<Transaction[]> {
    return [];
  }

  private static calculateFinancialSummary(transactions: Transaction[]): any {
    return {};
  }

  private static async calculateMonthlyTrends(start: Date, end: Date): Promise<any[]> {
    return [];
  }

  private static async getDefaultersList(): Promise<StudentFinancialSummary[]> {
    return [];
  }

  private static groupByCategory(transactions: Transaction[]): Record<string, number> {
    return {};
  }

  private static groupByPaymentMethod(transactions: Transaction[]): Record<string, number> {
    return {};
  }

  private static async getTopPayingStudents(limit: number): Promise<StudentFinancialSummary[]> {
    return [];
  }

  private static async getStudentTransactions(studentId: string): Promise<Transaction[]> {
    return [];
  }

  private static async getStudentPaymentPlan(studentId: string): Promise<PaymentPlan | null> {
    return null;
  }

  private static async getStudentName(studentId: string): Promise<string> {
    return '';
  }

  private static async getInstallment(installmentId: string): Promise<Installment> {
    return {} as Installment;
  }

  private static async sendReminderNotification(student: any, installment: Installment): Promise<void> {
    // Send reminder
  }

  private static async getTransaction(transactionId: string): Promise<Transaction> {
    return {} as Transaction;
  }

  private static async processRefundGateway(gateway: PaymentGateway, transaction: Transaction, amount: number): Promise<void> {
    // Process refund
  }
}
