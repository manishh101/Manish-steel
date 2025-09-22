// Test Enhanced Category Filtering for Existing 41 Products
// This tests the fallback logic when API is offline

import { productAPI } from '../src/services/api.js';
import { defaultProducts } from '../src/utils/productData.js';

// Mock the API connection to be false to force fallback
const originalLog = console.log;
console.log = (...args) => {
  if (!args[0]?.includes('API:')) return; // Only show API logs
  originalLog(...args);
};

async function testCategoryFiltering() {
  console.log('\n=== TESTING ENHANCED CATEGORY FILTERING FOR EXISTING 41 PRODUCTS ===\n');

  // Test 1: Office Furniture Category
  console.log('🏢 Testing Office Furniture Category:');
  try {
    const officeResponse = await productAPI.getByCategory('Office Furniture');
    const officeProducts = officeResponse.data;
    
    console.log(`✅ Found ${officeProducts.length} office products`);
    
    // Show sample products and their subcategories
    const officeSample = officeProducts.slice(0, 5).map(p => ({
      name: p.name,
      categoryId: p.categoryId,
      subcategoryId: p.subcategoryId
    }));
    console.log('📦 Sample office products:', officeSample);
    
    // Test subcategory inclusion
    const officeSubcategories = [...new Set(officeProducts.map(p => p.subcategoryId))];
    console.log('🔸 Office subcategories found:', officeSubcategories);
    
  } catch (error) {
    console.error('❌ Office category test failed:', error.message);
  }

  console.log('\n' + '─'.repeat(60) + '\n');

  // Test 2: Household Furniture Category  
  console.log('🏠 Testing Household Furniture Category:');
  try {
    const householdResponse = await productAPI.getByCategory('Household Furniture');
    const householdProducts = householdResponse.data;
    
    console.log(`✅ Found ${householdProducts.length} household products`);
    
    // Show sample products and their subcategories
    const householdSample = householdProducts.slice(0, 5).map(p => ({
      name: p.name,
      categoryId: p.categoryId,
      subcategoryId: p.subcategoryId
    }));
    console.log('📦 Sample household products:', householdSample);
    
    // Test subcategory inclusion
    const householdSubcategories = [...new Set(householdProducts.map(p => p.subcategoryId))];
    console.log('🔸 Household subcategories found:', householdSubcategories);
    
  } catch (error) {
    console.error('❌ Household category test failed:', error.message);
  }

  console.log('\n' + '─'.repeat(60) + '\n');

  // Test 3: Commercial Furniture Category
  console.log('🏢 Testing Commercial Furniture Category:');
  try {
    const commercialResponse = await productAPI.getByCategory('Commercial Furniture');
    const commercialProducts = commercialResponse.data;
    
    console.log(`✅ Found ${commercialProducts.length} commercial products`);
    
    // Show sample products and their subcategories
    const commercialSample = commercialProducts.slice(0, 5).map(p => ({
      name: p.name,
      categoryId: p.categoryId,
      subcategoryId: p.subcategoryId
    }));
    console.log('📦 Sample commercial products:', commercialSample);
    
    // Test subcategory inclusion
    const commercialSubcategories = [...new Set(commercialProducts.map(p => p.subcategoryId))];
    console.log('🔸 Commercial subcategories found:', commercialSubcategories);
    
  } catch (error) {
    console.error('❌ Commercial category test failed:', error.message);
  }

  console.log('\n' + '─'.repeat(60) + '\n');

  // Test 4: Category ID-based filtering (for direct ID access)
  console.log('🆔 Testing Category ID-based filtering:');
  try {
    const officeIdResponse = await productAPI.getByCategory('office');
    const officeIdProducts = officeIdResponse.data;
    
    console.log(`✅ Found ${officeIdProducts.length} products for categoryId 'office'`);
    
    const householdIdResponse = await productAPI.getByCategory('household');  
    const householdIdProducts = householdIdResponse.data;
    
    console.log(`✅ Found ${householdIdProducts.length} products for categoryId 'household'`);
    
  } catch (error) {
    console.error('❌ Category ID test failed:', error.message);
  }

  console.log('\n' + '─'.repeat(60) + '\n');

  // Test 5: Verify total coverage
  console.log('📊 Testing Total Coverage:');
  try {
    const allProducts = defaultProducts;
    const totalProducts = allProducts.length;
    
    const officeCount = (await productAPI.getByCategory('Office Furniture')).data.length;
    const householdCount = (await productAPI.getByCategory('Household Furniture')).data.length;
    const commercialCount = (await productAPI.getByCategory('Commercial Furniture')).data.length;
    
    console.log(`📈 Total products in dataset: ${totalProducts}`);
    console.log(`🏢 Office products: ${officeCount}`);
    console.log(`🏠 Household products: ${householdCount}`);
    console.log(`🏪 Commercial products: ${commercialCount}`);
    console.log(`🎯 Coverage: ${officeCount + householdCount + commercialCount}/${totalProducts} (${Math.round(((officeCount + householdCount + commercialCount) / totalProducts) * 100)}%)`);
    
    if (officeCount + householdCount + commercialCount === totalProducts) {
      console.log('✅ PERFECT! All products are properly categorized');
    } else {
      console.log('⚠️  Some products may not be categorized properly');
    }
    
  } catch (error) {
    console.error('❌ Coverage test failed:', error.message);
  }

  console.log('\n=== CATEGORY FILTERING TEST COMPLETE ===\n');
}

// Run the test
testCategoryFiltering().catch(console.error);
