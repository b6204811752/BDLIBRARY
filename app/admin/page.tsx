// --- Type/interface definitions ---
interface RealTimeStats {
  onlineUsers: number;

    </div>
  );
}

  const handleEditStudent = (student: Student) => {
    // ...existing code for handleEditStudent...
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {

    </div>
  );
}

        nextSession: ''
      });
      setShowCounselingModal(false);
      loadData();
    }
  };

  // ...existing code for other handlers...

  // ...existing code...

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Real-time monitoring and management system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Online: {realTimeStats.onlineUsers}</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center space-x-2">
                <i className="ri-test-tube-line text-blue-600"></i>
                <span className="text-sm text-gray-600">Active Tests: {realTimeStats.activeTests}</span>
              </div>
            </div>
  // ...existing code for other handlers...

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ...all tab/modal JSX and content here, as in previous return... */}
        <Footer />
      </div>
    </div>
  );
}
  };

  const handleAddExamResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (examData.studentId && examData.examName) {
      const totalMarks = parseInt(examData.totalMarks);
      const obtainedMarks = parseInt(examData.obtainedMarks);

      addExamResult(examData.studentId, {
        examName: examData.examName,
        date: new Date().toISOString().split('T')[0],
        totalMarks,
        obtainedMarks,
        percentage: Math.round((obtainedMarks / totalMarks) * 100),
        rank: Math.floor(Math.random() * 50) + 1,
        subjects: examData.subjects.map((sub: { name: string; marks: string; totalMarks: string }) => ({
          name: sub.name,
          marks: parseInt(sub.marks),
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-money-rupee-circle-line text-xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{financialAnalytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">This month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="ri-money-rupee-circle-line text-xl text-red-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Dues</p>
                    <p className="text-2xl font-bold text-gray-900">₹{financialAnalytics.totalDues.toLocaleString()}</p>
                    <p className="text-xs text-red-600">{financialAnalytics.overduePayments} overdue</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-calendar-check-line text-xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.averageAttendance)}%</p>
                    <p className="text-xs text-green-600">+2% this month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="ri-trophy-line text-xl text-yellow-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Score</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.averageScore)}</p>
                    <p className="text-xs text-green-600">+3 pts this week</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="ri-discount-percent-line text-xl text-orange-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Discounts</p>
                    <p className="text-2xl font-bold text-gray-900">₹{financialAnalytics.totalDiscounts.toLocaleString()}</p>
                    <p className="text-xs text-orange-600">Total given</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-user-add-line"></i>
                  <span>Add Student</span>
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-money-rupee-circle-line"></i>
                  <span>Add Payment</span>
                </button>
                <button
                  onClick={() => setShowDiscountModal(true)}
                  className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-discount-percent-line"></i>
                  <span>Apply Discount</span>
                </button>
                <button
                  onClick={() => setShowLibraryModal(true)}
                  className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-book-line"></i>
                  <span>Library</span>
                </button>
                <button
                  onClick={() => setShowExamModal(true)}
                  className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-quiz-line"></i>
                  <span>Add Exam</span>
                </button>
                <button
                  onClick={() => setShowCounselingModal(true)}
                  className="bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-user-heart-line"></i>
                  <span>Counseling</span>
                </button>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-award-line"></i>
                  <span>Certificate</span>
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="ri-download-line"></i>
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method Stats</h2>
                <div className="space-y-3">
                  {Object.entries(financialAnalytics.paymentMethodStats).map(([method, stats]: [string, any]) => (
                    <div key={method} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className={`${method === 'cash' ? 'ri-money-rupee-circle-line' : method === 'card' ? 'ri-bank-card-line' : method === 'upi' ? 'ri-smartphone-line' : 'ri-bank-line'} text-blue-600`}></i>
                        <span className="text-sm text-gray-600 capitalize">{method}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{stats.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{stats.count} transactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Fee Defaulters</h2>
                <div className="space-y-3">
                  {financialAnalytics.defaulters.slice(0, 5).map((student: Student) => (
                    <div key={student.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.mobile}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">₹{student.fees.dueAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Due amount</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Enhanced Search and Filter Controls */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select
                    value={filterShift}
                    onChange={(e) => setFilterShift(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="all">All Shifts</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="all">All Categories</option>
                    <option value="Banking">Banking</option>
                    <option value="SSC">SSC</option>
                    <option value="Railway">Railway</option>
                    <option value="UPSC">UPSC</option>
                    <option value="State">State Government</option>
                    <option value="Defense">Defense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                  <div className="flex space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="enrollmentDate">Enrollment</option>
                      <option value="progress">Progress</option>
                      <option value="attendance">Attendance</option>
                      <option value="score">Score</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Students Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Students ({sortedStudents.length})</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-add-line"></i>
                    <span>Add Student</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-money-rupee-circle-line"></i>
                    <span>Payment</span>
                  </button>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-download-line"></i>
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium">{student.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">ID: {student.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.email}</div>
                          <div className="text-sm text-gray-500">{student.mobile}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.jobCategory}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.shift === 'morning' ? 'bg-yellow-100 text-yellow-800' :
                            student.shift === 'afternoon' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {student.shift}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Paid: ₹{student.fees.paidAmount.toLocaleString()}</div>
                          <div className={`text-sm ${student.fees.dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            Due: ₹{student.fees.dueAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Score: {student.progress.averageScore}%</div>
                          <div className="text-sm text-gray-500">Tests: {student.progress.testsCompleted}</div>
                          <div className="text-sm text-gray-500">Attendance: {Math.round((student.attendance.present / student.attendance.totalDays || 0) * 100)}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.status === 'active' ? 'bg-green-100 text-green-800' :
                            student.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer"
                              title="Edit Student"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => {
                                setPaymentData(prev => ({ ...prev, studentId: student.id }));
                                setShowPaymentModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 cursor-pointer"
                              title="Add Payment"
                            >
                              <i className="ri-money-rupee-circle-line"></i>
                            </button>
                            <button
                              onClick={() => {
                                setLibraryData(prev => ({ ...prev, studentId: student.id }));
                                setShowLibraryModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900 cursor-pointer"
                              title="Library"
                            >
                              <i className="ri-book-line"></i>
                            </button>
                            <button
                              onClick={() => sendNotificationToStudent(student.id, 'Important update from admin')}
                              className="text-orange-600 hover:text-orange-900 cursor-pointer"
                              title="Send Notification"
                            >
                              <i className="ri-notification-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                              title="Delete Student"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Analytics Tab */}
        {activeTab === 'analytics' && analytics && financialAnalytics && (
          <div className="space-y-6">
            {/* Financial Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold text-green-600">₹{financialAnalytics.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Dues</span>
                    <span className="font-bold text-red-600">₹{financialAnalytics.totalDues.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discounts Given</span>
                    <span className="font-bold text-orange-600">₹{financialAnalytics.totalDiscounts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection Rate</span>
                    <span className="font-bold text-blue-600">
                      {Math.round((financialAnalytics.totalRevenue / (financialAnalytics.totalRevenue + financialAnalytics.totalDues)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Library Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Books Issued</span>
                    <span className="font-bold text-blue-600">
                      {students.reduce((sum, s) => sum + s.library.booksIssued.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overdue Books</span>
                    <span className="font-bold text-red-600">
                      {students.reduce((sum, s) => sum + s.library.booksIssued.filter(b => b.status === 'overdue').length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Fines</span>
                    <span className="font-bold text-orange-600">
                      ₹{students.reduce((sum, s) => sum + s.library.fines.reduce((fineSum, f) => fineSum + (f.status === 'pending' ? f.amount : 0), 0), 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Exams</span>
                    <span className="font-bold text-blue-600">
                      {students.reduce((sum, s) => sum + s.examHistory.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Performance</span>
                    <span className="font-bold text-green-600">
                      {Math.round(students.reduce((sum, s) => sum + s.progress.averageScore, 0) / students.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Top Performers</span>
                    <span className="font-bold text-purple-600">
                      {students.filter(s => s.progress.averageScore > 80).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <i className="ri-add-line"></i>
                  <span>Add Announcement</span>
                </button>
              </div>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                        <p className="text-gray-600 mt-1">{announcement.message}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>By: {announcement.author}</span>
                          <span>Date: {announcement.date}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                            announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {announcement.priority} priority
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Performance</h3>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Report
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Report</h3>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    defaultValue="BD Library GOH"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Monthly Fee
                  </label>
                  <input
                    type="number"
                    defaultValue="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Data
                  </label>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Create Backup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Student</h3>
                <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={newStudent.mobile}
                    onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mobile number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Study Shift *</label>
                  <select
                    value={newStudent.shift}
                    onChange={(e) => setNewStudent({ ...newStudent, shift: e.target.value as 'morning' | 'afternoon' | 'evening' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="morning">Morning (6:00 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (12:00 PM - 6:00 PM)</option>
                    <option value="evening">Evening (6:00 PM - 10:00 PM)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Category *</label>
                  <select
                    value={newStudent.jobCategory}
                    onChange={(e) => setNewStudent({ ...newStudent, jobCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="Banking">Banking</option>
                    <option value="SSC">SSC</option>
                    <option value="Railway">Railway</option>
                    <option value="UPSC">UPSC</option>
                    <option value="State">State Government</option>
                    <option value="Defense">Defense</option>
                  </select>
                </div>
                
                {/* Fee Structure Section */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <i className="ri-money-rupee-circle-line mr-2 text-green-600"></i>
                    Monthly Fee Structure
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee (₹) *</label>
                      <input
                        type="number"
                        value={newStudent.monthlyFee}
                        onChange={(e) => setNewStudent({ ...newStudent, monthlyFee: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter monthly fee"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div className="flex flex-col justify-end">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Fee:</span>
                            <span className="font-medium">₹{newStudent.monthlyFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Type:</span>
                            <span className="font-medium text-blue-600">Monthly</span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="text-gray-700 font-medium">Default Duration:</span>
                            <span className="font-medium text-green-600">6 Months</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700 mb-2">
                    <i className="ri-information-line mr-2"></i>
                    Student Information
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Monthly fee structure will be applied</li>
                    <li>• Student will receive login credentials via email</li>
                    <li>• Enrollment date: {new Date().toLocaleDateString()}</li>
                    <li>• Payment history will be automatically tracked</li>
                    <li>• Monthly payments will be tracked automatically</li>
                  </ul>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewStudent({
                        name: '',
                        email: '',
                        mobile: '',
                        shift: 'morning',
                        jobCategory: 'Banking',
                        monthlyFee: 1000
                      });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Modals */}
        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Payment</h3>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={paymentData.studentId}
                    onChange={(e) => setPaymentData({ ...paymentData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                  <input
                    type="text"
                    value={paymentData.receiptNo}
                    onChange={(e) => setPaymentData({ ...paymentData, receiptNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={paymentData.description}
                    onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    maxLength={500}
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Add Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Discount Modal */}
        {showDiscountModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Apply Discount</h3>
              <form onSubmit={handleApplyDiscount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={discountData.studentId}
                    onChange={(e) => setDiscountData({ ...discountData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={discountData.type}
                    onChange={(e) => setDiscountData({ ...discountData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value {discountData.type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={discountData.value}
                    onChange={(e) => setDiscountData({ ...discountData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={discountData.reason}
                    onChange={(e) => setDiscountData({ ...discountData, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    maxLength={500}
                    required
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDiscountModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Apply Discount
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Library Modal */}
        {showLibraryModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Library Management</h3>
              <form onSubmit={handleLibraryAction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={libraryData.studentId}
                    onChange={(e) => setLibraryData({ ...libraryData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <select
                    value={libraryData.action}
                    onChange={(e) => setLibraryData({ ...libraryData, action: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="issue">Issue Book</option>
                    <option value="return">Return Book</option>
                  </select>
                </div>
                {libraryData.action === 'issue' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
                    <input
                      type="text"
                      value={libraryData.bookName}
                      onChange={(e) => setLibraryData({ ...libraryData, bookName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}
                {libraryData.action === 'return' && libraryData.studentId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Book to Return</label>
                    <select
                      value={libraryData.bookId}
                      onChange={(e) => setLibraryData({ ...libraryData, bookId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                      required
                    >
                      <option value="">Select Book</option>
                      {students.find(s => s.id === libraryData.studentId)?.library.booksIssued
                        .filter(book => book.status === 'issued')
                        .map(book => (
                          <option key={book.id} value={book.id}>{book.bookName}</option>
                        ))}
                    </select>
                  </div>
                )}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLibraryModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {libraryData.action === 'issue' ? 'Issue Book' : 'Return Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Exam Modal */}
        {showExamModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Exam Result</h3>
              <form onSubmit={handleAddExamResult} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={examData.studentId}
                    onChange={(e) => setExamData({ ...examData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                  <input
                    type="text"
                    value={examData.examName}
                    onChange={(e) => setExamData({ ...examData, examName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={examData.totalMarks}
                      onChange={(e) => setExamData({ ...examData, totalMarks: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Obtained Marks</label>
                    <input
                      type="number"
                      value={examData.obtainedMarks}
                      onChange={(e) => setExamData({ ...examData, obtainedMarks: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowExamModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Add Result
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Counseling Modal */}
        {showCounselingModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Counseling Session</h3>
              <form onSubmit={handleAddCounselingSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={counselingData.studentId}
                    onChange={(e) => setCounselingData({ ...counselingData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Counselor</label>
                  <input
                    type="text"
                    value={counselingData.counselor}
                    onChange={(e) => setCounselingData({ ...counselingData, counselor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={counselingData.topic}
                    onChange={(e) => setCounselingData({ ...counselingData, topic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={counselingData.notes}
                    onChange={(e) => setCounselingData({ ...counselingData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Session Date</label>
                  <input
                    type="date"
                    value={counselingData.nextSession}
                    onChange={(e) => setCounselingData({ ...counselingData, nextSession: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCounselingModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Add Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {showCertificateModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Issue Certificate</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const studentId = (e.target as any).studentId.value;
                const certificateType = (e.target as any).certificateType.value;
                if (studentId && certificateType) {
                  issueCertificate(studentId, {
                    type: certificateType,
                    issueDate: new Date().toISOString().split('T')[0],
                    issuedBy: 'BD Library GOH'
                  });
                  setShowCertificateModal(false);
                  loadData();
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    name="studentId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
                  <select
                    name="certificateType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="completion">Course Completion</option>
                    <option value="participation">Participation</option>
                    <option value="achievement">Achievement</option>
                    <option value="excellence">Excellence</option>
                  </select>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCertificateModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Issue Certificate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Export Student Data</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Choose the format to export student data:</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="ri-file-text-line"></i>
                    <span>Export as CSV</span>
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="ri-code-line"></i>
                    <span>Export as JSON</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcement Modal */}
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Announcement</h3>
              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <select
                    value={newAnnouncement.targetAudience}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Students</option>
                    <option value="morning">Morning Shift</option>
                    <option value="afternoon">Afternoon Shift</option>
                    <option value="evening">Evening Shift</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newAnnouncement.expiryDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
