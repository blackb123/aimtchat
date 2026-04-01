// Test file to verify environment variables are loaded
console.log('Environment Variables Test:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);
console.log('All env vars:', import.meta.env);

export const testEnv = () => {
  console.log('Testing environment variables...');
  console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL);
};
