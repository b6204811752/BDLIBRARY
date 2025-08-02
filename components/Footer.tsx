import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">BD</span>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: 'Pacifico, serif' }}>
                BD Library GOH
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-6">
              Leading government job preparation institute with expert faculty and comprehensive study materials.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Home</Link></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</a></li>
              <li><a href="/courses" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Courses</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Exam Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Banking Exams</span></li>
              <li><span className="text-gray-400">SSC Exams</span></li>
              <li><span className="text-gray-400">Railway Exams</span></li>
              <li><span className="text-gray-400">UPSC Civil Services</span></li>
              <li><span className="text-gray-400">State Government</span></li>
              <li><span className="text-gray-400">Defense Exams</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                <span>Goh,Aurangabad,Bihar 824203</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-phone-line w-4 h-4 flex items-center justify-center"></i>
                <span>+91 9065541346</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-mail-line w-4 h-4 flex items-center justify-center"></i>
                <span>info@bdlibrarygoh.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 BD Library GOH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}