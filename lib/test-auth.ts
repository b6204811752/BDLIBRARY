'use client';

import { authenticateStudent, initializeAuthData, debugAuthData } from './auth';

export async function testStudentLogin() {
  try {
    console.log('=== Testing Student Authentication ===');
    
    // Initialize database
    await initializeAuthData();
    
    // Debug database state
    await debugAuthData();
    
    // Test with demo credentials
    const testCredentials = [
      { email: 'rajesh@email.com', mobile: '9065541346' },
      { email: 'demo@student.com', mobile: '1234567890' },
      { email: 'john@example.com', mobile: '9876543210' }
    ];
    
    for (const creds of testCredentials) {
      console.log(`\n--- Testing: ${creds.email} / ${creds.mobile} ---`);
      const result = await authenticateStudent(creds.email, creds.mobile);
      console.log('Result:', result);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}
