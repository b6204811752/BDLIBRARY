import React, { useState, useEffect } from 'react';
import {
  getFeeTransactions,
  createFeeTransaction,
  getStudentFeeHistory,
  getOutstandingFees,
  getFeeAnalytics,
  getFeeDefaulters,
  generateFeeReceipt,
  sendFeeReminder,
  applyFeeDiscount,
  FeeTransaction
} from '@/lib/fee-management';

interface FeeManagementProps {
  students: any[];
  currentUser: any;
}

export default function FeeManagement({ students, currentUser }: FeeManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [feeTransactions, setFeeTransactions] = useState<FeeTransaction[]>([]);
  const [feeAnalytics, setFeeAnalytics] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'cash' as 'cash' | 'upi' | 'bank_transfer' | 'card',
    transactionId: '',
    description: 'Monthly Fee Payment'
  });

  useEffect(() => {
    loadFeeData();
  }, []);

  const loadFeeData = () => {
    setFeeTransactions(getFeeTransactions());
    setFeeAnalytics(getFeeAnalytics());
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !paymentData.amount) return;

    const transaction = createFeeTransaction(
      selectedStudent.id,
      parseFloat(paymentData.amount),
      paymentData.method,
      paymentData.description,
      currentUser.id,
      paymentData.transactionId
    );

    setFeeTransactions([...feeTransactions, transaction]);
    setShowPaymentModal(false);
    setSelectedStudent(null);
    setPaymentData({
      amount: '',
      method: 'cash',
      transactionId: '',
      description: 'Monthly Fee Payment'
    });
    loadFeeData();
  };

  const defaulters = getFeeDefaulters();
  const analytics = feeAnalytics || {};

  return (
    <div className="space-y-6">
      {/* Mobile-responsive tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto space-x-8 sm:space-x-0 sm:grid sm:grid-cols-4 gap-4">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'collect', name: 'Collect Fee', icon: '💰' },
            { id: 'transactions', name: 'Transactions', icon: '📝' },
            { id: 'defaulters', name: 'Defaulters', icon: '⚠️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{analytics.totalRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{analytics.pendingAmount?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalTransactions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Defaulters</p>
                <p className="text-2xl font-bold text-gray-900">{defaulters.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collect Fee Tab */}
      {activeTab === 'collect' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Collect Fee Payment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {students.map((student) => {
              const outstandingAmount = getOutstandingFees(student.id);
              return (
                <div key={student.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.course} - {student.shift}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      outstandingAmount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {outstandingAmount > 0 ? `₹${outstandingAmount} Due` : 'Paid'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Fee: ₹{student.monthlyFees}</span>
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setPaymentData({ ...paymentData, amount: student.monthlyFees.toString() });
                        setShowPaymentModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Collect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeTransactions.slice(0, 10).map((transaction) => {
                  const student = students.find(s => s.id === transaction.studentId);
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student?.name || 'Unknown Student'}
                        </div>
                        <div className="text-sm text-gray-500">{student?.course}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{transaction.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {transaction.paymentMethod.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.receiptNo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Defaulters Tab */}
      {activeTab === 'defaulters' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Defaulters</h3>
          
          {defaulters.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-green-600 text-4xl mb-4">✅</div>
              <p className="text-gray-600">No defaulters found! All students are up to date with their payments.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaulters.map((defaulter) => {
                const student = students.find(s => s.id === defaulter.studentId);
                return (
                  <div key={defaulter.studentId} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{student?.name || 'Unknown Student'}</h4>
                        <p className="text-sm text-gray-600">{student?.course} - {student?.shift}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">
                        {defaulter.daysPastDue} days overdue
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-red-600">
                        Outstanding: ₹{defaulter.outstandingAmount.toLocaleString()}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => sendFeeReminder(defaulter.studentId, defaulter.outstandingAmount, '')}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                        >
                          Send Reminder
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setPaymentData({ ...paymentData, amount: defaulter.outstandingAmount.toString() });
                            setShowPaymentModal(true);
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Collect Payment
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Collect Fee - {selectedStudent.name}
              </h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Amount</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Payment Method</label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value as any })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                  </select>
                </div>

                {paymentData.method !== 'cash' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-left">Transaction ID</label>
                    <input
                      type="text"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Description</label>
                  <input
                    type="text"
                    value={paymentData.description}
                    onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedStudent(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Collect Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
