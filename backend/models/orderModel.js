import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Người đặt vé
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event", required: true }, // Sự kiện
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "userTicket" }], // Danh sách vé của user
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
