'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, initializeAuthData } from '@/lib/auth';

export default function SimpleStudentDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('Initializing auth data...');
        await initializeAuthData();
        
        console.log('Getting current user...');
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.type !== 'student') {
          console.log('No valid student user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        console.log('Student user found:', currentUser.data.name);
        setUser(currentUser.data);
        setLoading(false);
        
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
        <p>Please wait while we load your dashboard.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => router.push('/login')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Please log in to access the student dashboard.</p>
        <button 
          onClick={() => router.push('/login')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0' }}>Student Dashboard</h1>
        <p style={{ color: '#666', margin: 0 }}>Welcome back, {user.name}!</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057' }}>Profile Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <p><strong>Course:</strong> {user.course || 'Not specified'}</p>
          <p><strong>Status:</strong> {user.status}</p>
        </div>

        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057' }}>Progress Overview</h3>
          <p><strong>Materials Downloaded:</strong> {user.progress?.materialsDownloaded || 0}</p>
          <p><strong>Tests Completed:</strong> {user.progress?.testsCompleted || 0}</p>
          <p><strong>Total Points:</strong> {user.progress?.totalPoints || 0}</p>
          <p><strong>Current Streak:</strong> {user.progress?.currentStreak || 0}</p>
        </div>

        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              style={{
                padding: '10px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => alert('Practice Tests feature coming soon!')}
            >
              Take Practice Test
            </button>
            <button 
              style={{
                padding: '10px 15px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => alert('Study Materials feature coming soon!')}
            >
              View Study Materials
            </button>
            <button 
              style={{
                padding: '10px 15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => {
                sessionStorage.removeItem('bd_library_current_user');
                router.push('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        <p>This is a simplified dashboard. Full features will be available once authentication is working properly.</p>
      </div>
    </div>
  );
}
