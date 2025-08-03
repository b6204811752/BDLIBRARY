// Real-time React Hooks for BD Library
// File: lib/hooks/useRealtime.ts
// React hooks to integrate real-time features with existing components

'use client';

import { realtimeIntegration, LiveStats } from '../realtime-integration';
import { getCurrentUser } from '../auth';

// Hook for live statistics (simplified for non-React usage)
export function useRealtimeStats() {
  return realtimeIntegration.getLiveStats();
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const getNotifications = () => {
    const user = getCurrentUser();
    if (!user || !user.data?.id) return { notifications: [], unreadCount: 0 };

    try {
      const userId = user.data.id;
      const key = `bdlib_notifications_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const notifications = JSON.parse(stored);
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        return { notifications, unreadCount };
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
    return { notifications: [], unreadCount: 0 };
  };

  const markAsRead = (notificationId: string) => {
    const user = getCurrentUser();
    if (!user || !user.data?.id) return;

    try {
      const userId = user.data.id;
      const key = `bdlib_notifications_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const notifs = JSON.parse(stored);
        const notification = notifs.find((n: any) => n.id === notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          localStorage.setItem(key, JSON.stringify(notifs));
          
          // Trigger storage event for cross-tab updates
          window.dispatchEvent(new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(notifs)
          }));
        }
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = () => {
    const user = getCurrentUser();
    if (!user || !user.data?.id) return;

    try {
      const userId = user.data.id;
      const key = `bdlib_notifications_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const notifs = JSON.parse(stored);
        notifs.forEach((n: any) => n.read = true);
        localStorage.setItem(key, JSON.stringify(notifs));
        
        // Trigger storage event for cross-tab updates
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: JSON.stringify(notifs)
        }));
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return {
    ...getNotifications(),
    markAsRead,
    markAllAsRead
  };
}

// Hook for real-time user activity tracking
export function useActivityTracker() {
  const trackActivity = (action: string, details?: any) => {
    const user = getCurrentUser();
    if (user && user.data?.id) {
      realtimeIntegration.trackUserActivity(user.data.id, action, details);
    }
  };

  const trackTestStart = (testId: string, testName: string) => {
    trackActivity('test_start', { testId, testName });
  };

  const trackTestComplete = (testId: string, testName: string, score: number, timeSpent: number) => {
    trackActivity('test_complete', { testId, testName, score, timeSpent });
    
    // Broadcast test completion for real-time updates
    const user = getCurrentUser();
    realtimeIntegration.broadcastTestCompletion({
      userId: user?.data?.id,
      testId,
      testName,
      score,
      timeSpent,
      timestamp: new Date().toISOString()
    });
  };

  const trackMaterialDownload = (materialId: string, materialName: string, category: string) => {
    trackActivity('material_download', { materialId, materialName, category });
    
    // Broadcast material download for real-time updates
    const user = getCurrentUser();
    realtimeIntegration.broadcastMaterialDownload({
      userId: user?.data?.id,
      materialId,
      materialName,
      category,
      timestamp: new Date().toISOString()
    });
  };

  const trackPayment = (amount: number, receiptNo: string, method: string) => {
    trackActivity('payment_made', { amount, receiptNo, method });
    
    // Broadcast payment for real-time updates
    const user = getCurrentUser();
    realtimeIntegration.broadcastPayment({
      userId: user?.data?.id,
      amount,
      receiptNo,
      method,
      timestamp: new Date().toISOString()
    });
  };

  const trackLogin = () => {
    trackActivity('login');
  };

  return {
    trackActivity,
    trackTestStart,
    trackTestComplete,
    trackMaterialDownload,
    trackPayment,
    trackLogin
  };
}

// Hook for real-time connection management
export function useRealtimeConnection() {
  const connectUser = () => {
    const user = getCurrentUser();
    if (user && user.data?.id) {
      // Connect to real-time system
      realtimeIntegration.connectUser(user.data.id, user.type || 'student');
      
      // Track initial login
      realtimeIntegration.trackUserActivity(user.data.id, 'login');
      
      return true;
    }
    return false;
  };

  const disconnectUser = () => {
    realtimeIntegration.disconnect();
  };

  return { connectUser, disconnectUser };
}

// Hook for admin real-time features
export function useAdminRealtime() {
  const getRecentActivity = () => {
    // Get activity from localStorage
    try {
      const testActivity = JSON.parse(localStorage.getItem('bdlib_recent_test_activity') || '[]');
      const paymentActivity = JSON.parse(localStorage.getItem('bdlib_recent_payment_activity') || '[]');
      const materialActivity = JSON.parse(localStorage.getItem('bdlib_recent_material_activity') || '[]');
      
      return {
        testActivity: testActivity.slice(0, 20),
        paymentActivity: paymentActivity.slice(0, 20),
        materialActivity: materialActivity.slice(0, 20)
      };
    } catch (error) {
      return {
        testActivity: [],
        paymentActivity: [],
        materialActivity: []
      };
    }
  };

  const sendAnnouncement = async (title: string, message: string) => {
    await realtimeIntegration.sendAnnouncement(title, message);
  };

  return {
    ...getRecentActivity(),
    sendAnnouncement
  };
}

// Hook for real-time dashboard data
export function useRealtimeDashboard() {
  const stats = useRealtimeStats();
  const { notifications, unreadCount } = useRealtimeNotifications();
  const { trackActivity } = useActivityTracker();

  // Enhanced stats with additional calculations
  const enhancedStats = {
    ...stats,
    hasNewNotifications: unreadCount > 0,
    isSystemActive: stats.onlineUsers > 0 || stats.activeTests > 0,
    todayActivity: stats.todayMaterials + stats.activeTests,
    systemHealth: stats.onlineUsers > 0 ? 'active' : 'idle'
  };

  return {
    stats: enhancedStats,
    notifications: notifications.slice(0, 5), // Show only recent 5
    unreadCount,
    trackActivity
  };
}
