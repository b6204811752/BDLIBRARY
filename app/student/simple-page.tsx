'use client';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Welcome!</h3>
              <p className="text-blue-600">Your student dashboard is loading...</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Quick Actions</h3>
              <ul className="text-green-600">
                <li>• View Study Materials</li>
                <li>• Take Practice Tests</li>
                <li>• Check Progress</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Recent Activity</h3>
              <p className="text-purple-600">No recent activity</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Study Materials</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Study materials will be available here.</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Practice Tests</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Practice tests will be available here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
