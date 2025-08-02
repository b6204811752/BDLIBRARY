'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser, logout } from '@/lib/auth';

export default function Header() {
  const [currentUser, setCurrentUser] = useState<{ type: 'student' | 'admin' | null; data: any }>({ type: null, data: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser({ type: null, data: null });
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">BD</span>
              </div>
              <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Pacifico, serif' }}>
                B.D Library GOH
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              About
            </Link>
            <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Courses
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser.type ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {currentUser.data?.name || currentUser.data?.username}
                </span>
                <Link 
                  href={currentUser.type === 'admin' ? '/admin' : '/student'} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>

          <button 
            className="md:hidden w-6 h-6 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors py-2 cursor-pointer">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors py-2 cursor-pointer">
                About
              </Link>
              <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors py-2 cursor-pointer">
                Courses
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors py-2 cursor-pointer">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}