#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

async function testAboutModel() {
  try {
    console.log('🔍 Testing About model with new fields...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Import the updated model
    const About = require('./models/About');
    
    // Find existing about content
    let aboutContent = await About.findOne();
    console.log('📄 Current about content:', aboutContent ? 'Found' : 'Not found');
    
    if (aboutContent) {
      console.log('📊 Current stats:');
      console.log('  Years Experience:', aboutContent.yearsExperience);
      console.log('  Happy Customers:', aboutContent.happyCustomers);
      
      // Test updating the fields
      console.log('\n🔄 Testing update with new stats...');
      
      const updated = await About.findByIdAndUpdate(aboutContent._id, {
        yearsExperience: '15+',
        happyCustomers: '50000+',
        lastUpdated: new Date()
      }, {
        new: true,
        runValidators: true
      });
      
      console.log('✅ Update successful!');
      console.log('📊 Updated stats:');
      console.log('  Years Experience:', updated.yearsExperience);
      console.log('  Happy Customers:', updated.happyCustomers);
      console.log('  Last Updated:', updated.lastUpdated);
      
      // Verify the changes persisted
      const verified = await About.findById(aboutContent._id);
      console.log('\n🔍 Verification:');
      console.log('  Years Experience:', verified.yearsExperience);
      console.log('  Happy Customers:', verified.happyCustomers);
      
      if (verified.yearsExperience === '15+' && verified.happyCustomers === '50000+') {
        console.log('✅ Database changes are working correctly!');
      } else {
        console.log('❌ Database changes not persisting properly');
      }
      
    } else {
      console.log('📝 Creating new about content with stats...');
      
      aboutContent = await About.create({
        heroTitle: 'About Test Company',
        heroDescription: 'Test description',
        storyTitle: 'Test Story',
        storyContent: ['Test content'],
        yearsExperience: '15+',
        happyCustomers: '50000+',
        vision: 'Test vision',
        mission: 'Test mission'
      });
      
      console.log('✅ Created new about content');
      console.log('📊 Stats:');
      console.log('  Years Experience:', aboutContent.yearsExperience);
      console.log('  Happy Customers:', aboutContent.happyCustomers);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the test
testAboutModel();
