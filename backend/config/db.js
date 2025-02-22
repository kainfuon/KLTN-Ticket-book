import mongoose from "mongoose";
const MONGO_URL = 'mongodb://localhost:27017/'

export const connectDB = async () => {
    await mongoose.connect(MONGO_URL)
        .then(() => {
            console.log('Database is connected');
        })
}