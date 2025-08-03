// Enhanced Notification System for BD Library

export interface Notification {
  id: string;
  recipientId: string;
  recipientType: 'student' | 'admin' | 'all';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'fee_reminder' | 'test_result' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  actionRequired?: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: Notification['type'];
  title: string;
  message: string;
  priority: Notification['priority'];
  isActive: boolean;
  triggers: Array<{
    event: string;
    condition?: string;
  }>;
}

export interface NotificationSettings {
  studentId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  feeReminders: boolean;
  testResults: boolean;
  announcements: boolean;
  scheduleUpdates: boolean;
  achievements: boolean;
}

// Default notification templates
export const defaultNotificationTemplates: NotificationTemplate[] = [
  {
    id: 'fee_due_reminder',
    name: 'Fee Due Reminder',
    type: 'fee_reminder',
    title: 'Fee Payment Due',
    message: 'Your monthly fee of ₹{amount} is due on {dueDate}. Please make the payment to avoid late charges.',
    priority: 'high',
    isActive: true,
    triggers: [
      { event: 'fee_due', condition: 'days_before_due <= 3' }
    ]
  },
  {
    id: 'fee_overdue',
    name: 'Fee Overdue',
    type: 'fee_reminder',
    title: 'Fee Payment Overdue',
    message: 'Your fee payment of ₹{amount} is overdue by {days} days. Please pay immediately to avoid suspension.',
    priority: 'urgent',
    isActive: true,
    triggers: [
      { event: 'fee_overdue', condition: 'days_overdue > 0' }
    ]
  },
  {
    id: 'test_result',
    name: 'Test Result Available',
    type: 'test_result',
    title: 'Test Result Published',
    message: 'Your result for {testName} is now available. You scored {percentage}% and ranked #{rank}.',
    priority: 'medium',
    isActive: true,
    triggers: [
      { event: 'test_completed' }
    ]
  },
  {
    id: 'achievement_unlocked',
    name: 'Achievement Unlocked',
    type: 'success',
    title: 'New Achievement Unlocked!',
    message: 'Congratulations! You have unlocked the "{achievementTitle}" achievement. Keep up the great work!',
    priority: 'medium',
    isActive: true,
    triggers: [
      { event: 'achievement_earned' }
    ]
  },
  {
    id: 'attendance_low',
    name: 'Low Attendance Warning',
    type: 'warning',
    title: 'Attendance Below Required',
    message: 'Your attendance is {percentage}% which is below the required 75%. Please improve your attendance.',
    priority: 'high',
    isActive: true,
    triggers: [
      { event: 'attendance_calculated', condition: 'attendance_percentage < 75' }
    ]
  },
  {
    id: 'new_material',
    name: 'New Study Material',
    type: 'info',
    title: 'New Study Material Available',
    message: 'New study material for {subject} has been uploaded. Check it out in your dashboard.',
    priority: 'medium',
    isActive: true,
    triggers: [
      { event: 'material_uploaded' }
    ]
  },
  {
    id: 'schedule_change',
    name: 'Schedule Change',
    type: 'warning',
    title: 'Schedule Update',
    message: 'There has been a change in your {shift} shift schedule. Please check the updated timetable.',
    priority: 'high',
    isActive: true,
    triggers: [
      { event: 'schedule_updated' }
    ]
  }
];

// Notification Functions
export const getNotifications = (recipientId?: string): Notification[] => {
  if (typeof window === 'undefined') return [];
  const notifications = localStorage.getItem('notifications');
  const allNotifications = notifications ? JSON.parse(notifications) : [];
  
  if (recipientId) {
    return allNotifications.filter((n: Notification) => 
      n.recipientId === recipientId || n.recipientType === 'all'
    );
  }
  
  return allNotifications;
};

export const saveNotification = (notification: Notification): void => {
  if (typeof window === 'undefined') return;
  const notifications = getNotifications();
  const existingIndex = notifications.findIndex(n => n.id === notification.id);
  
  if (existingIndex >= 0) {
    notifications[existingIndex] = notification;
  } else {
    notifications.push(notification);
  }
  
  localStorage.setItem('notifications', JSON.stringify(notifications));
};

export const createNotification = (
  recipientId: string,
  recipientType: 'student' | 'admin' | 'all',
  title: string,
  message: string,
  type: Notification['type'] = 'info',
  priority: Notification['priority'] = 'medium',
  actionUrl?: string,
  actionText?: string,
  expiresAt?: string,
  metadata?: any
): Notification => {
  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipientId,
    recipientType,
    title,
    message,
    type,
    priority,
    isRead: false,
    createdAt: new Date().toISOString(),
    actionRequired: !!(actionUrl && actionText),
    actionUrl,
    actionText,
    expiresAt,
    metadata
  };
  
  saveNotification(notification);
  return notification;
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification && !notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date().toISOString();
    saveNotification(notification);
  }
};

export const markAllNotificationsAsRead = (recipientId: string): void => {
  const notifications = getNotifications(recipientId);
  notifications.forEach(notification => {
    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
      saveNotification(notification);
    }
  });
};

export const deleteNotification = (notificationId: string): void => {
  if (typeof window === 'undefined') return;
  const notifications = getNotifications();
  const filteredNotifications = notifications.filter(n => n.id !== notificationId);
  localStorage.setItem('notifications', JSON.stringify(filteredNotifications));
};

export const getUnreadNotifications = (recipientId: string): Notification[] => {
  return getNotifications(recipientId).filter(n => !n.isRead);
};

export const getUnreadCount = (recipientId: string): number => {
  return getUnreadNotifications(recipientId).length;
};

export const cleanupExpiredNotifications = (): void => {
  const notifications = getNotifications();
  const now = new Date().toISOString();
  
  const activeNotifications = notifications.filter(n => 
    !n.expiresAt || n.expiresAt > now
  );
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('notifications', JSON.stringify(activeNotifications));
  }
};

// Automated notification triggers
export const triggerFeeReminderNotifications = (): void => {
  // This would typically be called by a background job
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const today = new Date();
  
  students.forEach((student: any) => {
    // Calculate due date (assuming monthly fees due on the same date each month)
    const joinDate = new Date(student.joinDate);
    const dueDate = new Date(today.getFullYear(), today.getMonth(), joinDate.getDate());
    
    // If due date has passed, set for next month
    if (dueDate < today) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Send reminder 3 days before due date
    if (daysUntilDue === 3) {
      createNotification(
        student.id,
        'student',
        'Fee Payment Reminder',
        `Your monthly fee of ₹${student.monthlyFees} is due in 3 days. Please make the payment to avoid late charges.`,
        'fee_reminder',
        'high',
        '/student?tab=payments',
        'Pay Now',
        undefined,
        { amount: student.monthlyFees, dueDate: dueDate.toISOString().split('T')[0] }
      );
    }
    
    // Send overdue notification
    if (daysUntilDue < 0) {
      const daysOverdue = Math.abs(daysUntilDue);
      createNotification(
        student.id,
        'student',
        'Fee Payment Overdue',
        `Your fee payment of ₹${student.monthlyFees} is overdue by ${daysOverdue} days. Please pay immediately.`,
        'fee_reminder',
        'urgent',
        '/student?tab=payments',
        'Pay Now',
        undefined,
        { amount: student.monthlyFees, daysOverdue }
      );
    }
  });
};

export const triggerTestResultNotifications = (studentId: string, testName: string, percentage: number, rank: number): void => {
  createNotification(
    studentId,
    'student',
    'Test Result Available',
    `Your result for ${testName} is now available. You scored ${percentage.toFixed(1)}% and ranked #${rank}.`,
    'test_result',
    'medium',
    '/student?tab=tests',
    'View Details',
    undefined,
    { testName, percentage, rank }
  );
};

export const triggerAchievementNotifications = (studentId: string, achievementTitle: string): void => {
  createNotification(
    studentId,
    'student',
    'New Achievement Unlocked!',
    `Congratulations! You have unlocked the "${achievementTitle}" achievement. Keep up the great work!`,
    'success',
    'medium',
    '/student?tab=achievements',
    'View Achievement',
    undefined,
    { achievementTitle }
  );
};

export const triggerAttendanceWarning = (studentId: string, attendancePercentage: number): void => {
  if (attendancePercentage < 75) {
    createNotification(
      studentId,
      'student',
      'Attendance Below Required',
      `Your attendance is ${attendancePercentage.toFixed(1)}% which is below the required 75%. Please improve your attendance.`,
      'warning',
      'high',
      '/student?tab=attendance',
      'View Attendance',
      undefined,
      { attendancePercentage }
    );
  }
};

export const triggerScheduleUpdateNotification = (shift: string, message: string): void => {
  // Get all students in the specified shift
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const shiftStudents = students.filter((student: any) => student.shift === shift);
  
  shiftStudents.forEach((student: any) => {
    createNotification(
      student.id,
      'student',
      'Schedule Update',
      `There has been a change in your ${shift} shift schedule. ${message}`,
      'warning',
      'high',
      '/student?tab=schedule',
      'View Schedule',
      undefined,
      { shift, message }
    );
  });
};

export const sendAnnouncementToAll = (title: string, message: string, targetAudience: 'all' | 'morning' | 'afternoon' | 'evening' = 'all'): void => {
  if (targetAudience === 'all') {
    createNotification(
      'all',
      'all',
      title,
      message,
      'announcement',
      'medium',
      undefined,
      undefined,
      undefined,
      { targetAudience }
    );
  } else {
    // Send to specific shift
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const targetStudents = students.filter((student: any) => student.shift === targetAudience);
    
    targetStudents.forEach((student: any) => {
      createNotification(
        student.id,
        'student',
        title,
        message,
        'announcement',
        'medium',
        undefined,
        undefined,
        undefined,
        { targetAudience, shift: targetAudience }
      );
    });
  }
};

// Notification Settings
export const getNotificationSettings = (studentId: string): NotificationSettings => {
  if (typeof window === 'undefined') {
    return getDefaultNotificationSettings(studentId);
  }
  
  const settings = localStorage.getItem(`notification_settings_${studentId}`);
  return settings ? JSON.parse(settings) : getDefaultNotificationSettings(studentId);
};

export const saveNotificationSettings = (settings: NotificationSettings): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`notification_settings_${settings.studentId}`, JSON.stringify(settings));
};

export const getDefaultNotificationSettings = (studentId: string): NotificationSettings => {
  return {
    studentId,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    feeReminders: true,
    testResults: true,
    announcements: true,
    scheduleUpdates: true,
    achievements: true
  };
};

// Notification Analytics
export const getNotificationAnalytics = (startDate?: string, endDate?: string) => {
  const notifications = getNotifications();
  
  const filteredNotifications = notifications.filter(n => {
    if (startDate && n.createdAt < startDate) return false;
    if (endDate && n.createdAt > endDate) return false;
    return true;
  });
  
  const totalNotifications = filteredNotifications.length;
  const readNotifications = filteredNotifications.filter(n => n.isRead).length;
  const unreadNotifications = totalNotifications - readNotifications;
  const readRate = totalNotifications > 0 ? (readNotifications / totalNotifications) * 100 : 0;
  
  const notificationsByType = filteredNotifications.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const notificationsByPriority = filteredNotifications.reduce((acc, n) => {
    acc[n.priority] = (acc[n.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalNotifications,
    readNotifications,
    unreadNotifications,
    readRate,
    notificationsByType,
    notificationsByPriority
  };
};

// Background job simulation (would be replaced with actual cron job)
export const runNotificationJobs = (): void => {
  cleanupExpiredNotifications();
  triggerFeeReminderNotifications();
  
  // Run this periodically (e.g., daily)
  if (typeof window !== 'undefined') {
    const lastRun = localStorage.getItem('last_notification_job_run');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastRun !== today) {
      triggerFeeReminderNotifications();
      localStorage.setItem('last_notification_job_run', today);
    }
  }
};
