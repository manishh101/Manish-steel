const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Product schema (simplified)
const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', ProductSchema);

const fixProductFlags = async () => {
  try {
    await connectDB();
    
    // Get all products
    const allProducts = await Product.find({});
    console.log(`Found ${allProducts.length} products`);
    
    if (allProducts.length > 0) {
      // Set first 3 products as top products
      const topProductIds = allProducts.slice(0, 3).map(p => p._id);
      await Product.updateMany(
        { _id: { $in: topProductIds } },
        { $set: { isTopProduct: true } }
      );
      console.log('Set 3 products as top products');
      
      // Set next 3 products as most selling
      const mostSellingIds = allProducts.slice(3, 6).map(p => p._id);
      await Product.updateMany(
        { _id: { $in: mostSellingIds } },
        { $set: { isMostSelling: true } }
      );
      console.log('Set 3 products as most selling');
      
      // Check the results
      const topProducts = await Product.find({ isTopProduct: true });
      const mostSellingProducts = await Product.find({ isMostSelling: true });
      
      console.log(`Top Products: ${topProducts.length}`);
      console.log(`Most Selling Products: ${mostSellingProducts.length}`);
      
      topProducts.forEach(p => console.log(`Top Product: ${p.name}`));
      mostSellingProducts.forEach(p => console.log(`Most Selling Product: ${p.name}`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixProductFlags();
