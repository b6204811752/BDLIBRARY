// Free SMS Service Integration
// File: lib/sms-service.ts
// Uses free SMS APIs and services

'use client';

export interface SMSConfig {
  provider: 'textbelt' | 'twilio_trial' | 'vonage_trial' | 'clicksend_trial';
  apiKey?: string;
  senderId?: string;
  isTestMode: boolean;
}

export interface SMSMessage {
  to: string;
  message: string;
  from?: string;
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export interface SMSQueue {
  id: string;
  message: SMSMessage;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  scheduledAt?: string;
  sentAt?: string;
  error?: string;
}

// Free SMS Service Provider
export class SMSService {
  private config: SMSConfig;
  private templates: Map<string, SMSTemplate> = new Map();
  private queue: SMSQueue[] = [];

  constructor(config: SMSConfig) {
    this.config = config;
    this.initializeTemplates();
    this.loadQueueFromStorage();
  }

  // Initialize default SMS templates
  private initializeTemplates(): void {
    const defaultTemplates: SMSTemplate[] = [
      {
        id: 'welcome',
        name: 'Welcome SMS',
        content: 'Welcome to BD Library! Your account has been created. Student ID: {{studentId}}. Login at {{loginUrl}}',
        variables: ['studentId', 'loginUrl']
      },
      {
        id: 'payment_reminder',
        name: 'Payment Reminder',
        content: 'Payment reminder: ৳{{amount}} due on {{dueDate}} for {{description}}. Pay at {{paymentUrl}}',
        variables: ['amount', 'dueDate', 'description', 'paymentUrl']
      },
      {
        id: 'test_result',
        name: 'Test Result',
        content: 'Your test "{{testName}}" result: {{score}}%. View details at {{resultUrl}}',
        variables: ['testName', 'score', 'resultUrl']
      },
      {
        id: 'class_reminder',
        name: 'Class Reminder',
        content: 'Reminder: {{className}} starts at {{time}} today. Join at {{classUrl}}',
        variables: ['className', 'time', 'classUrl']
      },
      {
        id: 'otp',
        name: 'OTP Verification',
        content: 'Your BD Library verification code is: {{otp}}. Valid for 10 minutes. Do not share this code.',
        variables: ['otp']
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Send SMS using TextBelt (Free: 1 SMS/day)
  async sendSMSWithTextBelt(message: SMSMessage): Promise<boolean> {
    if (this.config.isTestMode) {
      console.log('TEST MODE - SMS would be sent:', message);
      return true;
    }

    try {
      const response = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: message.to,
          message: message.message,
          key: this.config.apiKey || 'textbelt' // Use 'textbelt' for free quota
        })
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Failed to send SMS with TextBelt:', error);
      return false;
    }
  }

  // Send SMS using Twilio Trial (Free: $15 credit)
  async sendSMSWithTwilio(message: SMSMessage): Promise<boolean> {
    if (this.config.isTestMode) {
      console.log('TEST MODE - SMS would be sent via Twilio:', message);
      return true;
    }

    // Note: Twilio requires server-side implementation due to CORS
    // This is a placeholder for the client-side interface
    try {
      const response = await fetch('/api/sms/twilio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send SMS with Twilio:', error);
      return false;
    }
  }

  // Main send SMS method
  async sendSMS(message: SMSMessage, templateId?: string, variables?: Record<string, any>): Promise<boolean> {
    // Process template if provided
    if (templateId && this.templates.has(templateId)) {
      const template = this.templates.get(templateId)!;
      message.message = this.processTemplate(template.content, variables || {});
    }

    // Validate phone number
    if (!this.validatePhoneNumber(message.to)) {
      throw new Error('Invalid phone number format');
    }

    switch (this.config.provider) {
      case 'textbelt':
        return await this.sendSMSWithTextBelt(message);
      case 'twilio_trial':
        return await this.sendSMSWithTwilio(message);
      default:
        throw new Error(`Unsupported SMS provider: ${this.config.provider}`);
    }
  }

  // Queue SMS for later sending (useful for rate limiting)
  queueSMS(message: SMSMessage, templateId?: string, variables?: Record<string, any>, scheduledAt?: Date): void {
    // Process template if provided
    if (templateId && this.templates.has(templateId)) {
      const template = this.templates.get(templateId)!;
      message.message = this.processTemplate(template.content, variables || {});
    }

    const queueItem: SMSQueue = {
      id: this.generateId(),
      message,
      status: 'pending',
      attempts: 0,
      scheduledAt: scheduledAt?.toISOString()
    };

    this.queue.push(queueItem);
    this.saveQueueToStorage();
  }

  // Process SMS queue
  async processQueue(): Promise<{ sent: number; failed: number; errors: string[] }> {
    const results = { sent: 0, failed: 0, errors: [] as string[] };
    const now = new Date();

    for (let i = this.queue.length - 1; i >= 0; i--) {
      const item = this.queue[i];
      
      // Skip if scheduled for future
      if (item.scheduledAt && new Date(item.scheduledAt) > now) {
        continue;
      }

      // Skip if already sent or too many attempts
      if (item.status === 'sent' || item.attempts >= 3) {
        this.queue.splice(i, 1);
        continue;
      }

      try {
        item.attempts++;
        const success = await this.sendSMS(item.message);
        
        if (success) {
          item.status = 'sent';
          item.sentAt = now.toISOString();
          results.sent++;
          this.queue.splice(i, 1);
        } else {
          item.status = 'failed';
          item.error = 'Failed to send SMS';
          results.failed++;
        }
      } catch (error) {
        item.status = 'failed';
        item.error = String(error);
        results.failed++;
        results.errors.push(`SMS ${item.id}: ${error}`);
      }

      // Add delay between sends to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.saveQueueToStorage();
    return results;
  }

  // Bulk SMS with rate limiting
  async sendBulkSMS(messages: SMSMessage[], delayMs: number = 2000): Promise<{
    sent: number;
    failed: number;
    errors: string[];
  }> {
    const results = { sent: 0, failed: 0, errors: [] as string[] };

    for (let i = 0; i < messages.length; i++) {
      try {
        const success = await this.sendSMS(messages[i]);
        if (success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`Failed to send SMS ${i + 1}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Error sending SMS ${i + 1}: ${error}`);
      }

      // Add delay between messages
      if (i < messages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }

  // Template management
  addTemplate(template: SMSTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): SMSTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): SMSTemplate[] {
    return Array.from(this.templates.values());
  }

  // Utility methods
  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return processed;
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    // Basic validation for international phone numbers
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/[\s-()]/g, ''));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveQueueToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bdlib_sms_queue', JSON.stringify(this.queue));
    }
  }

  private loadQueueFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bdlib_sms_queue');
      if (stored) {
        try {
          this.queue = JSON.parse(stored);
        } catch (error) {
          console.warn('Failed to load SMS queue from storage:', error);
        }
      }
    }
  }

  // OTP Generation and Sending
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; otp?: string; message?: string }> {
    const otp = this.generateOTP();
    
    try {
      const success = await this.sendSMS(
        { to: phoneNumber, message: '' },
        'otp',
        { otp }
      );

      if (success) {
        // Store OTP for verification (in real app, store server-side)
        if (typeof window !== 'undefined') {
          const otpData = {
            phoneNumber,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
          };
          localStorage.setItem('bdlib_otp', JSON.stringify(otpData));
        }

        return {
          success: true,
          otp: this.config.isTestMode ? otp : undefined, // Only return OTP in test mode
          message: 'OTP sent successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to send OTP'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error sending OTP: ${error}`
      };
    }
  }

  verifyOTP(phoneNumber: string, enteredOTP: string): boolean {
    if (typeof window === 'undefined') return false;

    const stored = localStorage.getItem('bdlib_otp');
    if (!stored) return false;

    try {
      const otpData = JSON.parse(stored);
      const isValid = otpData.phoneNumber === phoneNumber &&
                     otpData.otp === enteredOTP &&
                     new Date() < new Date(otpData.expiresAt);

      if (isValid) {
        localStorage.removeItem('bdlib_otp'); // Remove used OTP
      }

      return isValid;
    } catch (error) {
      return false;
    }
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Statistics
  getSMSStatistics(): {
    totalSent: number;
    totalFailed: number;
    queueLength: number;
    templates: number;
  } {
    const sentCount = this.queue.filter(item => item.status === 'sent').length;
    const failedCount = this.queue.filter(item => item.status === 'failed').length;

    return {
      totalSent: sentCount,
      totalFailed: failedCount,
      queueLength: this.queue.filter(item => item.status === 'pending').length,
      templates: this.templates.size
    };
  }
}

// SMS service configurations
export const smsConfigs = {
  // TextBelt (Free: 1 SMS/day)
  textbelt: {
    provider: 'textbelt' as const,
    isTestMode: true, // Set to false for production
    apiKey: 'textbelt' // Use your API key for more quota
  },

  // Twilio Trial (Free: $15 credit)
  twilio_trial: {
    provider: 'twilio_trial' as const,
    isTestMode: true,
    apiKey: 'your-twilio-auth-token',
    senderId: 'your-twilio-phone-number'
  }
};

// Default SMS service instance
export const smsService = new SMSService(smsConfigs.textbelt);

// SMS notification helpers
export const SMSHelpers = {
  // Send welcome SMS to new students
  async sendWelcomeSMS(studentData: {
    phoneNumber: string;
    studentId: string;
  }): Promise<boolean> {
    return await smsService.sendSMS(
      { to: studentData.phoneNumber, message: '' },
      'welcome',
      {
        studentId: studentData.studentId,
        loginUrl: `${window.location.origin}/login`
      }
    );
  },

  // Send payment reminder SMS
  async sendPaymentReminderSMS(paymentData: {
    phoneNumber: string;
    amount: number;
    dueDate: string;
    description: string;
    paymentId: string;
  }): Promise<boolean> {
    return await smsService.sendSMS(
      { to: paymentData.phoneNumber, message: '' },
      'payment_reminder',
      {
        amount: paymentData.amount.toLocaleString(),
        dueDate: paymentData.dueDate,
        description: paymentData.description,
        paymentUrl: `${window.location.origin}/payments/${paymentData.paymentId}`
      }
    );
  },

  // Send test result SMS
  async sendTestResultSMS(resultData: {
    phoneNumber: string;
    testName: string;
    score: number;
    resultId: string;
  }): Promise<boolean> {
    return await smsService.sendSMS(
      { to: resultData.phoneNumber, message: '' },
      'test_result',
      {
        testName: resultData.testName,
        score: resultData.score,
        resultUrl: `${window.location.origin}/results/${resultData.resultId}`
      }
    );
  },

  // Send class reminder SMS
  async sendClassReminderSMS(classData: {
    phoneNumber: string;
    className: string;
    time: string;
    classUrl: string;
  }): Promise<boolean> {
    return await smsService.sendSMS(
      { to: classData.phoneNumber, message: '' },
      'class_reminder',
      classData
    );
  }
};
