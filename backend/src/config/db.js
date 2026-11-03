const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/employeedb';

  console.log(`[Database] Attempting connection to MongoDB at: ${mongoURI.replace(/\/\/.*@/, '//<credentials>@')}`);

  const maxRetries = 10;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`[Database] Connection attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`[Database] Retrying connection in 3 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } else {
        console.error('[Database] All connection attempts to MongoDB failed.');
        throw error;
      }
    }
  }
};

module.exports = connectDB;
