const mongoose = require('mongoose');
const Product = require('./models/Product');

// Connect to database
mongoose.connect('mongodb://localhost:27017/manish-steel-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testCategoryFiltering() {
  try {
    // Get all products
    const allProducts = await Product.find({}).populate('categoryId', 'name').populate('subcategoryId', 'name');
    console.log('Total products in database:', allProducts.length);
    
    // Group by category
    const categoryGroups = {};
    allProducts.forEach(product => {
      const categoryId = product.categoryId?._id || 'unknown';
      const categoryName = product.categoryId?.name || product.category || 'unknown';
      
      if (!categoryGroups[categoryId]) {
        categoryGroups[categoryId] = {
          name: categoryName,
          products: []
        };
      }
      categoryGroups[categoryId].products.push(product);
    });
    
    console.log('\nProducts by category:');
    Object.entries(categoryGroups).forEach(([id, data]) => {
      console.log(`- ${data.name} (ID: ${id}): ${data.products.length} products`);
    });
    
    // Test category filtering
    const firstCategoryId = Object.keys(categoryGroups)[0];
    if (firstCategoryId && firstCategoryId !== 'unknown') {
      console.log('\nTesting category filter for ID:', firstCategoryId);
      
      const categoryFilteredProducts = await Product.find({ categoryId: firstCategoryId });
      console.log('Products found with categoryId filter:', categoryFilteredProducts.length);
      
      // Also test string-based filtering
      const categoryName = categoryGroups[firstCategoryId].name;
      const stringFilteredProducts = await Product.find({ 
        category: { $regex: categoryName, $options: 'i' } 
      });
      console.log('Products found with category name filter:', stringFilteredProducts.length);
    }
    
  } catch (error) {
    console.error('Error testing:', error);
  } finally {
    mongoose.connection.close();
  }
}

testCategoryFiltering();
