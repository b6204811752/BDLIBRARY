'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function About() {
  const features = [
    {
      icon: 'ri-award-line',
      title: '15+ Years of Excellence',
      description: 'Proven track record in government job preparation with thousands of successful candidates'
    },
    {
      icon: 'ri-team-line',
      title: 'Expert Faculty',
      description: 'Experienced teachers with deep knowledge of government exam patterns and requirements'
    },
    {
      icon: 'ri-book-open-line',
      title: 'Comprehensive Materials',
      description: 'Updated study materials, practice tests, and resources for all major government exams'
    },
    {
      icon: 'ri-time-line',
      title: 'Flexible Timings',
      description: 'Three shifts available to accommodate working professionals and students'
    }
  ];

  const faculty = [
    {
      name: 'Dr. Rajesh Kumar',
      designation: 'Mathematics & Quantitative Aptitude',
      experience: '12 Years',
      specialization: 'Banking & SSC Exams'
    },
    {
      name: 'Prof. Priya Sharma',
      designation: 'General Studies & Current Affairs',
      experience: '10 Years',
      specialization: 'UPSC & State Government'
    },
    {
      name: 'Mr. Amit Gupta',
      designation: 'Logical Reasoning',
      experience: '8 Years',
      specialization: 'All Government Exams'
    },
    {
      name: 'Ms. Anjali Singh',
      designation: 'English & Communication',
      experience: '9 Years',
      specialization: 'Banking & Railway'
    }
  ];

  const achievements = [
    { number: '10,000+', label: 'Students Trained' },
    { number: '500+', label: 'Success Stories' },
    { number: '95%', label: 'Success Rate' },
    { number: '50+', label: 'Expert Faculty' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Professional%20educational%20institute%20interior%20with%20modern%20classrooms%2C%20students%20studying%20at%20desks%2C%20bright%20lighting%2C%20academic%20atmosphere%2C%20books%20and%20learning%20materials%2C%20clean%20organized%20environment%2C%20contemporary%20educational%20facility%20design&width=1200&height=600&seq=about-hero&orientation=landscape')`
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About B.D Library GOH
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Empowering students to achieve their government job dreams through quality education and expert guidance
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At B.D Library GOH, we are committed to providing comprehensive and quality education to students aspiring for government jobs. Our mission is to bridge the gap between aspiration and achievement through structured learning, expert guidance, and continuous support.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe that every student deserves the opportunity to succeed, and we strive to create an environment that nurtures learning, builds confidence, and develops the skills necessary for success in competitive government examinations.
              </p>
              <Link 
                href="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Join Us Today
              </Link>
            </div>
            <div>
              <img 
                src="https://readdy.ai/api/search-image?query=Modern%20library%20interior%20with%20students%20studying%20at%20tables%2C%20bookshelves%20filled%20with%20educational%20materials%2C%20bright%20natural%20lighting%2C%20peaceful%20academic%20environment%2C%20contemporary%20furniture%2C%20organized%20study%20space%20for%20government%20exam%20preparation&width=600&height=400&seq=mission-img&orientation=landscape"
                alt="Students studying"
                className="rounded-lg shadow-lg object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose B.D Library GOH?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes us the preferred choice for government job preparation
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

      {/* Achievements Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Numbers that speak for our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{achievement.number}</div>
                <div className="text-gray-600 font-medium">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Faculty
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from experienced professionals who understand government exam requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="ri-user-line text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.designation}</p>
                <p className="text-sm text-gray-600 mb-1">Experience: {member.experience}</p>
                <p className="text-sm text-gray-600">{member.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://readdy.ai/api/search-image?query=Historical%20educational%20building%20exterior%20with%20traditional%20architecture%2C%20students%20walking%20on%20campus%2C%20established%20institution%20atmosphere%2C%20professional%20academic%20environment%2C%20tree-lined%20pathways%2C%20classic%20educational%20facility%20design&width=600&height=400&seq=history-img&orientation=landscape"
                alt="Institute building"
                className="rounded-lg shadow-lg object-cover w-full h-96"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Established in 2009, B.D Library GOH has been at the forefront of government job preparation in West Bengal. What started as a small coaching center has grown into one of the most trusted names in competitive exam preparation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-calendar-line text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">2009</h3>
                    <p className="text-gray-600">Founded with a vision to help students achieve their dreams</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-trophy-line text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">2015</h3>
                    <p className="text-gray-600">Achieved 1000+ successful candidates milestone</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="ri-award-line text-purple-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">2020</h3>
                    <p className="text-gray-600">Recognized as leading government job preparation institute</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Begin Your Success Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who achieved their government job dreams with B.D Library GOH
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