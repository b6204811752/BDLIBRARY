// Real-time Communication System with WebSocket & Push Notifications
// File: lib/realtime-system.ts

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string; // Individual message
  channelId?: string;  // Channel/group message
  content: string;
  type: 'text' | 'image' | 'file' | 'announcement' | 'notification';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
  };
  createdAt: Date;
  readBy: { userId: string; readAt: Date }[];
  reactions: { userId: string; emoji: string }[];
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct' | 'announcement';
  members: string[]; // User IDs
  admins: string[];
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  content: string;
  variables: string[]; // Template variables like {{studentName}}
  channels: ('email' | 'sms' | 'push' | 'in-app')[];
  triggeredBy: string[]; // Events that trigger this notification
}

// WebSocket Service for Real-time Communication
export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventHandlers: Map<string, Function[]> = new Map();

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(userId: string, token: string): void {
    const wsUrl = `ws://localhost:3001/ws?userId=${userId}&token=${token}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected', {});
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data.payload);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect(userId, token);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private reconnect(userId: string, token: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(userId, token);
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    }
  }

  send(type: string, payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Push Notification Service
export class PushNotificationService {
  static async requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  static async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }

  static async subscribeToPush(registration: ServiceWorkerRegistration): Promise<PushSubscription | null> {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }
}

// Enhanced Notification System
export class NotificationService {
  private static instance: NotificationService;
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendNotification(
    recipients: string[],
    template: NotificationTemplate,
    variables: Record<string, string>,
    channels: ('email' | 'sms' | 'push' | 'in-app')[] = ['in-app']
  ): Promise<void> {
    // Send notifications through multiple channels
    const promises = channels.map(channel => {
      switch (channel) {
        case 'email':
          return this.sendEmailNotification(recipients, template, variables);
        case 'sms':
          return this.sendSMSNotification(recipients, template, variables);
        case 'push':
          return this.sendPushNotification(recipients, template, variables);
        case 'in-app':
          return this.sendInAppNotification(recipients, template, variables);
      }
    });

    await Promise.all(promises);
  }

  // Integration with existing email service
  private async sendEmailNotification(
    recipients: string[],
    template: NotificationTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    try {
      // Import email service dynamically to avoid circular dependencies
      const { EmailService } = await import('./email-service');
      const emailService = new EmailService({
        service: 'emailjs',
        publicKey: (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) || 'demo',
        serviceId: (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_EMAILJS_SERVICE_ID) || 'demo',
        templateId: (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) || 'demo'
      });
      
      for (const recipient of recipients) {
        await emailService.sendEmail({
          to: recipient,
          subject: this.renderTemplate(template.title, variables),
          templateId: template.name,
          variables
        });
      }
    } catch (error) {
      console.error('Email notification failed:', error);
    }
  }

  // Integration with existing SMS service
  private async sendSMSNotification(
    recipients: string[],
    template: NotificationTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    try {
      // Import SMS service dynamically to avoid circular dependencies
      const { SMSService } = await import('./sms-service');
      const smsService = new SMSService({
        provider: 'textbelt',
        apiKey: (typeof window !== 'undefined' && (window as any).TEXTBELT_API_KEY) || 'textbelt',
        isTestMode: true
      });
      
      for (const recipient of recipients) {
        await smsService.sendSMS({
          to: recipient,
          message: this.renderTemplate(template.content, variables)
        });
      }
    } catch (error) {
      console.error('SMS notification failed:', error);
    }
  }

  private async sendPushNotification(
    recipients: string[],
    template: NotificationTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    try {
      const title = this.renderTemplate(template.title, variables);
      const content = this.renderTemplate(template.content, variables);
      
      // Send browser push notification
      await PushNotificationService.sendNotification(title, {
        body: content,
        icon: '/icons/notification-icon.png',
        badge: '/icons/badge-icon.png',
        tag: template.id,
        requireInteraction: true,
        data: { templateId: template.id, variables }
      });
    } catch (error) {
      console.error('Push notification failed:', error);
    }
  }

  // Enhanced in-app notification with BD Library integration
  private async sendInAppNotification(
    recipients: string[],
    template: NotificationTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    try {
      const ws = WebSocketService.getInstance();
      const title = this.renderTemplate(template.title, variables);
      const content = this.renderTemplate(template.content, variables);
      
      // Send to WebSocket for real-time delivery
      recipients.forEach(userId => {
        ws.send('notification', {
          userId,
          title,
          content,
          type: template.name.includes('payment') ? 'payment' : 
                template.name.includes('test') ? 'test' :
                template.name.includes('announcement') ? 'announcement' : 'info',
          timestamp: new Date().toISOString(),
          templateId: template.id
        });
      });

      // Store in localStorage for offline access (BD Library integration)
      this.storeNotificationsOffline(recipients, {
        title,
        content,
        type: 'info',
        timestamp: new Date().toISOString(),
        templateId: template.id
      });
    } catch (error) {
      console.error('In-app notification failed:', error);
    }
  }

  // Integration with BD Library's localStorage system
  private storeNotificationsOffline(recipients: string[], notification: any): void {
    try {
      recipients.forEach(userId => {
        const key = `bdlib_notifications_${userId}`;
        const stored = localStorage.getItem(key);
        const notifications = stored ? JSON.parse(stored) : [];
        
        notifications.unshift({
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...notification,
          read: false
        });
        
        // Keep only last 50 notifications
        if (notifications.length > 50) {
          notifications.splice(50);
        }
        
        localStorage.setItem(key, JSON.stringify(notifications));
        
        // Trigger storage event for real-time updates across tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: JSON.stringify(notifications)
        }));
      });
    } catch (error) {
      console.error('Failed to store offline notifications:', error);
    }
  }

  private renderTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match);
  }

  // BD Library specific notification methods
  async notifyPaymentReceived(studentId: string, amount: number, receiptNo: string): Promise<void> {
    await this.sendNotification([studentId], {
      id: 'payment_received',
      name: 'payment_confirmation',
      title: 'Payment Confirmed',
      content: 'Your payment of ₹{{amount}} has been received. Receipt: {{receiptNo}}',
      variables: ['amount', 'receiptNo'],
      channels: ['in-app', 'sms'],
      triggeredBy: ['payment_received']
    }, {
      amount: amount.toLocaleString(),
      receiptNo
    }, ['in-app', 'sms']);
  }

  async notifyTestCompleted(studentId: string, testName: string, score: number): Promise<void> {
    await this.sendNotification([studentId], {
      id: 'test_completed',
      name: 'test_result',
      title: 'Test Result Available',
      content: 'You scored {{score}}% in {{testName}}. Great job!',
      variables: ['score', 'testName'],
      channels: ['in-app', 'push'],
      triggeredBy: ['test_completed']
    }, {
      score: score.toString(),
      testName
    }, ['in-app', 'push']);
  }

  async notifyFeesDue(studentId: string, amount: number, dueDate: string): Promise<void> {
    await this.sendNotification([studentId], {
      id: 'fees_due',
      name: 'fee_reminder',
      title: 'Fee Payment Reminder',
      content: 'Your fee payment of ₹{{amount}} is due on {{dueDate}}. Please pay to avoid late charges.',
      variables: ['amount', 'dueDate'],
      channels: ['in-app', 'email', 'sms'],
      triggeredBy: ['fee_due_reminder']
    }, {
      amount: amount.toLocaleString(),
      dueDate
    }, ['in-app', 'email', 'sms']);
  }

  async notifyNewMaterial(studentIds: string[], materialName: string, category: string): Promise<void> {
    await this.sendNotification(studentIds, {
      id: 'new_material',
      name: 'study_material',
      title: 'New Study Material Available',
      content: 'New {{category}} material "{{materialName}}" has been added to your library.',
      variables: ['category', 'materialName'],
      channels: ['in-app', 'push'],
      triggeredBy: ['material_added']
    }, {
      category,
      materialName
    }, ['in-app', 'push']);
  }

  async broadcastAnnouncement(message: string, title: string = 'Important Announcement'): Promise<void> {
    // Get all active students from localStorage
    const authData = localStorage.getItem('bdlib_auth_data');
    if (!authData) return;
    
    const { students } = JSON.parse(authData);
    const studentIds = students.map((s: any) => s.id);
    
    await this.sendNotification(studentIds, {
      id: 'announcement',
      name: 'general_announcement',
      title,
      content: message,
      variables: [],
      channels: ['in-app', 'push'],
      triggeredBy: ['admin_announcement']
    }, {}, ['in-app', 'push']);
  }
}
