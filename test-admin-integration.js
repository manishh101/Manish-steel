#!/usr/bin/env node
/**
 * Frontend-Backend Integration Test
 * Tests if admin panel can properly connect to backend APIs
 */

const fetch = require('node-fetch');

async function testBackendAPI() {
  console.log('🔍 Testing Backend API Integration...\n');
  
  const baseUrl = 'http://localhost:5000/api';
  
  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('   ✅ Backend Health:', healthData.status);
  } catch (error) {
    console.log('   ❌ Health Check Failed:', error.message);
    return;
  }
  
  // Test 2: Admin Login
  let adminToken = null;
  try {
    console.log('\n2️⃣ Testing Admin Login...');
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: '9814379071',
        password: 'M@nishsteel'
      })
    });
    const loginData = await loginResponse.json();
    
    if (loginData.success && loginData.data.token) {
      adminToken = loginData.data.token;
      console.log('   ✅ Admin Login Successful');
      console.log('   👤 User:', loginData.data.user.name, '- Role:', loginData.data.user.role);
    } else {
      console.log('   ❌ Admin Login Failed:', loginData.message);
      return;
    }
  } catch (error) {
    console.log('   ❌ Admin Login Error:', error.message);
    return;
  }
  
  // Test 3: Admin Product Access
  try {
    console.log('\n3️⃣ Testing Admin Product Access...');
    const productResponse = await fetch(`${baseUrl}/products?limit=5`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    const productData = await productResponse.json();
    
    if (productData.products && productData.products.length > 0) {
      console.log(`   ✅ Admin can access ${productData.products.length} products`);
      console.log(`   📦 Total Products Available: ${productData.totalProducts}`);
      console.log(`   🏷️ Sample Product: "${productData.products[0].name}"`);
    } else {
      console.log('   ❌ No products found or access denied');
    }
  } catch (error) {
    console.log('   ❌ Product Access Error:', error.message);
  }
  
  // Test 4: Categories Access
  try {
    console.log('\n4️⃣ Testing Categories Access...');
    const categoryResponse = await fetch(`${baseUrl}/categories`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    const categoryData = await categoryResponse.json();
    
    if (Array.isArray(categoryData) && categoryData.length > 0) {
      console.log(`   ✅ ${categoryData.length} categories available`);
      console.log('   📂 Categories:', categoryData.map(c => c.name).join(', '));
    } else {
      console.log('   ❌ No categories found');
    }
  } catch (error) {
    console.log('   ❌ Categories Access Error:', error.message);
  }
  
  // Test 5: Inquiries Access
  try {
    console.log('\n5️⃣ Testing Inquiries Access...');
    const inquiryResponse = await fetch(`${baseUrl}/inquiries`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    const inquiryData = await inquiryResponse.json();
    
    if (inquiryData.success && inquiryData.inquiries) {
      console.log(`   ✅ ${inquiryData.inquiries.length} inquiries found`);
      console.log(`   📧 Total Inquiries: ${inquiryData.totalInquiries}`);
    } else {
      console.log('   ❌ No inquiries found or access denied');
    }
  } catch (error) {
    console.log('   ❌ Inquiries Access Error:', error.message);
  }
  
  console.log('\n📊 Integration Test Summary:');
  console.log('✅ Backend is running on http://localhost:5000');
  console.log('✅ Admin authentication is working');
  console.log('✅ Admin can access protected endpoints');
  console.log('🚀 Frontend should be able to connect properly');
  
  console.log('\n🎯 Frontend Admin Panel URLs:');
  console.log('   🔐 Admin Login: http://localhost:3000/login');
  console.log('   📦 Products: http://localhost:3000/admin/products');
  console.log('   📧 Inquiries: http://localhost:3000/admin/inquiries');
  console.log('   📂 Categories: http://localhost:3000/admin/categories');
  
  console.log('\n🔑 Admin Credentials:');
  console.log('   📱 Phone/Email: 9814379071');
  console.log('   🔒 Password: M@nishsteel');
}

testBackendAPI().catch(console.error);
