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
  static async sendNotification(
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

  private static async sendEmailNotification(
    recipients: string[],
    template: NotificationTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    // Email sending logic with template rendering
  }

  private static async sendSMSNotification(
    recipients: string[],
    template: NotificationTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    // SMS sending logic
  }

  private static async sendPushNotification(
    recipients: string[],
    template: NotificationTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    // Push notification logic
  }

  private static async sendInAppNotification(
    recipients: string[],
    template: NotificationTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    // In-app notification logic
    const ws = WebSocketService.getInstance();
    recipients.forEach(userId => {
      ws.send('notification', {
        userId,
        title: this.renderTemplate(template.title, variables),
        content: this.renderTemplate(template.content, variables),
        type: 'info'
      });
    });
  }

  private static renderTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match);
  }
}
