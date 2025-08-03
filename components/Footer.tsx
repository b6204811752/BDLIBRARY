import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B.D</span>
              </div>
              <div>
                <span 
                  className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent" 
                  style={{ fontFamily: 'Pacifico, serif' }}
                >
                  B.D Library GOH
                </span>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1"></div>
              </div>
            </div>
            <p className="text-gray-300 text-base leading-7 max-w-sm mb-6">
              Leading government job preparation institute with expert faculty, comprehensive study materials, and proven success track record.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
                <i className="ri-facebook-fill text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg">
                <i className="ri-instagram-fill text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 shadow-lg">
                <i className="ri-twitter-fill text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
                <i className="ri-youtube-fill text-white"></i>
              </a>
              <a href="tel:+919065541346" className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
                <i className="ri-whatsapp-fill text-white"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-links-fill text-white text-sm"></i>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Quick Links</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer py-2">
                  <i className="ri-home-line text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer py-2">
                  <i className="ri-information-line text-green-400 group-hover:text-green-300 transition-colors"></i>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/courses" className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer py-2">
                  <i className="ri-book-line text-purple-400 group-hover:text-purple-300 transition-colors"></i>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Courses</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer py-2">
                  <i className="ri-phone-line text-orange-400 group-hover:text-orange-300 transition-colors"></i>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer py-2">
                  <i className="ri-login-circle-line text-indigo-400 group-hover:text-indigo-300 transition-colors"></i>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Student Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Exam Categories */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="ri-trophy-fill text-white text-sm"></i>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Exam Categories</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <div className="flex items-center space-x-2 text-gray-300 py-2 group">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="group-hover:text-white transition-colors duration-300">Banking Exams</span>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-2 text-gray-300 py-2 group">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="group-hover:text-white transition-colors duration-300">SSC Exams</span>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-2 text-gray-300 py-2 group">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="group-hover:text-white transition-colors duration-300">Railway Exams</span>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-2 text-gray-300 py-2 group">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="group-hover:text-white transition-colors duration-300">UPSC Civil Services</span>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-2 text-gray-300 py-2 group">
                  <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="group-hover:text-white transition-colors duration-300">State Government</span>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-2 text-gray-300 py-2 group">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="group-hover:text-white transition-colors duration-300">Defense Exams</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <i className="ri-phone-fill text-white text-sm"></i>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">Contact Info</h3>
            </div>
            <div className="space-y-4">
              <div className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <i className="ri-map-pin-fill text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300 leading-relaxed font-medium">
                    Goh, Aurangabad, Bihar 824203
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Main Campus Location</p>
                </div>
              </div>
              
              <a href="tel:+919065541346" className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <i className="ri-phone-fill text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">+91 9065541346</p>
                  <p className="text-gray-400 text-sm">Call us anytime</p>
                </div>
              </a>
              
              <a href="mailto:info@bdlibrarygoh.com" className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mt-1 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <i className="ri-mail-fill text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium break-all">info@bdlibrarygoh.com</p>
                  <p className="text-gray-400 text-sm">Send us an email</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                &copy; 2024 B.D Library GOH. All rights reserved.
              </p>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Online</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Support</a>
            </div>
          </div>
          
          {/* Success Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full px-4 py-2">
              <i className="ri-trophy-fill text-yellow-400"></i>
              <span className="text-sm font-medium text-gray-300">Trusted by 1000+ students for government exam preparation</span>
              <i className="ri-star-fill text-yellow-400"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}