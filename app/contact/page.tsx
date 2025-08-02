'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: 'ri-map-pin-line',
      title: 'Address',
      details: 'Goh,Aurangabad,Bihar , West Bengal 700012',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: 'ri-phone-line',
      title: 'Phone',
      details: '+91 9065541346',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: 'ri-mail-line',
      title: 'Email',
      details: 'info@bdlibrarygoh.com',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: 'ri-time-line',
      title: 'Office Hours',
      details: 'Monday - Saturday: 9:00 AM - 8:00 PM',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const branches = [
    {
      name: 'Main Branch',
      address: 'Goh,Aurangabad,Bihar ',
      phone: '+91 9065541346',
      timing: '6:00 AM - 10:00 PM'
    },
    {
      name: 'Salt Lake Branch',
      address: '456 Central Park, Salt Lake City, Kolkata',
      phone: '+91 9876543211',
      timing: '6:00 AM - 10:00 PM'
    },
    {
      name: 'New Town Branch',
      address: '789 Action Area, New Town, Kolkata',
      phone: '+91 9876543212',
      timing: '6:00 AM - 10:00 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-blue-700 text-white py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20office%20reception%20area%20with%20comfortable%20seating%2C%20professional%20environment%2C%20clean%20interior%20design%2C%20welcoming%20atmosphere%2C%20educational%20institute%20front%20desk%2C%20contemporary%20furniture%20and%20lighting&width=1200&height=600&seq=contact-hero&orientation=landscape')`
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Get in touch with us for admissions, course information, or any queries
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center">
                <div className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${info.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Thank you for your message! We&apos;ll get back to you soon.
                </div>
              )}
              
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Interest
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  >
                    <option value="">Select a course</option>
                    <option value="banking">Banking Exams</option>
                    <option value="ssc">SSC Exams</option>
                    <option value="railway">Railway Exams</option>
                    <option value="upsc">UPSC Civil Services</option>
                    <option value="state">State Government Jobs</option>
                    <option value="defense">Defense Exams</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={500}
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">{formData.message.length}/500 characters</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-96">
                <iframe
                  src="https://maps.google.com/maps?q=Kolkata,West%20Bengal&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="B.D Library GOH Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Branches
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit any of our convenient locations across Kolkata
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {branches.map((branch, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="ri-building-line text-xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{branch.name}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <i className="ri-map-pin-line text-gray-400 mt-1"></i>
                    <p className="text-gray-600">{branch.address}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <i className="ri-phone-line text-gray-400"></i>
                    <p className="text-gray-600">{branch.phone}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <i className="ri-time-line text-gray-400"></i>
                    <p className="text-gray-600">{branch.timing}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our courses and services
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'How do I enroll in a course?',
                answer: 'You can enroll by visiting our institute or contacting us through phone or email. Our admin will create your account and provide login credentials.'
              },
              {
                question: 'What are the course fees?',
                answer: 'Course fees vary based on the program and duration. Please contact us for detailed fee structure and payment options.'
              },
              {
                question: 'Do you provide study materials?',
                answer: 'Yes, we provide comprehensive study materials including books, notes, practice papers, and online resources for all courses.'
              },
              {
                question: 'Can I change my shift timing?',
                answer: 'Yes, you can request a shift change subject to availability. Contact the admin office for assistance.'
              },
              {
                question: 'Do you offer online classes?',
                answer: 'Currently, we focus on offline classroom teaching to ensure better interaction and learning outcomes.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
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
            Contact us today to learn more about our courses and admission process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+919065541346"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
            >
              Call Now
            </a>
            <a 
              href="mailto:info@bdlibrarygoh.com"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              Send Email
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}