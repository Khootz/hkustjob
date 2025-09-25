import { parsePageInput } from './api';

// Simple test to verify API connectivity
const testApiConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('API Health Check:', data);
    return data;
  } catch (error) {
    console.error('API Connection Error:', error);
    return null;
  }
};

// Test the page parser with mock data
const testPageParsing = () => {
  const mockPages = "1-3";
  const pages = parsePageInput(mockPages);
  console.log(`Parsed "${mockPages}" into:`, pages);
};

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testApi = testApiConnection;
  (window as any).testPageParsing = testPageParsing;
}

export { testApiConnection, testPageParsing };