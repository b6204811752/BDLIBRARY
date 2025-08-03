'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser, logout } from '@/lib/auth';

export default function Header() {
  const [currentUser, setCurrentUser] = useState<{ type: 'student' | 'admin' | null; data: any }>({ type: null, data: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user || { type: null, data: null });
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
      <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center min-w-0 flex-1 lg:flex-none">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">B.D</span>
              </div>
              <span 
                className="text-lg sm:text-xl font-bold text-gray-900 truncate" 
                style={{ fontFamily: 'Pacifico, serif' }}
              >
                <span className="hidden sm:inline">B.D Library GOH</span>
                <span className="sm:hidden">B.D Library</span>
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

          {/* Desktop user section */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser.type ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 max-w-40 truncate">
                  Welcome, {currentUser.data?.name || currentUser.data?.username}
                </span>
                <Link 
                  href={currentUser.type === 'admin' ? '/admin' : '/student'} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors text-sm whitespace-nowrap cursor-pointer"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <button 
            className="md:hidden p-2 ml-2 w-12 h-12 flex items-center justify-center cursor-pointer rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 flex-shrink-0 mobile-touch-target border-2 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md bg-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <i className={`${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl text-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-180 text-red-600' : 'text-blue-600'} drop-shadow-sm`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            {/* Menu drawer */}
            <div className="md:hidden absolute left-0 right-0 top-full bg-white border-t-4 border-blue-500 shadow-2xl z-50 mobile-menu-drawer">
              <nav className="px-4 py-5 space-y-3">
                <Link 
                  href="/" 
                  className="mobile-menu-item group flex items-center px-4 py-4 text-base font-medium text-gray-900 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all duration-300 cursor-pointer border-2 border-blue-200 hover:border-blue-500 shadow-md hover:shadow-xl transform hover:scale-[1.02] bg-gradient-to-r from-blue-50 to-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 group-hover:from-blue-600 group-hover:to-blue-800 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110 shadow-lg border-2 border-blue-300">
                    <i className="ri-home-fill text-2xl text-white group-hover:text-yellow-200 transition-colors duration-300 drop-shadow-lg"></i>
                  </div>
                  <span className="font-bold text-lg">Home</span>
                  <i className="ri-arrow-right-s-line ml-auto text-2xl text-blue-600 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 drop-shadow-lg"></i>
                </Link>
                <Link 
                  href="/about" 
                  className="mobile-menu-item group flex items-center px-4 py-4 text-base font-medium text-gray-900 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 rounded-xl transition-all duration-300 cursor-pointer border-2 border-green-200 hover:border-green-500 shadow-md hover:shadow-xl transform hover:scale-[1.02] bg-gradient-to-r from-green-50 to-green-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 group-hover:from-green-600 group-hover:to-green-800 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110 shadow-lg border-2 border-green-300">
                    <i className="ri-information-fill text-2xl text-white group-hover:text-yellow-200 transition-colors duration-300 drop-shadow-lg"></i>
                  </div>
                  <span className="font-bold text-lg">About</span>
                  <i className="ri-arrow-right-s-line ml-auto text-2xl text-green-600 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 drop-shadow-lg"></i>
                </Link>
                <Link 
                  href="/courses" 
                  className="mobile-menu-item group flex items-center px-4 py-4 text-base font-medium text-gray-900 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 rounded-xl transition-all duration-300 cursor-pointer border-2 border-purple-200 hover:border-purple-500 shadow-md hover:shadow-xl transform hover:scale-[1.02] bg-gradient-to-r from-purple-50 to-purple-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 group-hover:from-purple-600 group-hover:to-purple-800 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110 shadow-lg border-2 border-purple-300">
                    <i className="ri-book-fill text-2xl text-white group-hover:text-yellow-200 transition-colors duration-300 drop-shadow-lg"></i>
                  </div>
                  <span className="font-bold text-lg">Courses</span>
                  <i className="ri-arrow-right-s-line ml-auto text-2xl text-purple-600 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 drop-shadow-lg"></i>
                </Link>
                <Link 
                  href="/contact" 
                  className="mobile-menu-item group flex items-center px-4 py-4 text-base font-medium text-gray-900 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl transition-all duration-300 cursor-pointer border-2 border-orange-200 hover:border-orange-500 shadow-md hover:shadow-xl transform hover:scale-[1.02] bg-gradient-to-r from-orange-50 to-orange-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 group-hover:from-orange-600 group-hover:to-orange-800 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110 shadow-lg border-2 border-orange-300">
                    <i className="ri-phone-fill text-2xl text-white group-hover:text-yellow-200 transition-colors duration-300 drop-shadow-lg"></i>
                  </div>
                  <span className="font-bold text-lg">Contact</span>
                  <i className="ri-arrow-right-s-line ml-auto text-2xl text-orange-600 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 drop-shadow-lg"></i>
                </Link>
                
                {/* Mobile user actions */}
                <div className="border-t-2 border-gray-100 pt-4 mt-4">
                  {currentUser.type ? (
                    <>
                      <div className="px-4 py-4 text-sm font-medium text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl mb-4 flex items-center shadow-sm">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mr-3 shadow-md">
                          <i className="ri-user-fill text-xl text-white drop-shadow-lg"></i>
                        </div>
                        <span className="font-bold text-lg">Welcome, {currentUser.data?.name || currentUser.data?.username}</span>
                      </div>
                      <Link 
                        href={currentUser.type === 'admin' ? '/admin' : '/student'} 
                        className="mobile-menu-item group flex items-center justify-center px-4 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-300 cursor-pointer mb-4 shadow-lg border-2 border-blue-700 hover:shadow-xl transform hover:scale-[1.02]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-md border border-white/20">
                          <i className="ri-dashboard-fill text-2xl text-white drop-shadow-lg"></i>
                        </div>
                        <span className="text-lg">Go to Dashboard</span>
                        <i className="ri-arrow-right-s-line ml-auto text-2xl text-white group-hover:translate-x-2 transition-all duration-300 drop-shadow-lg"></i>
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="mobile-menu-item group flex items-center justify-center w-full px-4 py-4 text-base font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-300 cursor-pointer border-2 border-red-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-md border border-white/20">
                          <i className="ri-logout-circle-fill text-2xl text-white drop-shadow-lg"></i>
                        </div>
                        <span className="text-lg">Logout</span>
                        <i className="ri-arrow-right-s-line ml-auto text-2xl text-white group-hover:translate-x-2 transition-all duration-300 drop-shadow-lg"></i>
                      </button>
                    </>
                  ) : (
                    <Link 
                      href="/login" 
                      className="mobile-menu-item group flex items-center justify-center px-4 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-300 cursor-pointer shadow-lg border-2 border-blue-700 hover:shadow-xl transform hover:scale-[1.02]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-md border border-white/20">
                        <i className="ri-login-circle-fill text-2xl text-white drop-shadow-lg"></i>
                      </div>
                      <span className="text-lg">Login Now</span>
                      <i className="ri-arrow-right-s-line ml-auto text-2xl text-white group-hover:translate-x-2 transition-all duration-300 drop-shadow-lg"></i>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}