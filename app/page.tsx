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
    setCurrentUser(getCurrentUser());
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
      icon: 'ri-book-open-line',
      title: 'Comprehensive Study Materials',
      description: 'Access to thousands of study materials, notes, and practice papers for all government exams'
    },
    {
      icon: 'ri-time-line',
      title: 'Flexible Time Shifts',
      description: 'Choose from morning, afternoon, or evening shifts that fit your schedule'
    },
    {
      icon: 'ri-user-star-line',
      title: 'Expert Faculty',
      description: 'Learn from experienced teachers with proven track records in government job preparation'
    },
    {
      icon: 'ri-bar-chart-line',
      title: 'Progress Tracking',
      description: 'Monitor your learning progress with detailed analytics and performance insights'
    },
    {
      icon: 'ri-quiz-line',
      title: 'Mock Tests',
      description: 'Take unlimited practice tests and mock exams to evaluate your preparation level'
    },
    {
      icon: 'ri-trophy-line',
      title: 'Success Stories',
      description: 'Join thousands of successful candidates who cleared their exams with our guidance'
    },
    {
      icon: 'ri-wifi-line',
      title: 'High Speed WiFi',
      description: 'Stay connected with unlimited high-speed internet access for online research and study'
    },
    {
      icon: 'ri-temp-cold-line',
      title: 'Fully AC Conditioned',
      description: 'Comfortable study environment with centralized air conditioning throughout the facility'
    },
    {
      icon: 'ri-newspaper-line',
      title: 'Daily Newspapers',
      description: 'Stay updated with current affairs through complimentary daily newspapers and magazines'
    },
    {
      icon: 'ri-camera-line',
      title: 'CCTV Surveillance',
      description: 'Complete security with 24/7 CCTV monitoring for a safe and secure learning environment'
    },
    {
      icon: 'ri-computer-line',
      title: 'Online/Offline Test Series',
      description: 'Comprehensive test series available both online and offline to suit your preference'
    },
    {
      icon: 'ri-time-line',
      title: '24×7 Open Access',
      description: 'Round-the-clock access for both girls and boys with separate study areas and facilities'
    },
    {
      icon: 'ri-drop-line',
      title: 'RO Drinking Water',
      description: 'Pure and safe drinking water available through advanced RO filtration system'
    },
    {
      icon: 'ri-volume-mute-line',
      title: 'Silent Environment',
      description: 'Peaceful and distraction-free study atmosphere designed for maximum concentration'
    }
  ];

  const jobCategories = [
    {
      name: 'Banking Exams',
      description: 'SBI, IBPS, RRB Banking',
      icon: 'ri-bank-line',
      color: 'bg-blue-500'
    },
    {
      name: 'SSC Exams',
      description: 'SSC CGL, CHSL, MTS, GD',
      icon: 'ri-government-line',
      color: 'bg-green-500'
    },
    {
      name: 'Railway Exams',
      description: 'RRB NTPC, Group D, JE',
      icon: 'ri-train-line',
      color: 'bg-purple-500'
    },
    {
      name: 'UPSC Civil Services',
      description: 'IAS, IPS, IFS',
      icon: 'ri-medal-line',
      color: 'bg-orange-500'
    },
    {
      name: 'State Government',
      description: 'Various State Jobs',
      icon: 'ri-building-line',
      color: 'bg-red-500'
    },
    {
      name: 'Defense Exams',
      description: 'NDA, CDS, AFCAT',
      icon: 'ri-shield-line',
      color: 'bg-indigo-500'
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
    { number: '10,000+', label: 'Students Enrolled' },
    { number: '500+', label: 'Success Stories' },
    { number: '50+', label: 'Expert Faculty' },
    { number: '15+', label: 'Years Experience' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 sm:py-16 lg:py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20educational%20institute%20building%20with%20students%20studying%20in%20bright%20classroom%20environment%2C%20professional%20academic%20setting%20with%20books%20and%20learning%20materials%2C%20inspirational%20education%20atmosphere%2C%20clean%20and%20organized%20study%20space%2C%20natural%20lighting%2C%20contemporary%20design&width=1200&height=600&seq=hero1&orientation=landscape')`
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Welcome to{' '}
              <span 
                className="block sm:inline text-yellow-300" 
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
                  className="w-full sm:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center cursor-pointer min-w-0"
                >
                  <i className="ri-dashboard-line mr-2 sm:mr-0 sm:hidden"></i>
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="w-full sm:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center cursor-pointer"
                  >
                    <i className="ri-login-circle-line mr-2 sm:mr-0 sm:hidden"></i>
                    Student Login
                  </Link>
                  <Link 
                    href="/courses"
                    className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center cursor-pointer"
                  >
                    <i className="ri-book-line mr-2 sm:mr-0 sm:hidden"></i>
                    Explore Courses
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
              <div key={index} className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
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
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 cursor-pointer group">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${category.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform`}>
                  <i className={`${category.icon} text-lg sm:text-2xl text-white`}></i>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-tight">{category.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                <Link 
                  href="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base cursor-pointer group-hover:translate-x-1 transition-transform"
                >
                  Learn More 
                  <i className="ri-arrow-right-line ml-1"></i>
                </Link>
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
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors">
                  <i className={`${feature.icon} text-lg sm:text-2xl text-blue-600`}></i>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
            Join thousands of successful candidates who achieved their government job dreams with us
          </p>
          <Link 
            href="/login"
            className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base cursor-pointer"
          >
            <i className="ri-rocket-line mr-2 sm:mr-0 sm:hidden"></i>
            Get Started Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}