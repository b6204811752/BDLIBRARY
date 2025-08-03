// Simple Analytics Dashboard with Charts
// File: lib/simple-analytics.ts
// Free chart library using Chart.js

'use client';

import { fileDb } from './file-database';

export interface AnalyticsData {
  id: string;
  type: 'page_view' | 'test_attempt' | 'login' | 'payment' | 'download';
  userId?: string;
  metadata: Record<string, any>;
  timestamp: string;
  sessionId: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalTests: number;
  testCompletions: number;
  averageScore: number;
  popularSubjects: Array<{ name: string; count: number }>;
  userGrowth: Array<{ date: string; count: number }>;
  testPerformance: Array<{ test: string; averageScore: number }>;
  dailyActivity: Array<{ date: string; views: number; tests: number }>;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: any;
  options: any;
}

// Simple Analytics Service
export class SimpleAnalyticsService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  // Event tracking
  async trackEvent(type: AnalyticsData['type'], metadata: Record<string, any> = {}): Promise<void> {
    const event: AnalyticsData = {
      id: this.generateId(),
      type,
      userId: this.getCurrentUserId(),
      metadata,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    await fileDb.create('analytics', event);
  }

  // Page view tracking
  async trackPageView(page: string, additionalData?: Record<string, any>): Promise<void> {
    await this.trackEvent('page_view', {
      page,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      ...additionalData
    });
  }

  // Test attempt tracking
  async trackTestAttempt(testId: string, testName: string, score?: number): Promise<void> {
    await this.trackEvent('test_attempt', {
      testId,
      testName,
      score,
      completed: score !== undefined
    });
  }

  // User login tracking
  async trackLogin(userId: string, userType: 'student' | 'admin'): Promise<void> {
    await this.trackEvent('login', {
      userId,
      userType,
      loginTime: new Date().toISOString()
    });
  }

  // Dashboard metrics
  async getDashboardMetrics(dateRange: { start: Date; end: Date }): Promise<DashboardMetrics> {
    const startDate = dateRange.start.toISOString();
    const endDate = dateRange.end.toISOString();

    // Get all analytics data for the date range
    const analyticsData = await fileDb.findMany<AnalyticsData>('analytics', {
      filters: {},
      sortBy: 'timestamp',
      sortOrder: 'desc'
    });

    const filteredData = analyticsData.filter(event => 
      event.timestamp >= startDate && event.timestamp <= endDate
    );

    // Get user data
    const users = await fileDb.findMany('users', {});
    const testAttempts = await fileDb.findMany('testAttempts', {});
    const testSets = await fileDb.findMany('testSets', {});

    // Calculate metrics
    const totalUsers = users.length;
    const activeUsers = new Set(
      filteredData.filter(e => e.userId).map(e => e.userId)
    ).size;

    const testEvents = filteredData.filter(e => e.type === 'test_attempt');
    const completedTests = testEvents.filter(e => e.metadata.completed);
    
    const totalTests = testSets.length;
    const testCompletions = completedTests.length;
    
    const averageScore = completedTests.length > 0 
      ? Math.round(completedTests.reduce((sum, e) => sum + (e.metadata.score || 0), 0) / completedTests.length)
      : 0;

    // Popular subjects
    const subjectCounts: Record<string, number> = {};
    testEvents.forEach(event => {
      const subject = event.metadata.subject || 'Unknown';
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    });

    const popularSubjects = Object.entries(subjectCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // User growth (daily new users over the period)
    const userGrowth = this.calculateDailyGrowth(users, dateRange);

    // Test performance by test name
    const testPerformance = this.calculateTestPerformance(completedTests);

    // Daily activity
    const dailyActivity = this.calculateDailyActivity(filteredData, dateRange);

    return {
      totalUsers,
      activeUsers,
      totalTests,
      testCompletions,
      averageScore,
      popularSubjects,
      userGrowth,
      testPerformance,
      dailyActivity
    };
  }

  // Chart generation
  generateLineChart(data: Array<{ x: string; y: number }>, title: string): ChartConfig {
    return {
      type: 'line',
      data: {
        labels: data.map(d => d.x),
        datasets: [{
          label: title,
          data: data.map(d => d.y),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  generateBarChart(data: Array<{ name: string; value: number }>, title: string): ChartConfig {
    return {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: title,
          data: data.map(d => d.value),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  generatePieChart(data: Array<{ name: string; value: number }>, title: string): ChartConfig {
    return {
      type: 'pie',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    };
  }

  // Report generation
  async generateReport(type: 'user_activity' | 'test_performance' | 'system_usage', dateRange: { start: Date; end: Date }): Promise<{
    title: string;
    summary: string;
    data: any[];
    charts: ChartConfig[];
    recommendations: string[];
  }> {
    const metrics = await this.getDashboardMetrics(dateRange);

    switch (type) {
      case 'user_activity':
        return {
          title: 'User Activity Report',
          summary: `Analysis of user engagement from ${dateRange.start.toDateString()} to ${dateRange.end.toDateString()}`,
          data: [
            { metric: 'Total Users', value: metrics.totalUsers },
            { metric: 'Active Users', value: metrics.activeUsers },
            { metric: 'Engagement Rate', value: `${Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}%` }
          ],
          charts: [
            this.generateLineChart(
              metrics.userGrowth.map(d => ({ x: d.date, y: d.count })),
              'User Growth Over Time'
            ),
            this.generateLineChart(
              metrics.dailyActivity.map(d => ({ x: d.date, y: d.views })),
              'Daily Page Views'
            )
          ],
          recommendations: this.generateUserActivityRecommendations(metrics)
        };

      case 'test_performance':
        return {
          title: 'Test Performance Report',
          summary: `Analysis of test performance and completion rates`,
          data: [
            { metric: 'Total Tests', value: metrics.totalTests },
            { metric: 'Test Completions', value: metrics.testCompletions },
            { metric: 'Average Score', value: `${metrics.averageScore}%` },
            { metric: 'Completion Rate', value: `${Math.round((metrics.testCompletions / Math.max(metrics.totalTests, 1)) * 100)}%` }
          ],
          charts: [
            this.generateBarChart(
              metrics.testPerformance.map(t => ({ name: t.test, value: t.averageScore })),
              'Average Scores by Test'
            ),
            this.generateBarChart(
              metrics.popularSubjects.map(s => ({ name: s.name, value: s.count })),
              'Popular Subjects'
            )
          ],
          recommendations: this.generateTestPerformanceRecommendations(metrics)
        };

      case 'system_usage':
        return {
          title: 'System Usage Report',
          summary: `Overview of system usage patterns and trends`,
          data: [
            { metric: 'Total Page Views', value: metrics.dailyActivity.reduce((sum, d) => sum + d.views, 0) },
            { metric: 'Daily Average', value: Math.round(metrics.dailyActivity.reduce((sum, d) => sum + d.views, 0) / metrics.dailyActivity.length) },
            { metric: 'Peak Day Views', value: Math.max(...metrics.dailyActivity.map(d => d.views)) }
          ],
          charts: [
            this.generateLineChart(
              metrics.dailyActivity.map(d => ({ x: d.date, y: d.views + d.tests })),
              'Total Daily Activity'
            ),
            this.generatePieChart(
              metrics.popularSubjects.map(s => ({ name: s.name, value: s.count })),
              'Subject Distribution'
            )
          ],
          recommendations: this.generateSystemUsageRecommendations(metrics)
        };

      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }

  // Export data
  async exportData(format: 'json' | 'csv', dateRange?: { start: Date; end: Date }): Promise<string> {
    let data: any[];

    if (dateRange) {
      const startDate = dateRange.start.toISOString();
      const endDate = dateRange.end.toISOString();
      data = await fileDb.findMany<AnalyticsData>('analytics', {});
      data = data.filter(event => 
        event.timestamp >= startDate && event.timestamp <= endDate
      );
    } else {
      data = await fileDb.findMany<AnalyticsData>('analytics', {});
    }

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      // Convert to CSV
      if (data.length === 0) return 'No data available';
      
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            JSON.stringify(row[header] || '')
          ).join(',')
        )
      ].join('\n');
      
      return csvContent;
    }
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateSessionId(): string {
    return 'session_' + this.generateId();
  }

  private getCurrentUserId(): string | undefined {
    // Get current user ID from localStorage or auth context
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('bdlib_auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          return parsed.user?.id;
        } catch (error) {
          return undefined;
        }
      }
    }
    return undefined;
  }

  private calculateDailyGrowth(users: any[], dateRange: { start: Date; end: Date }): Array<{ date: string; count: number }> {
    const growth: Array<{ date: string; count: number }> = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const usersOnDate = users.filter(user => 
        user.createdAt && new Date(user.createdAt).toISOString().split('T')[0] === dateStr
      ).length;
      
      growth.push({ date: dateStr, count: usersOnDate });
    }

    return growth;
  }

  private calculateTestPerformance(completedTests: AnalyticsData[]): Array<{ test: string; averageScore: number }> {
    const testScores: Record<string, number[]> = {};

    completedTests.forEach(event => {
      const testName = event.metadata.testName || 'Unknown Test';
      const score = event.metadata.score || 0;
      
      if (!testScores[testName]) {
        testScores[testName] = [];
      }
      testScores[testName].push(score);
    });

    return Object.entries(testScores)
      .map(([test, scores]) => ({
        test,
        averageScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 10);
  }

  private calculateDailyActivity(events: AnalyticsData[], dateRange: { start: Date; end: Date }): Array<{ date: string; views: number; tests: number }> {
    const activity: Array<{ date: string; views: number; tests: number }> = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => 
        event.timestamp.split('T')[0] === dateStr
      );
      
      const views = dayEvents.filter(e => e.type === 'page_view').length;
      const tests = dayEvents.filter(e => e.type === 'test_attempt').length;
      
      activity.push({ date: dateStr, views, tests });
    }

    return activity;
  }

  private generateUserActivityRecommendations(metrics: DashboardMetrics): string[] {
    const recommendations: string[] = [];
    const engagementRate = (metrics.activeUsers / metrics.totalUsers) * 100;

    if (engagementRate < 30) {
      recommendations.push('Low engagement detected. Consider sending re-engagement emails or notifications.');
    }

    if (metrics.userGrowth.length > 0) {
      const recentGrowth = metrics.userGrowth.slice(-7).reduce((sum, d) => sum + d.count, 0);
      if (recentGrowth === 0) {
        recommendations.push('No new user registrations in the past week. Review marketing strategies.');
      }
    }

    recommendations.push('Monitor daily activity patterns to optimize content delivery times.');

    return recommendations;
  }

  private generateTestPerformanceRecommendations(metrics: DashboardMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.averageScore < 60) {
      recommendations.push('Average test scores are low. Consider providing additional study materials or easier introductory tests.');
    }

    if (metrics.testCompletions < metrics.totalTests * 0.1) {
      recommendations.push('Low test completion rate. Review test difficulty and time limits.');
    }

    if (metrics.popularSubjects.length > 0) {
      const topSubject = metrics.popularSubjects[0];
      recommendations.push(`${topSubject.name} is the most popular subject. Consider creating more content in this area.`);
    }

    return recommendations;
  }

  private generateSystemUsageRecommendations(metrics: DashboardMetrics): string[] {
    const recommendations: string[] = [];
    
    const totalViews = metrics.dailyActivity.reduce((sum, d) => sum + d.views, 0);
    const avgViews = totalViews / metrics.dailyActivity.length;

    if (avgViews < 10) {
      recommendations.push('Low daily page views. Consider improving user experience and content quality.');
    }

    const peakDay = metrics.dailyActivity.reduce((max, d) => d.views > max.views ? d : max, metrics.dailyActivity[0]);
    recommendations.push(`Peak activity was on ${peakDay?.date}. Analyze what drove this engagement.`);

    return recommendations;
  }
}

// Chart.js Integration Helper
export class ChartRenderer {
  private static chartJSLoaded = false;

  static async loadChartJS(): Promise<void> {
    if (typeof window === 'undefined' || this.chartJSLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        this.chartJSLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Chart.js'));
      document.head.appendChild(script);
    });
  }

  static async renderChart(canvasId: string, config: ChartConfig): Promise<void> {
    await this.loadChartJS();
    
    if (typeof window === 'undefined') return;

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    // Destroy existing chart if it exists
    const existingChart = (window as any).Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    new (window as any).Chart(canvas, config);
  }
}

// Export default instance
export const analyticsService = new SimpleAnalyticsService();
