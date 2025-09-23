#!/usr/bin/env node

const axios = require('axios');

async function quickTest() {
  const client = axios.create({
    timeout: 30000,
    headers: { 'User-Agent': 'Quick-API-Test/1.0' }
  });

  const endpoints = [
    'https://manish-steel-api.onrender.com/health',
    'https://manish-steel-api.onrender.com/api/health',
    'https://manish-steel-api.onrender.com/api/products?limit=1'
  ];

  console.log('🚀 Quick API Test Results:');
  console.log('=' * 40);

  for (const url of endpoints) {
    const start = Date.now();
    try {
      const response = await client.get(url);
      const time = Date.now() - start;
      console.log(`✅ ${url} - ${response.status} (${time}ms)`);
    } catch (error) {
      const time = Date.now() - start;
      console.log(`❌ ${url} - ${error.message} (${time}ms)`);
    }
  }
}

quickTest().catch(console.error);
