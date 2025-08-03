// Free Email Service Integration
// File: lib/email-service.ts
// Uses free email APIs (EmailJS, Formspree, etc.)

'use client';

export interface EmailConfig {
  service: 'emailjs' | 'formspree' | 'mailjs';
  publicKey: string;
  serviceId?: string;
  templateId?: string;
  endpoint?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface EmailData {
  to: string | string[];
  subject?: string; // Made optional since templates provide subjects
  html?: string;
  text?: string;
  templateId?: string;
  variables?: Record<string, any>;
  from?: string;
}

// Free Email Service Provider
export class EmailService {
  private config: EmailConfig;
  private templates: Map<string, EmailTemplate> = new Map();

  constructor(config: EmailConfig) {
    this.config = config;
    this.initializeTemplates();
  }

  // Initialize default email templates
  private initializeTemplates(): void {
    const defaultTemplates: EmailTemplate[] = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to BD Library - Your Learning Journey Begins!',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Welcome to BD Library!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your journey to excellence starts here</p>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #1e40af; margin-bottom: 20px;">Hello {{name}}!</h2>
              <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                Welcome to BD Library! We're excited to have you join our community of learners. 
                Your account has been successfully created and you can now access all our educational resources.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">Your Account Details:</h3>
                <p style="margin: 5px 0;"><strong>Email:</strong> {{email}}</p>
                <p style="margin: 5px 0;"><strong>Student ID:</strong> {{studentId}}</p>
                <p style="margin: 5px 0;"><strong>Registration Date:</strong> {{registrationDate}}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{loginUrl}}" style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Start Learning Now
                </a>
              </div>
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                <h3 style="color: #1e40af;">What's Next?</h3>
                <ul style="color: #374151; line-height: 1.6;">
                  <li>Explore our course catalog</li>
                  <li>Take practice tests to assess your knowledge</li>
                  <li>Join study groups and connect with peers</li>
                  <li>Track your progress with our analytics dashboard</li>
                </ul>
              </div>
            </div>
            <div style="background: #374151; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">
                If you have any questions, reply to this email or contact our support team.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">
                © 2024 BD Library. All rights reserved.
              </p>
            </div>
          </div>
        `,
        textContent: 'Welcome to BD Library! Hello {{name}}, your account has been created successfully.',
        variables: ['name', 'email', 'studentId', 'registrationDate', 'loginUrl']
      },
      {
        id: 'payment_reminder',
        name: 'Payment Reminder',
        subject: 'Payment Reminder - BD Library',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f59e0b; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Payment Reminder</h1>
            </div>
            <div style="padding: 30px; background: #fffbeb;">
              <h2 style="color: #92400e;">Dear {{name}},</h2>
              <p style="color: #374151; line-height: 1.6;">
                This is a friendly reminder that your payment of <strong>৳{{amount}}</strong> 
                for {{description}} is due on <strong>{{dueDate}}</strong>.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h3 style="margin-top: 0; color: #92400e;">Payment Details:</h3>
                <p><strong>Amount:</strong> ৳{{amount}}</p>
                <p><strong>Due Date:</strong> {{dueDate}}</p>
                <p><strong>Description:</strong> {{description}}</p>
                <p><strong>Payment ID:</strong> {{paymentId}}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{paymentUrl}}" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
                  Pay Now
                </a>
              </div>
            </div>
          </div>
        `,
        textContent: 'Payment reminder: ৳{{amount}} due on {{dueDate}} for {{description}}.',
        variables: ['name', 'amount', 'dueDate', 'description', 'paymentId', 'paymentUrl']
      },
      {
        id: 'test_results',
        name: 'Test Results',
        subject: 'Your Test Results - BD Library',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #10b981; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Test Results Available</h1>
            </div>
            <div style="padding: 30px; background: #ecfdf5;">
              <h2 style="color: #065f46;">Congratulations {{name}}!</h2>
              <p style="color: #374151; line-height: 1.6;">
                Your test results for <strong>{{testName}}</strong> are now available.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
                <h3 style="color: #065f46; margin-top: 0;">Your Score</h3>
                <div style="font-size: 48px; font-weight: bold; color: #10b981; margin: 20px 0;">
                  {{score}}%
                </div>
                <p style="color: #374151; margin: 0;">
                  {{correctAnswers}} out of {{totalQuestions}} correct
                </p>
              </div>
              <div style="margin: 20px 0;">
                <h3 style="color: #065f46;">Performance Summary:</h3>
                <ul style="color: #374151;">
                  <li>Time taken: {{timeTaken}} minutes</li>
                  <li>Difficulty level: {{difficulty}}</li>
                  <li>Rank: {{rank}} out of {{totalParticipants}}</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{resultsUrl}}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
                  View Detailed Results
                </a>
              </div>
            </div>
          </div>
        `,
        textContent: 'Test results for {{testName}}: {{score}}% ({{correctAnswers}}/{{totalQuestions}})',
        variables: ['name', 'testName', 'score', 'correctAnswers', 'totalQuestions', 'timeTaken', 'difficulty', 'rank', 'totalParticipants', 'resultsUrl']
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Send email using EmailJS (Free tier: 200 emails/month)
  async sendEmailWithEmailJS(emailData: EmailData): Promise<boolean> {
    try {
      // Load EmailJS script if not already loaded
      if (typeof window !== 'undefined' && !(window as any).emailjs) {
        await this.loadEmailJSScript();
      }

      const emailjs = (window as any).emailjs;
      
      const templateParams = {
        to_email: Array.isArray(emailData.to) ? emailData.to.join(',') : emailData.to,
        subject: emailData.subject,
        html_content: emailData.html || emailData.text,
        from_name: 'BD Library',
        ...emailData.variables
      };

      const response = await emailjs.send(
        this.config.serviceId,
        emailData.templateId || this.config.templateId,
        templateParams,
        this.config.publicKey
      );

      return response.status === 200;
    } catch (error) {
      console.error('Failed to send email with EmailJS:', error);
      return false;
    }
  }

  // Send email using Formspree (Free tier: 50 emails/month)
  async sendEmailWithFormspree(emailData: EmailData): Promise<boolean> {
    try {
      const response = await fetch(this.config.endpoint!, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: Array.isArray(emailData.to) ? emailData.to[0] : emailData.to,
          subject: emailData.subject,
          message: emailData.html || emailData.text,
          _replyto: emailData.from || 'noreply@bdlibrary.com'
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send email with Formspree:', error);
      return false;
    }
  }

  // Main send email method
  async sendEmail(emailData: EmailData): Promise<boolean> {
    // Process template if templateId is provided
    if (emailData.templateId && this.templates.has(emailData.templateId)) {
      const template = this.templates.get(emailData.templateId)!;
      emailData.subject = emailData.subject || this.processTemplate(template.subject, emailData.variables || {});
      emailData.html = emailData.html || this.processTemplate(template.htmlContent, emailData.variables || {});
      emailData.text = emailData.text || this.processTemplate(template.textContent, emailData.variables || {});
    }

    // Ensure subject is provided
    if (!emailData.subject) {
      emailData.subject = 'BD Library Notification';
    }

    switch (this.config.service) {
      case 'emailjs':
        return await this.sendEmailWithEmailJS(emailData);
      case 'formspree':
        return await this.sendEmailWithFormspree(emailData);
      default:
        throw new Error(`Unsupported email service: ${this.config.service}`);
    }
  }

  // Bulk email sending with rate limiting
  async sendBulkEmails(emails: EmailData[], delayMs: number = 1000): Promise<{
    sent: number;
    failed: number;
    errors: string[];
  }> {
    const results = { sent: 0, failed: 0, errors: [] as string[] };

    for (let i = 0; i < emails.length; i++) {
      try {
        const success = await this.sendEmail(emails[i]);
        if (success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`Failed to send email ${i + 1}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Error sending email ${i + 1}: ${error}`);
      }

      // Add delay between emails to respect rate limits
      if (i < emails.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }

  // Template management
  addTemplate(template: EmailTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): EmailTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values());
  }

  // Process template variables
  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return processed;
  }

  // Load EmailJS script dynamically
  private loadEmailJSScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('EmailJS can only be used in browser environment'));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.onload = () => {
        (window as any).emailjs.init(this.config.publicKey);
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load EmailJS script'));
      document.head.appendChild(script);
    });
  }

  // Email validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Email queue for offline support
  private emailQueue: EmailData[] = [];

  queueEmail(emailData: EmailData): void {
    this.emailQueue.push(emailData);
    this.saveQueueToStorage();
  }

  async processEmailQueue(): Promise<void> {
    if (this.emailQueue.length === 0) return;

    const results = await this.sendBulkEmails(this.emailQueue, 2000); // 2 second delay
    
    if (results.failed === 0) {
      this.emailQueue = [];
      this.saveQueueToStorage();
    } else {
      console.warn(`${results.failed} emails failed to send and remain in queue`);
    }
  }

  private saveQueueToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bdlib_email_queue', JSON.stringify(this.emailQueue));
    }
  }

  private loadQueueFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bdlib_email_queue');
      if (stored) {
        try {
          this.emailQueue = JSON.parse(stored);
        } catch (error) {
          console.warn('Failed to load email queue from storage:', error);
        }
      }
    }
  }
}

// Email service configurations for different providers
export const emailConfigs = {
  // EmailJS configuration (Free: 200 emails/month)
  emailjs: {
    service: 'emailjs' as const,
    publicKey: 'your-emailjs-public-key', // Replace with your actual key
    serviceId: 'your-service-id', // Replace with your actual service ID
    templateId: 'your-template-id' // Replace with your actual template ID
  },

  // Formspree configuration (Free: 50 emails/month)
  formspree: {
    service: 'formspree' as const,
    publicKey: 'your-formspree-key', // Replace with your actual key
    endpoint: 'https://formspree.io/f/your-form-id' // Replace with your actual endpoint
  }
};

// Default email service instance
export const emailService = new EmailService(emailConfigs.emailjs);

// Email notification helpers
export const EmailHelpers = {
  // Send welcome email to new students
  async sendWelcomeEmail(studentData: {
    name: string;
    email: string;
    studentId: string;
  }): Promise<boolean> {
    return await emailService.sendEmail({
      to: studentData.email,
      templateId: 'welcome',
      variables: {
        name: studentData.name,
        email: studentData.email,
        studentId: studentData.studentId,
        registrationDate: new Date().toLocaleDateString(),
        loginUrl: `${window.location.origin}/login`
      }
    });
  },

  // Send payment reminder
  async sendPaymentReminder(paymentData: {
    studentEmail: string;
    studentName: string;
    amount: number;
    dueDate: string;
    description: string;
    paymentId: string;
  }): Promise<boolean> {
    return await emailService.sendEmail({
      to: paymentData.studentEmail,
      templateId: 'payment_reminder',
      variables: {
        name: paymentData.studentName,
        amount: paymentData.amount.toLocaleString(),
        dueDate: paymentData.dueDate,
        description: paymentData.description,
        paymentId: paymentData.paymentId,
        paymentUrl: `${window.location.origin}/payments/${paymentData.paymentId}`
      }
    });
  },

  // Send test results
  async sendTestResults(resultData: {
    studentEmail: string;
    studentName: string;
    testName: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeTaken: number;
    difficulty: string;
    rank: number;
    totalParticipants: number;
    resultId: string;
  }): Promise<boolean> {
    return await emailService.sendEmail({
      to: resultData.studentEmail,
      templateId: 'test_results',
      variables: {
        name: resultData.studentName,
        testName: resultData.testName,
        score: resultData.score,
        correctAnswers: resultData.correctAnswers,
        totalQuestions: resultData.totalQuestions,
        timeTaken: resultData.timeTaken,
        difficulty: resultData.difficulty,
        rank: resultData.rank,
        totalParticipants: resultData.totalParticipants,
        resultsUrl: `${window.location.origin}/results/${resultData.resultId}`
      }
    });
  }
};
