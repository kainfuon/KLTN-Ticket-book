import mongoose from "mongoose";

const userTicketSchema = new mongoose.Schema({
    ticketType: { type: mongoose.Schema.Types.ObjectId, ref: "ticket", required: true }, // Loại vé
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event", required: true }, // Sự kiện của vé
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Chủ sở hữu vé
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" }, // ID đơn hàng (nếu có)
    isTraded: { type: Boolean, default: false }, // Vé có được trade không
}, { timestamps: true });

const userTicketModel = mongoose.models.userTicket || mongoose.model("userTicket", userTicketSchema);

export default userTicketModel;
