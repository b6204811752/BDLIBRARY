'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { jobCategories } from '@/lib/study-materials';

export default function Courses() {
  const shifts = [
    {
      name: 'Morning Shift',
      time: '6:00 AM - 12:00 PM',
      description: 'Perfect for early risers and working professionals',
      icon: 'ri-sun-line',
      color: 'bg-yellow-500',
      features: ['Early morning fresh mind', 'Less distractions', 'Better retention']
    },
    {
      name: 'Afternoon Shift',
      time: '12:00 PM - 6:00 PM',
      description: 'Ideal for students and flexible schedules',
      icon: 'ri-sun-fill',
      color: 'bg-orange-500',
      features: ['Moderate energy levels', 'Good for practice', 'Comfortable timing']
    },
    {
      name: 'Evening Shift',
      time: '6:00 PM - 10:00 PM',
      description: 'Great for working professionals',
      icon: 'ri-moon-line',
      color: 'bg-purple-500',
      features: ['After work hours', 'Relaxed atmosphere', 'Dedicated study time']
    }
  ];

  const features = [
    {
      icon: 'ri-book-open-line',
      title: 'Comprehensive Study Materials',
      description: 'Updated materials covering all topics with latest exam patterns'
    },
    {
      icon: 'ri-quiz-line',
      title: 'Mock Tests & Practice',
      description: 'Regular mock tests and practice sessions to assess progress'
    },
    {
      icon: 'ri-user-star-line',
      title: 'Expert Faculty',
      description: 'Experienced teachers with proven track records'
    },
    {
      icon: 'ri-bar-chart-line',
      title: 'Progress Tracking',
      description: 'Detailed analytics to monitor your learning journey'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Government%20exam%20preparation%20classroom%20with%20students%20taking%20tests%2C%20focused%20learning%20environment%2C%20exam%20materials%20and%20books%20on%20desks%2C%20professional%20academic%20setting%2C%20concentrated%20study%20atmosphere%2C%20modern%20educational%20facility&width=1200&height=600&seq=courses-hero&orientation=landscape')`
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Courses
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Comprehensive government job preparation courses designed for success
            </p>
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
              Choose from our wide range of government job preparation courses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <i className={`${
                      category.id === 'banking' ? 'ri-bank-line' :
                      category.id === 'ssc' ? 'ri-government-line' :
                      category.id === 'railway' ? 'ri-train-line' :
                      category.id === 'upsc' ? 'ri-medal-line' :
                      category.id === 'state' ? 'ri-building-line' :
                      'ri-shield-line'
                    } text-2xl text-blue-600`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Subjects Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.subjects.map((subject, subIndex) => (
                      <span key={subIndex} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Exam Pattern:</h4>
                  <p className="text-gray-600 text-sm">{category.examPattern}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Study Materials:</h4>
                  <p className="text-gray-600 text-sm">{category.materials.length} resources available</p>
                </div>
                
                <Link 
                  href="/login"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block whitespace-nowrap cursor-pointer"
                >
                  Enroll Now
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
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8">
                <div className={`w-16 h-16 ${shift.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <i className={`${shift.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{shift.name}</h3>
                <p className="text-blue-600 font-medium mb-4 text-center">{shift.time}</p>
                <p className="text-gray-600 mb-6 text-center">{shift.description}</p>
                
                <div className="space-y-2">
                  {shift.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <i className="ri-check-line text-green-500"></i>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Course Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for successful government job preparation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${feature.icon} text-2xl text-blue-600`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Course Fees
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Affordable pricing for quality education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">₹5,000</div>
              <p className="text-gray-600 mb-6">Per month</p>
              <ul className="space-y-2 text-left mb-8">
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Study materials</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Regular classes</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Monthly tests</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Basic doubt clearing</li>
              </ul>
              <Link 
                href="/login"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center border-2 border-blue-500 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">₹8,000</div>
              <p className="text-gray-600 mb-6">Per month</p>
              <ul className="space-y-2 text-left mb-8">
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>All basic features</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Weekly mock tests</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Personal mentoring</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Priority doubt clearing</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Performance analytics</li>
              </ul>
              <Link 
                href="/login"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Choose Premium
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">VIP Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">₹12,000</div>
              <p className="text-gray-600 mb-6">Per month</p>
              <ul className="space-y-2 text-left mb-8">
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>All premium features</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>One-on-one sessions</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Interview preparation</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>Career guidance</li>
                <li className="flex items-center"><i className="ri-check-line text-green-500 mr-2"></i>24/7 support</li>
              </ul>
              <Link 
                href="/login"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Go VIP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Preparation?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who achieved their dreams with our courses
          </p>
          <Link 
            href="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}