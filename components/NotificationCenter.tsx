import React, { useState, useEffect } from 'react';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
  Notification
} from '@/lib/notifications';

interface NotificationCenterProps {
  currentUser: any;
}

export default function NotificationCenter({ currentUser }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'fee_reminder' | 'announcement'>('all');

  useEffect(() => {
    if (currentUser?.data?.id) {
      loadNotifications();
    }
  }, [currentUser, filter]);

  const loadNotifications = () => {
    if (!currentUser?.data?.id) return;
    
    const allNotifications = getNotifications(currentUser.data.id);
    let filteredNotifications = allNotifications;

    switch (filter) {
      case 'unread':
        filteredNotifications = allNotifications.filter(n => !n.isRead);
        break;
      case 'fee_reminder':
        filteredNotifications = allNotifications.filter(n => n.type === 'fee_reminder');
        break;
      case 'announcement':
        filteredNotifications = allNotifications.filter(n => n.type === 'announcement');
        break;
    }

    setNotifications(filteredNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    setUnreadCount(getUnreadCount(currentUser.data.id));
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    if (currentUser?.data?.id) {
      markAllNotificationsAsRead(currentUser.data.id);
      loadNotifications();
    }
  };

  const handleDelete = (notificationId: string) => {
    deleteNotification(notificationId);
    loadNotifications();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'fee_reminder': return '💰';
      case 'test_result': return '📊';
      case 'announcement': return '📢';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mt-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'unread', label: 'Unread' },
                { value: 'fee_reminder', label: 'Fees' },
                { value: 'announcement', label: 'News' }
              ].map((filterOption) => (
                <button
                  key={filterOption.value}
                  onClick={() => setFilter(filterOption.value as any)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === filterOption.value
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">🔔</div>
                <p className="text-gray-600">No notifications found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      if (!notification.isRead) {
                        handleMarkAsRead(notification.id);
                      }
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className={`text-sm font-medium text-gray-900 ${!notification.isRead ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              <div className="flex items-center space-x-2">
                                {notification.priority === 'urgent' && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Urgent
                                  </span>
                                )}
                                {notification.actionText && (
                                  <span className="text-xs text-blue-600 font-medium">
                                    {notification.actionText} →
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <button className="text-sm text-blue-600 hover:text-blue-800 w-full text-center">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile overlay */}
      {showDropdown && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden" onClick={() => setShowDropdown(false)} />
      )}
    </div>
  );
}
