// Real-time Integration Service for BD Library
// File: lib/realtime-integration.ts
// Connects real-time features with existing BD Library functionality

'use client';

import { WebSocketService, NotificationService, PushNotificationService } from './realtime-system';
import { FileDatabase } from './file-database';
import { SimpleAnalyticsService } from './simple-analytics';

export interface LiveStats {
  onlineUsers: number;
  activeTests: number;
  todayMaterials: number;
  newNotifications: number;
  pendingPayments: number;
}

export interface StudentActivity {
  userId: string;
  action: 'login' | 'test_start' | 'test_complete' | 'material_download' | 'payment_made';
  timestamp: string;
  details?: any;
}

// Enhanced Real-time Integration for BD Library
export class RealtimeIntegration {
  private static instance: RealtimeIntegration;
  private wsService: WebSocketService;
  private notificationService: NotificationService;
  private database: FileDatabase;
  private analytics: SimpleAnalyticsService;
  private eventHandlers: Map<string, Function[]> = new Map();
  private liveStats: LiveStats = {
    onlineUsers: 0,
    activeTests: 0,
    todayMaterials: 0,
    newNotifications: 0,
    pendingPayments: 0
  };

  private constructor() {
    this.wsService = WebSocketService.getInstance();
    this.notificationService = NotificationService.getInstance();
    this.database = new FileDatabase();
    this.analytics = new SimpleAnalyticsService();
    this.initializeRealtimeFeatures();
  }

  static getInstance(): RealtimeIntegration {
    if (!RealtimeIntegration.instance) {
      RealtimeIntegration.instance = new RealtimeIntegration();
    }
    return RealtimeIntegration.instance;
  }

  // Initialize real-time features for BD Library
  private initializeRealtimeFeatures(): void {
    // Setup WebSocket event handlers
    this.setupWebSocketHandlers();
    
    // Initialize push notifications
    this.initializePushNotifications();
    
    // Start live stats updates
    this.startLiveStatsUpdates();
    
    // Setup localStorage listeners for cross-tab communication
    this.setupStorageListeners();
  }

  private setupWebSocketHandlers(): void {
    this.wsService.on('user_connected', (data: any) => {
      this.liveStats.onlineUsers++;
      this.emit('stats_updated', this.liveStats);
      this.analytics.trackEvent('login', { userId: data.userId });
    });

    this.wsService.on('user_disconnected', (data: any) => {
      this.liveStats.onlineUsers = Math.max(0, this.liveStats.onlineUsers - 1);
      this.emit('stats_updated', this.liveStats);
      this.analytics.trackEvent('page_view', { userId: data.userId, page: 'logout' });
    });

    this.wsService.on('test_started', (data: any) => {
      this.liveStats.activeTests++;
      this.emit('stats_updated', this.liveStats);
      this.emit('test_activity', { type: 'started', ...data });
      this.analytics.trackEvent('test_attempt', data);
    });

    this.wsService.on('test_completed', (data: any) => {
      this.liveStats.activeTests = Math.max(0, this.liveStats.activeTests - 1);
      this.emit('stats_updated', this.liveStats);
      this.emit('test_activity', { type: 'completed', ...data });
      this.analytics.trackEvent('test_attempt', data);
      
      // Send test completion notification
      this.notificationService.notifyTestCompleted(
        data.userId,
        data.testName,
        data.score
      );
    });

    this.wsService.on('material_downloaded', (data: any) => {
      this.liveStats.todayMaterials++;
      this.emit('stats_updated', this.liveStats);
      this.emit('material_activity', data);
      this.analytics.trackEvent('download', data);
    });

    this.wsService.on('payment_made', (data: any) => {
      this.liveStats.pendingPayments = Math.max(0, this.liveStats.pendingPayments - 1);
      this.emit('stats_updated', this.liveStats);
      this.emit('payment_activity', data);
      this.analytics.trackEvent('payment', data);
      
      // Send payment confirmation notification
      this.notificationService.notifyPaymentReceived(
        data.userId,
        data.amount,
        data.receiptNo
      );
    });

    this.wsService.on('notification', (data: any) => {
      this.liveStats.newNotifications++;
      this.emit('stats_updated', this.liveStats);
      this.emit('new_notification', data);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        PushNotificationService.sendNotification(data.title, {
          body: data.content,
          icon: '/icons/notification-icon.png',
          tag: `notification_${data.userId}`
        });
      }
    });
  }

  private async initializePushNotifications(): Promise<void> {
    try {
      // Request notification permission
      const permission = await PushNotificationService.requestPermission();
      
      if (permission === 'granted') {
        // Register service worker for push notifications
        const registration = await PushNotificationService.registerServiceWorker();
        
        if (registration) {
          // Subscribe to push notifications
          const subscription = await PushNotificationService.subscribeToPush(registration);
          if (subscription) {
            this.analytics.trackEvent('login', {
              userId: 'system',
              feature: 'push_notifications_enabled'
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  private startLiveStatsUpdates(): void {
    // Update stats every 30 seconds
    setInterval(() => {
      this.updateLiveStats();
    }, 30000);

    // Initial stats update
    this.updateLiveStats();
  }

  private async updateLiveStats(): Promise<void> {
    try {
      // Update today's materials count
      const materialsStats = await this.database.getCollectionStats('study_materials');
      this.liveStats.todayMaterials = materialsStats.createdToday;

      // Update pending payments count
      const paymentsStats = await this.database.getCollectionStats('pending_payments');
      this.liveStats.pendingPayments = paymentsStats.totalRecords;

      // Update notifications count
      const notificationsStats = await this.database.getCollectionStats('notifications');
      this.liveStats.newNotifications = notificationsStats.createdToday;

      this.emit('stats_updated', this.liveStats);
    } catch (error) {
      console.error('Failed to update live stats:', error);
    }
  }

  private setupStorageListeners(): void {
    // Listen for localStorage changes across tabs
    window.addEventListener('storage', (event) => {
      if (event.key?.startsWith('bdlib_')) {
        this.handleStorageChange(event);
      }
    });
  }

  private handleStorageChange(event: StorageEvent): void {
    const key = event.key;
    
    if (key?.includes('notifications')) {
      // Notification updated in another tab
      this.emit('notifications_updated', {
        key,
        newValue: event.newValue
      });
    } else if (key?.includes('students')) {
      // Student data updated
      this.emit('students_updated', {
        key,
        newValue: event.newValue
      });
    } else if (key?.includes('payments')) {
      // Payment data updated
      this.emit('payments_updated', {
        key,
        newValue: event.newValue
      });
    }
  }

  // BD Library Integration Methods

  // Connect user to real-time system
  connectUser(userId: string, userType: 'student' | 'admin'): void {
    try {
      // Generate a simple token for demo purposes
      const token = btoa(`${userId}:${userType}:${Date.now()}`);
      
      // Connect to WebSocket (fallback to demo mode if WebSocket unavailable)
      if (typeof WebSocket !== 'undefined') {
        this.wsService.connect(userId, token);
      }
      
      // Track user session
      this.analytics.trackEvent('login', {
        userId,
        userType,
        timestamp: new Date().toISOString()
      });

      // Initialize user-specific features
      this.initializeUserFeatures(userId, userType);
    } catch (error) {
      console.error('Failed to connect user to real-time system:', error);
    }
  }

  private initializeUserFeatures(userId: string, userType: string): void {
    // Load user's notification history
    this.loadUserNotifications(userId);
    
    // Setup periodic sync for offline changes
    this.setupPeriodicSync(userId);
    
    // Initialize user activity tracking
    this.trackUserActivity(userId, 'login');
  }

  private loadUserNotifications(userId: string): void {
    try {
      const key = `bdlib_notifications_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const notifications = JSON.parse(stored);
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        this.liveStats.newNotifications = unreadCount;
        this.emit('notifications_loaded', { notifications, unreadCount });
      }
    } catch (error) {
      console.error('Failed to load user notifications:', error);
    }
  }

  private setupPeriodicSync(userId: string): void {
    // Sync offline changes every 60 seconds
    setInterval(() => {
      this.syncOfflineChanges(userId);
    }, 60000);
  }

  private async syncOfflineChanges(userId: string): Promise<void> {
    try {
      // Check for offline test completions
      const offlineTests = this.getOfflineTestCompletions(userId);
      for (const test of offlineTests) {
        this.broadcastTestCompletion(test);
      }

      // Check for offline payments
      const offlinePayments = this.getOfflinePayments(userId);
      for (const payment of offlinePayments) {
        this.broadcastPayment(payment);
      }
    } catch (error) {
      console.error('Failed to sync offline changes:', error);
    }
  }

  private getOfflineTestCompletions(userId: string): any[] {
    try {
      const key = `bdlib_offline_tests_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const tests = JSON.parse(stored);
        localStorage.removeItem(key); // Clear after reading
        return tests;
      }
      return [];
    } catch {
      return [];
    }
  }

  private getOfflinePayments(userId: string): any[] {
    try {
      const key = `bdlib_offline_payments_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const payments = JSON.parse(stored);
        localStorage.removeItem(key); // Clear after reading
        return payments;
      }
      return [];
    } catch {
      return [];
    }
  }

  // Public Methods for BD Library Components

  // Track student activity
  trackUserActivity(userId: string, action: string, details?: any): void {
    const activity: StudentActivity = {
      userId,
      action: action as any,
      timestamp: new Date().toISOString(),
      details
    };

    // Broadcast to WebSocket
    this.wsService.send('user_activity', activity);
    
    // Track in analytics with correct event types
    const eventType = this.mapActionToEventType(action);
    this.analytics.trackEvent(eventType, { userId, ...details });
    
    // Store locally for offline access
    this.storeActivityOffline(activity);
  }

  private mapActionToEventType(action: string): 'login' | 'page_view' | 'test_attempt' | 'payment' | 'download' {
    switch (action) {
      case 'login': return 'login';
      case 'test_start':
      case 'test_complete': return 'test_attempt';
      case 'payment_made': return 'payment';
      case 'material_download': return 'download';
      default: return 'page_view';
    }
  }

  private storeActivityOffline(activity: StudentActivity): void {
    try {
      const key = `bdlib_activities_${activity.userId}`;
      const stored = localStorage.getItem(key);
      const activities = stored ? JSON.parse(stored) : [];
      
      activities.unshift(activity);
      
      // Keep only last 100 activities
      if (activities.length > 100) {
        activities.splice(100);
      }
      
      localStorage.setItem(key, JSON.stringify(activities));
    } catch (error) {
      console.error('Failed to store activity offline:', error);
    }
  }

  // Broadcast test completion
  broadcastTestCompletion(testData: any): void {
    this.wsService.send('test_completed', testData);
  }

  // Broadcast payment
  broadcastPayment(paymentData: any): void {
    this.wsService.send('payment_made', paymentData);
  }

  // Broadcast material download
  broadcastMaterialDownload(materialData: any): void {
    this.wsService.send('material_downloaded', materialData);
  }

  // Send announcement to all users
  async sendAnnouncement(title: string, message: string): Promise<void> {
    await this.notificationService.broadcastAnnouncement(message, title);
    this.wsService.send('announcement', { title, message, timestamp: new Date().toISOString() });
  }

  // Get live stats
  getLiveStats(): LiveStats {
    return { ...this.liveStats };
  }

  // Event handling methods
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
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // Cleanup method
  disconnect(): void {
    this.wsService.disconnect();
    this.eventHandlers.clear();
  }
}

// Export singleton instance
export const realtimeIntegration = RealtimeIntegration.getInstance();

// Helper functions for BD Library components
export function useRealtimeStats() {
  const rt = RealtimeIntegration.getInstance();
  return rt.getLiveStats();
}

export function useRealtimeNotifications(userId: string) {
  const rt = RealtimeIntegration.getInstance();
  
  const markAsRead = (notificationId: string) => {
    try {
      const key = `bdlib_notifications_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const notifications = JSON.parse(stored);
        const notification = notifications.find((n: any) => n.id === notificationId);
        if (notification) {
          notification.read = true;
          localStorage.setItem(key, JSON.stringify(notifications));
          
          // Trigger storage event for cross-tab updates
          window.dispatchEvent(new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(notifications)
          }));
        }
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return { markAsRead };
}
