
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authenticateStudent, authenticateAdmin, setCurrentUser, initializeAuthData, debugAuthData } from '@/lib/auth';

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

  const handleTestAuth = async () => {
    console.log('=== DEBUG: Testing Authentication ===');
    try {
      await debugAuthData();
      
      // Test with demo student credentials
      const testEmail = 'demo@student.com';
      const testMobile = '1234567890';
      
      console.log(`Testing student login: ${testEmail} / ${testMobile}`);
      const student = await authenticateStudent(testEmail, testMobile);
      console.log('Authentication result:', student);
      
      if (student) {
        alert(`Authentication successful for: ${student.name}`);
      } else {
        alert('Authentication failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      alert(`Test error: ${error}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      <Header />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-md w-full">
          {/* Main login card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header section with gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-center relative">
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-6 h-6 bg-white/20 rounded-full animate-ping"></div>
              <div className="absolute top-6 right-8 w-4 h-4 bg-yellow-300/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-8 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
              
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <i className="ri-graduation-cap-fill text-4xl text-white"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                <p className="text-blue-100">Sign in to continue your learning journey</p>
              </div>
            </div>

            <div className="p-8">
              {/* Enhanced User Type Toggle */}
              <div className="relative bg-gray-50 rounded-2xl p-1 mb-8 shadow-inner">
                <div className={`absolute top-1 transition-all duration-300 ease-in-out bg-gradient-to-r ${
                  userType === 'student' 
                    ? 'from-blue-500 to-indigo-600 left-1' 
                    : 'from-purple-500 to-pink-600 right-1'
                } w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-xl shadow-lg`}></div>
                
                <div className="relative flex">
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    className={`flex-1 py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2 ${
                      userType === 'student'
                        ? 'text-white transform scale-105'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <i className="ri-user-line text-lg"></i>
                    <span>Student Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('admin')}
                    className={`flex-1 py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2 ${
                      userType === 'admin'
                        ? 'text-white transform scale-105'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <i className="ri-admin-line text-lg"></i>
                    <span>Admin Login</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <i className="ri-error-warning-line text-red-500 mr-3 text-lg"></i>
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {userType === 'student' ? (
                  <div className="space-y-6">
                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        <i className="ri-mail-line mr-2"></i>Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Enter your email address"
                          required
                          disabled={loading}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                          <i className="ri-mail-line text-lg"></i>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        <i className="ri-phone-line mr-2"></i>Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Enter your mobile number"
                          required
                          disabled={loading}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                          <i className="ri-phone-line text-lg"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="group">
                      <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-purple-600 transition-colors">
                        <i className="ri-user-line mr-2"></i>Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Enter admin username"
                          required
                          disabled={loading}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                          <i className="ri-user-line text-lg"></i>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-purple-600 transition-colors">
                        <i className="ri-lock-line mr-2"></i>Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Enter admin password"
                          required
                          disabled={loading}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                          <i className="ri-lock-line text-lg"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`relative w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl ${
                    userType === 'student'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500/50'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:ring-purple-500/50'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <i className={`${userType === 'student' ? 'ri-login-circle-line' : 'ri-admin-line'} text-lg`}></i>
                      <span>Sign In as {userType === 'student' ? 'Student' : 'Admin'}</span>
                    </div>
                  )}
                </button>
              </form>

              {/* Demo Credentials Section */}
              {userType === 'student' && (
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center">
                      <i className="ri-information-line text-blue-600 mr-2"></i>
                      Demo Student Credentials
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Use these credentials to test the system</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { email: 'rajesh@email.com', mobile: '9065541346', name: 'Rajesh Kumar' },
                      { email: 'priya@email.com', mobile: '9876543211', name: 'Priya Sharma' },
                      { email: 'amit@email.com', mobile: '9876543212', name: 'Amit Singh' },
                      { email: 'john@example.com', mobile: '9876543210', name: 'John Doe' },
                      { email: 'demo@student.com', mobile: '1234567890', name: 'Demo Student' }
                    ].map((cred, index) => (
                      <div key={index} className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-blue-200/50 hover:bg-white/90 transition-all duration-200 cursor-pointer group" 
                           onClick={() => setFormData({ ...formData, email: cred.email, mobile: cred.mobile })}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center text-sm font-semibold text-gray-800 mb-1">
                              <i className="ri-user-3-line text-blue-600 mr-2"></i>
                              {cred.name}
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div className="flex items-center">
                                <i className="ri-mail-line text-gray-400 mr-1"></i>
                                <span className="font-mono">{cred.email}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="ri-phone-line text-gray-400 mr-1"></i>
                                <span className="font-mono">{cred.mobile}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <i className="ri-arrow-right-circle-line text-xl"></i>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-100/50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 text-center font-medium">
                      <i className="ri-lightbulb-line mr-1"></i>
                      <strong>Note:</strong> Enter Email in first field and Mobile Number in second field
                    </p>
                  </div>
                </div>
              )}



              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    onClick={() => {/* Handle contact admin */}}
                  >
                    Contact admin for registration
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <i className="ri-shield-check-line text-green-500 mr-1"></i>
                <span>Secure Login</span>
              </div>
              <div className="flex items-center">
                <i className="ri-time-line text-blue-500 mr-1"></i>
                <span>24/7 Access</span>
              </div>
              <div className="flex items-center">
                <i className="ri-customer-service-line text-purple-500 mr-1"></i>
                <span>Support Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
