import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event", required: true },

    // Ban đầu lưu dạng: [{ ticketType, quantity }]
    tickets: [{
        ticketType: { type: mongoose.Schema.Types.ObjectId, ref: "ticket" },
        quantity: { type: Number, required: true }
    }],

    // Sau khi thanh toán, sẽ lưu riêng danh sách userTicket thực tế
    userTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "userTicket" }],
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    totalPrice: { type: Number, required: true },

    status: { type: String, enum: ["pending", "processing", "paid", "cancelled"], default: "pending" },
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
