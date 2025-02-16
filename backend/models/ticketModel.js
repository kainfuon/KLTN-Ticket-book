import mongoose from "mongoose";

// Define ticket schema
const ticketSchema = new mongoose.Schema(
    {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event", required: true }, // Reference to event
        type: { type: String, required: true }, // Ticket type (VIP, Regular, etc.)
        price: { type: Number, required: true }, // Ticket price
        totalSeats: { type: Number, required: true }, // Total number of seats for this ticket type
        availableSeats: { type: Number, required: true }, // Remaining seats
        ticketsSold: { type: Number, default: 0 }, // Number of tickets sold
        status: { type: String, enum: ["available", "sold_out"], default: "available" }, // Ticket availability status
    },
    { timestamps: true } // Auto add createdAt & updatedAt
);

const ticketModel = mongoose.model.event || mongoose.model("ticket", ticketSchema)

export default ticketModel;
