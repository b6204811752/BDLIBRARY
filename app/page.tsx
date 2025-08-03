'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{ type: 'student' | 'admin' | null; data: any }>({ type: null, data: null });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const user = getCurrentUser();
    setCurrentUser(user || { type: null, data: null });
  }, []);

  // Prevent hydration mismatch by not rendering user-specific content on server
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const features = [
    {
      icon: 'ri-book-open-fill',
      title: 'Comprehensive Study Materials',
      description: 'Access to thousands of study materials, notes, and practice papers for all government exams',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: 'ri-time-fill',
      title: 'Flexible Time Shifts',
      description: 'Choose from morning, afternoon, or evening shifts that fit your schedule',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: 'ri-user-star-fill',
      title: 'Expert Faculty',
      description: 'Learn from experienced teachers with proven track records in government job preparation',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'ri-line-chart-fill',
      title: 'Progress Tracking',
      description: 'Monitor your learning progress with detailed analytics and performance insights',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: 'ri-file-list-3-fill',
      title: 'Mock Tests',
      description: 'Take unlimited practice tests and mock exams to evaluate your preparation level',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: 'ri-trophy-fill',
      title: 'Success Stories',
      description: 'Join thousands of successful candidates who cleared their exams with our guidance',
      gradient: 'from-amber-500 to-yellow-600'
    },
    {
      icon: 'ri-wifi-fill',
      title: 'High Speed WiFi',
      description: 'Stay connected with unlimited high-speed internet access for online research and study',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: 'ri-temp-cold-fill',
      title: 'Fully AC Conditioned',
      description: 'Comfortable study environment with centralized air conditioning throughout the facility',
      gradient: 'from-sky-500 to-indigo-600'
    },
    {
      icon: 'ri-newspaper-fill',
      title: 'Daily Newspapers',
      description: 'Stay updated with current affairs through complimentary daily newspapers and magazines',
      gradient: 'from-gray-600 to-gray-800'
    },
    {
      icon: 'ri-shield-check-fill',
      title: 'CCTV Surveillance',
      description: 'Complete security with 24/7 CCTV monitoring for a safe and secure learning environment',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      icon: 'ri-computer-fill',
      title: 'Online/Offline Test Series',
      description: 'Comprehensive test series available both online and offline to suit your preference',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: 'ri-24-hours-fill',
      title: '24×7 Open Access',
      description: 'Round-the-clock access for both girls and boys with separate study areas and facilities',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      icon: 'ri-drop-fill',
      title: 'RO Drinking Water',
      description: 'Pure and safe drinking water available through advanced RO filtration system',
      gradient: 'from-blue-400 to-cyan-600'
    },
    {
      icon: 'ri-volume-mute-fill',
      title: 'Silent Environment',
      description: 'Peaceful and distraction-free study atmosphere designed for maximum concentration',
      gradient: 'from-slate-500 to-gray-600'
    }
  ];

  const jobCategories = [
    {
      name: 'Banking Exams',
      description: 'SBI, IBPS, RRB Banking',
      icon: 'ri-bank-fill',
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      borderColor: 'hover:border-blue-300'
    },
    {
      name: 'SSC Exams',
      description: 'SSC CGL, CHSL, MTS, GD',
      icon: 'ri-government-fill',
      color: 'bg-gradient-to-br from-green-500 to-green-700',
      borderColor: 'hover:border-green-300'
    },
    {
      name: 'Railway Exams',
      description: 'RRB NTPC, Group D, JE',
      icon: 'ri-train-fill',
      color: 'bg-gradient-to-br from-purple-500 to-purple-700',
      borderColor: 'hover:border-purple-300'
    },
    {
      name: 'UPSC Civil Services',
      description: 'IAS, IPS, IFS',
      icon: 'ri-medal-fill',
      color: 'bg-gradient-to-br from-orange-500 to-orange-700',
      borderColor: 'hover:border-orange-300'
    },
    {
      name: 'State Government',
      description: 'Various State Jobs',
      icon: 'ri-building-fill',
      color: 'bg-gradient-to-br from-red-500 to-red-700',
      borderColor: 'hover:border-red-300'
    },
    {
      name: 'Defense Exams',
      description: 'NDA, CDS, AFCAT',
      icon: 'ri-shield-fill',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
      borderColor: 'hover:border-indigo-300'
    }
  ];

  const shifts = [
    {
      name: 'Morning Shift',
      time: '6:00 AM - 12:00 PM',
      description: 'Perfect for early risers and working professionals',
      icon: 'ri-sun-line',
      color: 'bg-yellow-500'
    },
    {
      name: 'Afternoon Shift',
      time: '12:00 PM - 6:00 PM',
      description: 'Ideal for students and flexible schedules',
      icon: 'ri-sun-fill',
      color: 'bg-orange-500'
    },
    {
      name: 'Evening Shift',
      time: '6:00 PM - 10:00 PM',
      description: 'Great for working professionals and evening study',
      icon: 'ri-moon-line',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    { 
      number: '10,000+', 
      label: 'Students Enrolled',
      icon: 'ri-user-fill',
      gradient: 'from-blue-500 to-blue-700'
    },
    { 
      number: '500+', 
      label: 'Success Stories',
      icon: 'ri-trophy-fill',
      gradient: 'from-green-500 to-green-700'
    },
    { 
      number: '50+', 
      label: 'Expert Faculty',
      icon: 'ri-user-star-fill',
      gradient: 'from-purple-500 to-purple-700'
    },
    { 
      number: '15+', 
      label: 'Years Experience',
      icon: 'ri-time-fill',
      gradient: 'from-orange-500 to-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Floating Icons Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-icon absolute top-10 left-10 opacity-20">
            <i className="ri-book-open-line text-4xl text-white animate-bounce"></i>
          </div>
          <div className="floating-icon absolute top-20 right-20 opacity-20 animation-delay-1000">
            <i className="ri-graduation-cap-line text-3xl text-yellow-300 animate-pulse"></i>
          </div>
          <div className="floating-icon absolute bottom-20 left-20 opacity-20 animation-delay-2000">
            <i className="ri-trophy-line text-5xl text-white animate-bounce"></i>
          </div>
          <div className="floating-icon absolute bottom-10 right-10 opacity-20 animation-delay-1500">
            <i className="ri-star-line text-3xl text-yellow-300 animate-spin-slow"></i>
          </div>
        </div>
        
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20educational%20institute%20building%20with%20students%20studying%20in%20bright%20classroom%20environment%2C%20professional%20academic%20setting%20with%20books%20and%20learning%20materials%2C%20inspirational%20education%20atmosphere%2C%20clean%20and%20organized%20study%20space%2C%20natural%20lighting%2C%20contemporary%20design&width=1200&height=600&seq=hero1&orientation=landscape')`
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                  <i className="ri-graduation-cap-fill text-3xl sm:text-4xl text-yellow-300 animate-bounce"></i>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                  <i className="ri-star-fill text-sm text-white"></i>
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Welcome to{' '}
              <span 
                className="block sm:inline text-yellow-300 animate-gradient" 
                style={{ fontFamily: 'Pacifico, serif' }}
              >
                B.D Library GOH
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
              Your gateway to success in government job examinations. Join thousands of students who achieved their dreams with our expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
              {currentUser.type ? (
                <Link 
                  href={currentUser.type === 'admin' ? '/admin' : '/student'}
                  className="group w-full sm:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 text-center cursor-pointer min-w-0 flex items-center justify-center hover:shadow-lg hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 group-hover:rotate-180 transition-transform duration-500">
                      <i className="ri-dashboard-line text-sm text-white"></i>
                    </div>
                    <span>Go to Dashboard</span>
                    <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </Link>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="group w-full sm:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 text-center cursor-pointer flex items-center justify-center hover:shadow-lg hover:scale-105"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 group-hover:rotate-180 transition-transform duration-500">
                        <i className="ri-login-circle-line text-sm text-white"></i>
                      </div>
                      <span>Student Login</span>
                      <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </Link>
                  <Link 
                    href="/courses"
                    className="group w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 text-center cursor-pointer flex items-center justify-center hover:shadow-lg hover:scale-105"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-white/20 group-hover:bg-blue-600 rounded-full flex items-center justify-center mr-3 group-hover:rotate-180 transition-all duration-500">
                        <i className="ri-book-line text-sm text-white group-hover:text-white"></i>
                      </div>
                      <span>Explore Courses</span>
                      <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group text-center bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-110 hover:-translate-y-4 cursor-pointer border border-gray-100 hover:border-transparent relative overflow-hidden transform animate-slide-up-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                
                {/* Enhanced gradient background overlay with animation */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-15 transition-all duration-700 rounded-2xl animate-pulse`}></div>
                
                {/* Multiple sparkle effects with different colors */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute top-1 left-1 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-400"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-0 group-hover:opacity-75 transition-opacity duration-600"></div>
                
                {/* Shooting star effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 sm:w-18 sm:h-18 mx-auto mb-3 sm:mb-4 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-2xl relative overflow-hidden animate-float`}>
                    {/* Enhanced icon glow effect */}
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-white/40 transition-colors duration-500 rounded-2xl animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 rounded-2xl"></div>
                    <i className={`${stat.icon} text-xl sm:text-3xl text-white group-hover:scale-125 group-hover:animate-bounce transition-all duration-500 relative z-10`}></i>
                    
                    {/* Success indicator pulse */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse">
                      <i className="ri-check-line text-xs text-white"></i>
                    </div>
                  </div>
                  
                  {/* Multiple floating ring animations */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                    <div className="w-8 h-8 border-2 border-blue-300 rounded-full animate-spin"></div>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 animation-delay-300">
                    <div className="w-4 h-4 border border-purple-300 rounded-full animate-ping"></div>
                  </div>
                  
                  {/* Counter animation effect */}
                  <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 transform group-hover:scale-110 animate-number-count">
                    {stat.number}
                  </div>
                  
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-500 transform group-hover:translate-y-1">
                    {stat.label}
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}></div>
                  </div>
                </div>
                
                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Government Job Categories
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Comprehensive preparation for all major government job examinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {jobCategories.map((category, index) => (
              <div 
                key={index} 
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 p-4 sm:p-6 cursor-pointer transform hover:scale-110 hover:-translate-y-4 border border-gray-100 ${category.borderColor} relative overflow-hidden animate-slide-up-fade-in`}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                
                {/* Enhanced gradient background overlay with animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 group-hover:to-blue-50/80 transition-all duration-700 rounded-2xl animate-pulse"></div>
                
                {/* Enhanced floating particles with different colors and animations */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-400"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-0 group-hover:opacity-75 transition-opacity duration-600"></div>
                
                {/* Shooting star effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 sm:w-18 sm:h-18 ${category.color} rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-2xl relative overflow-hidden animate-float`}>
                    
                    {/* Enhanced icon glow effect */}
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-white/40 transition-colors duration-500 rounded-2xl animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 rounded-2xl"></div>
                    <i className={`${category.icon} text-xl sm:text-3xl text-white relative z-10 group-hover:scale-125 group-hover:animate-bounce transition-all duration-500`}></i>
                    
                    {/* Success indicator with animation */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse">
                      <i className="ri-check-line text-xs text-white"></i>
                    </div>
                    
                    {/* Floating achievement badge */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce">
                      <i className="ri-star-fill text-xs text-white"></i>
                    </div>
                  </div>
                  
                  {/* Multiple floating ring animations */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                    <div className="w-10 h-10 border-2 border-blue-300 rounded-full animate-spin"></div>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 animation-delay-300">
                    <div className="w-6 h-6 border border-purple-300 rounded-full animate-ping"></div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 transform group-hover:scale-105">{category.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-500 transform group-hover:translate-y-1">{category.description}</p>
                  
                  {/* Enhanced CTA with multiple animations */}
                  <Link 
                    href="/login"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base cursor-pointer group-hover:translate-x-2 transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  >
                    <span className="animate-fade-in">Enroll Now</span>
                    <i className="ri-arrow-right-s-line ml-1 group-hover:animate-bounce-horizontal transform group-hover:translate-x-1"></i>
                  </Link>
                  
                  {/* Progress bar animation */}
                  <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
                  </div>
                </div>
                
                {/* Corner accents with animation */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-fade-in"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-fade-in"></div>
                
                {/* Floating success indicators */}
                <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shifts Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Flexible Study Shifts
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Choose the time that works best for your schedule
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {shifts.map((shift, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 sm:p-8 text-center group">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${shift.color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-105 transition-transform`}>
                  <i className={`${shift.icon} text-xl sm:text-2xl text-white`}></i>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{shift.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{shift.time}</p>
                <p className="text-gray-600">{shift.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Director's Message Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Director's Message
              </h2>
              <div className="w-16 sm:w-24 h-1 bg-blue-600 mx-auto mb-6 sm:mb-8"></div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                <div className="lg:w-1/3 flex-shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-white rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-3xl sm:text-5xl lg:text-6xl text-blue-600"></i>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-2/3 text-center lg:text-left">
                  <div className="relative">
                    <i className="ri-double-quotes-l text-2xl sm:text-4xl text-blue-200 absolute -top-2 sm:-top-4 -left-0 lg:-left-2"></i>
                    <div className="pl-4 sm:pl-8">
                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                        Welcome to B.D Library GOH, where dreams transform into reality through dedicated preparation and unwavering commitment. For over a decade, we have been the guiding light for thousands of aspirants who have successfully secured positions in various government sectors.
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                        Our mission extends beyond mere education; we are committed to nurturing future leaders who will serve our nation with integrity and excellence. At B.D Library GOH, we believe that with the right guidance, comprehensive study materials, and consistent effort, every student can achieve their goals.
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
                        We take pride in our holistic approach to education, combining traditional teaching methods with modern technology to create an environment that fosters learning, growth, and success. Your success is our success, and we are here to support you every step of the way on your journey to securing your dream government job.
                      </p>
                    </div>
                    <i className="ri-double-quotes-r text-2xl sm:text-4xl text-blue-200 absolute -bottom-1 sm:-bottom-2 right-0"></i>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Vikash Kumar Yadav</h3>
                        <p className="text-blue-600 font-medium text-sm sm:text-base">Director, B.D Library GOH</p>
                      </div>
                      <div className="text-center sm:text-right">
                        <div className="flex items-center justify-center sm:justify-end text-yellow-500 mb-1">
                          <i className="ri-star-fill text-sm sm:text-base"></i>
                          <i className="ri-star-fill text-sm sm:text-base"></i>
                          <i className="ri-star-fill text-sm sm:text-base"></i>
                          <i className="ri-star-fill text-sm sm:text-base"></i>
                          <i className="ri-star-fill text-sm sm:text-base"></i>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">Excellence in Education</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose B.D Library GOH?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Discover the features that make us the top choice for government job preparation
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 p-4 sm:p-6 cursor-pointer hover:scale-110 hover:-translate-y-4 border border-gray-100 hover:border-transparent relative overflow-hidden transform animate-slide-up-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                
                {/* Enhanced animated gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-all duration-700 rounded-2xl animate-pulse`}></div>
                
                {/* Multiple floating sparkle effects */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-400"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-0 group-hover:opacity-75 transition-opacity duration-600"></div>
                
                {/* Shooting star effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div className="relative z-10 mb-3 sm:mb-4">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-2xl relative overflow-hidden animate-float`}>
                    {/* Enhanced icon glow effect */}
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-white/40 transition-colors duration-500 rounded-2xl animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 rounded-2xl"></div>
                    <i className={`${feature.icon} text-lg sm:text-2xl text-white relative z-10 group-hover:scale-125 group-hover:animate-bounce transition-all duration-500`}></i>
                  </div>
                  
                  {/* Multiple floating ring animations */}
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                    <div className="w-10 h-10 border-2 border-blue-300 rounded-full animate-spin"></div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 animation-delay-300">
                    <div className="w-6 h-6 border border-purple-300 rounded-full animate-ping"></div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500 transform group-hover:scale-105">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-500 transform group-hover:translate-y-1">{feature.description}</p>
                  
                  {/* Enhanced CTA with multiple animations */}
                  <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 group-hover:translate-x-2">
                    <span className="text-sm font-medium animate-fade-in">Explore feature</span>
                    <i className="ri-arrow-right-s-line ml-1 text-sm group-hover:animate-bounce-horizontal transform group-hover:translate-x-1"></i>
                  </div>
                  
                  {/* Progress bar animation */}
                  <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}></div>
                  </div>
                </div>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-600 relative overflow-hidden">
        {/* Animated Background Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 opacity-10 animate-float">
            <i className="ri-rocket-line text-6xl text-white"></i>
          </div>
          <div className="absolute top-20 right-20 opacity-10 animate-float-delayed">
            <i className="ri-star-line text-4xl text-yellow-300"></i>
          </div>
          <div className="absolute bottom-20 left-20 opacity-10 animate-float">
            <i className="ri-graduation-cap-line text-5xl text-white"></i>
          </div>
          <div className="absolute bottom-10 right-10 opacity-10 animate-float-delayed">
            <i className="ri-trophy-line text-4xl text-yellow-300"></i>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                <i className="ri-rocket-line text-2xl sm:text-3xl text-yellow-300 animate-bounce"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                <i className="ri-star-fill text-sm text-blue-600"></i>
              </div>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
            Join thousands of successful candidates who achieved their government job dreams with us
          </p>
          <Link 
            href="/login"
            className="group inline-flex items-center bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base cursor-pointer hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 group-hover:rotate-180 transition-transform duration-500">
                <i className="ri-rocket-line text-sm text-white group-hover:scale-125 transition-transform duration-300"></i>
              </div>
              <span>Get Started Today</span>
              <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
            </div>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}