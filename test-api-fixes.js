#!/usr/bin/env node

const axios = require('axios');

// Test configuration
const API_BASE_URL = 'https://manish-steel-api.onrender.com';
const ENDPOINTS_TO_TEST = [
  '/health',
  '/api/health', 
  '/api/products?limit=1',
  '/api/products/featured?limit=1'
];

// Enhanced axios instance with retry logic
const testClient = axios.create({
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'API-Test-Client/1.0'
  }
});

// Add retry logic to test client
testClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }
    
    // Retry on timeout or connection errors
    if ((error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') && 
        originalRequest._retryCount < 2) {
      
      originalRequest._retryCount++;
      console.log(`  🔄 Retrying (attempt ${originalRequest._retryCount + 1}/3)...`);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, originalRequest._retryCount) * 1000));
      
      return testClient(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

async function testEndpoint(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  const startTime = new Date();
  
  try {
    console.log(`\n🧪 Testing: ${url}`);
    
    const response = await testClient.get(url);
    const duration = new Date() - startTime;
    
    console.log(`  ✅ SUCCESS - Status: ${response.status}, Time: ${duration}ms`);
    
    // Log response data preview
    if (response.data) {
      if (typeof response.data === 'object') {
        const keys = Object.keys(response.data);
        console.log(`  📊 Response keys: [${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}]`);
        
        if (response.data.products && Array.isArray(response.data.products)) {
          console.log(`  📦 Products count: ${response.data.products.length}`);
        }
      }
    }
    
    return { success: true, status: response.status, duration, endpoint };
    
  } catch (error) {
    const duration = new Date() - startTime;
    
    console.log(`  ❌ FAILED - ${error.message}, Time: ${duration}ms`);
    
    if (error.response) {
      console.log(`  📊 Error status: ${error.response.status}`);
      if (error.response.data) {
        console.log(`  📝 Error data:`, error.response.data);
      }
    }
    
    return { success: false, error: error.message, duration, endpoint };
  }
}

async function runTests() {
  console.log('🚀 Starting API Connection Tests');
  console.log(`📍 Testing API: ${API_BASE_URL}`);
  console.log('=' * 50);
  
  const results = [];
  
  for (const endpoint of ENDPOINTS_TO_TEST) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '=' * 50);
  console.log('📊 TEST SUMMARY');
  console.log('=' * 50);
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
    console.log(`⏱️  Average response time: ${Math.round(avgDuration)}ms`);
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed endpoints:');
    failed.forEach(result => {
      console.log(`  - ${result.endpoint}: ${result.error}`);
    });
  }
  
  console.log('\n🎯 Recommendations:');
  
  if (failed.length === 0) {
    console.log('  ✨ All tests passed! API is working correctly.');
  } else if (failed.length === results.length) {
    console.log('  🚨 All tests failed. API server may be down or unreachable.');
    console.log('  💡 Check server logs and ensure it\'s deployed correctly.');
  } else {
    console.log('  ⚠️  Some tests failed. Check individual endpoint issues.');
  }
  
  // Exit with appropriate code
  process.exit(failed.length > 0 ? 1 : 0);
}

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n⏹️  Test interrupted by user');
  process.exit(1);
});

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner error:', error);
  process.exit(1);
});
