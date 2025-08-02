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
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20educational%20institute%20building%20with%20students%20studying%20in%20bright%20classroom%20environment%2C%20professional%20academic%20setting%20with%20books%20and%20learning%20materials%2C%20inspirational%20education%20atmosphere%2C%20clean%20and%20organized%20study%20space%2C%20natural%20lighting%2C%20contemporary%20design&width=1200&height=600&seq=hero1&orientation=landscape')`
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span style={{ fontFamily: 'Pacifico, serif' }}>B.D Library GOH</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your gateway to success in government job examinations. Join thousands of students who achieved their dreams with our expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser.type ? (
                <Link 
                  href={currentUser.type === 'admin' ? '/admin' : '/student'}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Student Login
                  </Link>
                  <Link 
                    href="/courses"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Explore Courses
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Government Job Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive preparation for all major government job examinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer">
                <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                  <i className={`${category.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Link 
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap cursor-pointer"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shifts Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Flexible Study Shifts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the time that works best for your schedule
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shifts.map((shift, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 text-center">
                <div className={`w-16 h-16 ${shift.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <i className={`${shift.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{shift.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{shift.time}</p>
                <p className="text-gray-600">{shift.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Director's Message Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Director's Message
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 flex-shrink-0">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-6xl text-blue-600"></i>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="relative">
                    <i className="ri-double-quotes-l text-4xl text-blue-200 absolute -top-4 -left-2"></i>
                    <div className="pl-8">
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Welcome to B.D Library GOH, where dreams transform into reality through dedicated preparation and unwavering commitment. For over a decade, we have been the guiding light for thousands of aspirants who have successfully secured positions in various government sectors.
                      </p>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Our mission extends beyond mere education; we are committed to nurturing future leaders who will serve our nation with integrity and excellence. At B.D Library GOH, we believe that with the right guidance, comprehensive study materials, and consistent effort, every student can achieve their goals.
                      </p>
                      <p className="text-lg text-gray-700 leading-relaxed mb-8">
                        We take pride in our holistic approach to education, combining traditional teaching methods with modern technology to create an environment that fosters learning, growth, and success. Your success is our success, and we are here to support you every step of the way on your journey to securing your dream government job.
                      </p>
                    </div>
                    <i className="ri-double-quotes-r text-4xl text-blue-200 absolute -bottom-2 right-0"></i>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Vikash Kumar Yadav</h3>
                        <p className="text-blue-600 font-medium">Director, B.D Library GOH</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-500 mb-1">
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                          <i className="ri-star-fill"></i>
                        </div>
                        <p className="text-sm text-gray-500">Excellence in Education</p>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose B.D Library GOH?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make us the top choice for government job preparation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${feature.icon} text-2xl text-blue-600`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who achieved their government job dreams with us
          </p>
          <Link 
            href="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}