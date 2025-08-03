import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">B.D</span>
              </div>
              <span 
                className="text-lg sm:text-xl font-bold truncate" 
                style={{ fontFamily: 'Pacifico, serif' }}
              >
                B.D Library GOH
              </span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-6 max-w-sm">
              Leading government job preparation institute with expert faculty and comprehensive study materials.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors cursor-pointer block py-1">Home</Link></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors cursor-pointer block py-1">About Us</a></li>
              <li><a href="/courses" className="text-gray-400 hover:text-white transition-colors cursor-pointer block py-1">Courses</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors cursor-pointer block py-1">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Exam Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400 block py-1">Banking Exams</span></li>
              <li><span className="text-gray-400 block py-1">SSC Exams</span></li>
              <li><span className="text-gray-400 block py-1">Railway Exams</span></li>
              <li><span className="text-gray-400 block py-1">UPSC Civil Services</span></li>
              <li><span className="text-gray-400 block py-1">State Government</span></li>
              <li><span className="text-gray-400 block py-1">Defense Exams</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-3">
                <i className="ri-map-pin-line text-base text-blue-400 mt-0.5 flex-shrink-0"></i>
                <span className="leading-relaxed">Goh, Aurangabad, Bihar 824203</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-phone-line text-base text-blue-400 flex-shrink-0"></i>
                <a href="tel:+919065541346" className="hover:text-white transition-colors">+91 9065541346</a>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-mail-line text-base text-blue-400 flex-shrink-0"></i>
                <a href="mailto:info@bdlibrarygoh.com" className="hover:text-white transition-colors break-all">info@bdlibrarygoh.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 B.D Library GOH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}