import mongoose from "mongoose";

const userTicketSchema = new mongoose.Schema({
    ticketType: { type: mongoose.Schema.Types.ObjectId, ref: "ticket", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
  
    tradeHistory: [{
      fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      tradeDate: { type: Date, default: Date.now },
    }],
  
    // Giao dịch có điều kiện thanh toán
    isPendingTrade: { type: Boolean, default: false },
    pendingRecipient: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
    pendingTradeCreatedAt: { type: Date, default: null }
  
  }, { timestamps: true });
  
const userTicketModel = mongoose.models.userTicket || mongoose.model("userTicket", userTicketSchema);

export default userTicketModel;
