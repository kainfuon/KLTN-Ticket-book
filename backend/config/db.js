import mongoose from "mongoose";
const MONGO_URL = 'mongodb+srv://kainfuon:Test12345678@cluster0.ayrph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

export const connectDB = async () => {
    await mongoose.connect(MONGO_URL)
        .then(() => {
            console.log('Database is connected');
        })
}