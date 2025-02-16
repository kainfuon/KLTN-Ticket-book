import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    venue: { type: String, required: true },
    image: {type:String, required: true},
    status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
}, { timestamps: true });

const eventModel = mongoose.model.event || mongoose.model("event", eventSchema)

export default eventModel;