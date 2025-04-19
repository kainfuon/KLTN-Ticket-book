import mongoose from "mongoose";
const MONGO_URL = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5'

export const connectDB = async () => {
    await mongoose.connect(MONGO_URL)
        .then(() => {
            console.log('Database is connected');
        })
}