import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    saleStartDate: { type: Date, required: true },
    venue: { type: String, required: true },
    image: { type: String, required: true },
    category: { 
        type: String, 
        enum: ["Âm nhạc", "Kịch", "Workshop", "Triển lãm", "Thể thao", "Dịch vụ"], 
        required: true 
    },
    status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
}, { timestamps: true });

const eventModel = mongoose.models.event || mongoose.model("event", eventSchema);

export default eventModel;
