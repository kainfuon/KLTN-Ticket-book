import mongoose from "mongoose";
const MONGO_URL = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5'

export const connectDB = async () => {
    // Nếu đang chạy test thì bỏ qua connect thật
    if (process.env.NODE_ENV === 'test') {
      return;
    }
  
    await mongoose.connect(MONGO_URL)
      .then(() => console.log('✅ Database is connected'))
      .catch((err) => console.log('❌ MongoDB connection error:', err));
  };