'use client';

import React, { useState, useEffect } from 'react';
import { testAuthentication, debugAuthData, initializeAuthData } from '@/lib/auth';

export default function AuthTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeAuthData().catch(console.error);
  }, []);

  const testDemo = async () => {
    setLoading(true);
    try {
      const authResult = await testAuthentication('demo@student.com', '1234567890');
      setResult(JSON.stringify(authResult, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  const testDebug = async () => {
    setLoading(true);
    try {
      await debugAuthData();
      setResult('Debug info logged to console');
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  return React.createElement('div', {
    style: { padding: '20px', fontFamily: 'Arial, sans-serif' }
  }, [
    React.createElement('h1', { key: 'title' }, 'Authentication Test Page'),
    React.createElement('div', { key: 'buttons', style: { marginBottom: '20px' } }, [
      React.createElement('button', {
        key: 'test',
        onClick: testDemo,
        disabled: loading,
        style: {
          padding: '10px 20px',
          marginRight: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }
      }, loading ? 'Testing...' : 'Test Demo Login'),
      React.createElement('button', {
        key: 'debug',
        onClick: testDebug,
        disabled: loading,
        style: {
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }
      }, 'Debug Auth')
    ]),
    React.createElement('pre', {
      key: 'result',
      style: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        overflow: 'auto',
        fontSize: '12px'
      }
    }, result || 'Click a button to test authentication')
  ]);
}
