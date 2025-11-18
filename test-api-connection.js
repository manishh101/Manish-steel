const fetch = require('node-fetch');

async function testAPIConnection() {
  const API_URLS = [
    'https://manish-steel-backend.vercel.app/api',
    'https://manish-steel-backend.vercel.app/api/health',
    'https://manish-steel-backend.vercel.app/api/products/featured',
    'https://manish-steel-backend.vercel.app/api/products/most-selling',
    'https://manish-steel-backend.vercel.app/api/products/top-products'
  ];

  console.log('🧪 Testing API connections...\n');

  for (const url of API_URLS) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url, { 
        method: 'GET',
        timeout: 10000 
      });
      
      const data = await response.text();
      
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.products && jsonData.products.length > 0) {
            console.log(`📦 Products found: ${jsonData.products.length}`);
          } else if (jsonData.count !== undefined) {
            console.log(`📦 Count: ${jsonData.count}`);
          }
        } catch (e) {
          console.log(`📝 Response: ${data.substring(0, 100)}...`);
        }
      } else {
        console.log(`❌ Error: ${data.substring(0, 200)}`);
      }
      
    } catch (error) {
      console.log(`💥 Connection Error: ${error.message}`);
    }
    
    console.log('---');
  }
}

testAPIConnection();
