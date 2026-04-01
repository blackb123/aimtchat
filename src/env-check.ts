// API Environment Variable Verification
console.log('=== API Environment Variables Check ===');
console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);

// Test API calls
import { API_BASE_URL, SOCKET_URL } from '@/constants';

console.log('Constants API_BASE_URL:', API_BASE_URL);
console.log('Constants SOCKET_URL:', SOCKET_URL);

// Export for testing
export const envCheck = {
  viteApiUrl: import.meta.env.VITE_API_BASE_URL,
  viteSocketUrl: import.meta.env.VITE_SOCKET_URL,
  constantsApiUrl: API_BASE_URL,
  constantsSocketUrl: SOCKET_URL
};
