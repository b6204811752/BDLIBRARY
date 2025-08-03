
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authenticateStudent, authenticateAdmin, setCurrentUser, initializeAuthData } from '@/lib/auth';

export default function Login() {
  const [userType, setUserType] = useState<'student' | 'admin'>('student');
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  // Initialize auth data on component mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeAuthData();
        console.log('Auth data initialized successfully');
      } catch (error) {
        console.error('Failed to initialize auth data:', error);
      } finally {
        setInitializing(false);
      }
    };
    
    init();
  }, []);

  // Reset form when switching user type
  useEffect(() => {
    setFormData({
      email: '',
      mobile: '',
      username: '',
      password: ''
    });
    setError('');
  }, [userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (userType === 'student') {
        const email = formData.email.trim();
        const mobile = formData.mobile.trim();
        
        console.log('Student login attempt:', { email, mobile });
        
        if (!email || !mobile) {
          setError('Please enter both email and mobile number');
          setLoading(false);
          return;
        }
        
        const student = await authenticateStudent(email, mobile);
        console.log('Student authentication result:', student ? 'Success' : 'Failed');
        
        if (student) {
          console.log('Setting student user and redirecting...');
          setCurrentUser('student', student);
          setLoading(false);
          router.push('/student');
          return;
        } else {
          setError('Invalid email or mobile number. Please check the demo credentials below and ensure email is in the first field, mobile in the second field.');
          setLoading(false);
          return;
        }
      } else {
        const username = formData.username.trim();
        const password = formData.password.trim();
        
        console.log('Admin login attempt:', { username });
        
        if (!username || !password) {
          setError('Please enter both username and password');
          setLoading(false);
          return;
        }
        
        const admin = await authenticateAdmin(username, password);
        console.log('Admin authentication result:', admin ? 'Success' : 'Failed');
        
        if (admin) {
          console.log('Setting admin user and redirecting...');
          setCurrentUser('admin', admin);
          setLoading(false);
          router.push('/admin');
          return;
        } else {
          setError('Invalid admin credentials. Use admin/admin123 for demo.');
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  // Show loading during initialization
  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing authentication system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* User Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  userType === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Student Login
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  userType === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {userType === 'student' ? (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your mobile number"
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter admin username"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter admin password"
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {userType === 'student' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <span className="text-blue-600">Contact admin for registration</span>
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-800">Demo Student Credentials:</p>
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-blue-600">Email: rajesh@email.com | Mobile: 9065541346</p>
                    <p className="text-xs text-blue-600">Email: priya@email.com | Mobile: 9876543211</p>
                    <p className="text-xs text-blue-600">Email: amit@email.com | Mobile: 9876543212</p>
                    <p className="text-xs text-blue-600">Email: john@example.com | Mobile: 9876543210</p>
                    <p className="text-xs text-blue-600">Email: demo@student.com | Mobile: 1234567890</p>
                  </div>
                  <p className="text-xs text-blue-500 mt-2 font-medium">Note: Enter Email in first field and Mobile Number in second field</p>
                </div>
              </div>
            )}

            {userType === 'admin' && (
              <div className="mt-6 text-center">
                <div className="p-3 bg-green-50 rounded-md">
                  <p className="text-sm font-medium text-green-800">Demo Admin Credentials:</p>
                  <p className="text-xs text-green-600 mt-1">Username: admin | Password: admin123</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
