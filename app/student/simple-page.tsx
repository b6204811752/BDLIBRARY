'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, initializeAuthData } from '@/lib/auth';

export default function SimpleStudentDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAndLoadData = async () => {
      try {
        console.log('🔄 Simple student dashboard initializing...');
        
        // Initialize auth data first
        await initializeAuthData();
        console.log('✅ Auth data initialized');
        
        const user = getCurrentUser();
        console.log('👤 Current user check:', user);
        
        if (!user) {
          console.log('❌ No user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        if (user.type !== 'student') {
          console.log('❌ User is not a student, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('✅ Valid student user found:', user.data.name);
        setCurrentUser(user.data);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error initializing dashboard:', error);
        setError(`Failed to initialize dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    initAndLoadData();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Initializing authentication and user data</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">👤</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Unable to load student data. Please try logging in again.</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {currentUser.name}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Student Info</h3>
              <p className="text-sm text-blue-700">Name: {currentUser.name}</p>
              <p className="text-sm text-blue-700">Email: {currentUser.email}</p>
              <p className="text-sm text-blue-700">Mobile: {currentUser.mobile}</p>
              <p className="text-sm text-blue-700">Course: {currentUser.course || 'N/A'}</p>
              <p className="text-sm text-blue-700">Job Category: {currentUser.jobCategory || 'N/A'}</p>
              <p className="text-sm text-blue-700">Shift: {currentUser.shift || 'N/A'}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Progress</h3>
              <p className="text-sm text-green-700">Tests: {currentUser.progress?.testsCompleted || 0}</p>
              <p className="text-sm text-green-700">Materials: {currentUser.progress?.materialsDownloaded || 0}</p>
              <p className="text-sm text-green-700">Points: {currentUser.progress?.totalPoints || 0}</p>
              <p className="text-sm text-green-700">Streak: {currentUser.progress?.currentStreak || 0}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Fees</h3>
              <p className="text-sm text-purple-700">Total: ₹{currentUser.fees?.totalAmount || 0}</p>
              <p className="text-sm text-purple-700">Paid: ₹{currentUser.fees?.paidAmount || 0}</p>
              <p className="text-sm text-purple-700">Due: ₹{currentUser.fees?.dueAmount || 0}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900">Library</h3>
              <p className="text-sm text-orange-700">Books: {currentUser.library?.booksIssued?.length || 0}</p>
              <p className="text-sm text-orange-700">Certificates: {currentUser.certificates?.length || 0}</p>
              <p className="text-sm text-orange-700">Notifications: {currentUser.notifications?.length || 0}</p>
            </div>
          </div>
          
          <div className="mt-8">
            <button 
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
