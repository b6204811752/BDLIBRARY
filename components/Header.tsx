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
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center min-w-0 flex-1 lg:flex-none">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">BD</span>
              </div>
              <span 
                className="text-lg sm:text-xl font-bold text-gray-900 truncate" 
                style={{ fontFamily: 'Pacifico, serif' }}
              >
                <span className="hidden sm:inline">B.D Library GOH</span>
                <span className="sm:hidden">BD Library</span>
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

          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentUser.type ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="hidden sm:inline text-xs sm:text-sm text-gray-600 max-w-32 truncate">
                  Welcome, {currentUser.data?.name || currentUser.data?.username}
                </span>
                <Link 
                  href={currentUser.type === 'admin' ? '/admin' : '/student'} 
                  className="bg-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer"
                >
                  <span className="sm:hidden">
                    <i className="ri-dashboard-line"></i>
                  </span>
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors text-xs sm:text-sm whitespace-nowrap cursor-pointer p-1"
                  title="Logout"
                >
                  <span className="sm:hidden">
                    <i className="ri-logout-circle-line text-lg"></i>
                  </span>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>

          <button 
            className="md:hidden p-2 -mr-2 flex items-center justify-center cursor-pointer rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <i className={`${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-700`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white shadow-lg">
            <nav className="px-3 py-4 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="ri-home-line mr-3 text-lg"></i>
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="ri-information-line mr-3 text-lg"></i>
                About
              </Link>
              <Link 
                href="/courses" 
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="ri-book-line mr-3 text-lg"></i>
                Courses
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="ri-phone-line mr-3 text-lg"></i>
                Contact
              </Link>
              
              {/* Mobile user actions */}
              {currentUser.type && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Welcome, {currentUser.data?.name || currentUser.data?.username}
                  </div>
                  <Link 
                    href={currentUser.type === 'admin' ? '/admin' : '/student'} 
                    className="block px-3 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="ri-dashboard-line mr-3 text-lg"></i>
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  >
                    <i className="ri-logout-circle-line mr-3 text-lg"></i>
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}