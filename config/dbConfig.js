const mongoose = require('mongoose')

const url = process.env.mongodburl;

async function connectDB() {
  try {
    await mongoose.connect(url,{
      
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

module.exports = connectDB;
