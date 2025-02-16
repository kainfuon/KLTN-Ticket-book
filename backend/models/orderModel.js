import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Reference to user
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event", required: true }, // Reference to event
    tickets: [
        {
            ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "ticket", required: true }, // Reference to ticket
            quantity: { type: Number, required: true }, // Number of tickets
        }
    ],
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" }, // Order status
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
