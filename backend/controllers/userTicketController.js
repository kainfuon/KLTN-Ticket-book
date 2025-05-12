import userTicketModel from "../models/userTicketModel.js";
import userModel from "../models/userModel.js";
import QRCode from "qrcode";
import Stripe from "stripe";
import mongoose from "mongoose";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = "http://localhost:5173";

// Get all user tickets
const getUserTickets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const tickets = await userTicketModel.find({
          ownerId: userId,
          isPendingTrade: false  // Thêm điều kiện này để không lấy vé đang pending trade
        })
            .populate("ticketType", "type price")
            .populate("eventId", "title eventDate venue image");

        res.json({ success: true, data: tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Get ticket details
const getTicketDetails = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await userTicketModel.findOne({ _id: ticketId, ownerId: req.user.userId })
            .populate("ticketType", "type price")
            .populate("eventId", "title eventDate venue image");

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found." });
        }

        res.json({ success: true, data: ticket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Generate QR code for a ticket
const generateTicketQR = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await userTicketModel.findOne({ _id: ticketId, ownerId: req.user.userId });

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found." });
        }

        const timestamp = Date.now();

        const qrData = JSON.stringify({
            ticketId: ticket._id,
            eventId: ticket.eventId,
            ticketType: ticket.ticketType,
            ownerId: ticket.ownerId,
            timestamp
        });

        const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
        res.json({ success: true, qrCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// 1. Initiate trade (User A gửi vé cho User B)
const tradeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { recipientEmail, password } = req.body;

    // 1. Xác minh mật khẩu người gửi
    const currentUser = await userModel.findById(req.user.userId);
    const isPasswordValid = await currentUser.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }

    // 2. Tìm người nhận
    const recipient = await userModel.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ success: false, message: "Recipient email not found." });
    }

    if (recipient._id.toString() === req.user.userId) {
      return res.status(400).json({ success: false, message: "Cannot trade ticket to yourself." });
    }

    // 3. Tìm vé
    const ticket = await userTicketModel.findOne({
      _id: ticketId,
      ownerId: req.user.userId,
      isPendingTrade: false
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or not eligible for trading."
      });
    }

    // 4. Cập nhật trạng thái trade
    ticket.isPendingTrade = true;
    ticket.pendingRecipient = recipient._id;
    ticket.pendingTradeCreatedAt = new Date();

    ticket.tradeHistory.push({
      fromUserId: req.user.userId,
      toUserId: recipient._id,
      tradeDate: new Date(),
    });

    await ticket.save();

    res.json({
      success: true,
      message: "Ticket is now pending. Recipient must confirm and pay within 24 hours.",
      recipientEmail: recipient.email
    });

  } catch (error) {
    console.error('Trade ticket error:', error);
    res.status(500).json({
      success: false,
      message: "Server error while trading ticket."
    });
  }
};

// 2. Get list of pending trades for current user (User B)
const getPendingTrades = async (req, res) => {
  try {
    const userId = req.user.userId; // lấy từ token qua middleware

    const tickets = await userTicketModel.find({
      isPendingTrade: true,
      pendingRecipient: userId,
    }).populate("eventId ticketType");

    res.json({ success: true, data: tickets });
  } catch (error) {
    console.error("getPendingTrades error:", error);
    res.status(500).json({ success: false, message: "Server error fetching pending trades." });
  }
};


// 3. Accept trade (User B tiến hành thanh toán)
const acceptTrade = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.userId;

    const ticket = await userTicketModel.findOne({
      _id: ticketId,
      isPendingTrade: true,
      pendingRecipient: userId
    }).populate("eventId ticketType");

    if (!ticket) {
      return res.status(404).json({ success: false, message: "No pending ticket found for you." });
    }

    const event = ticket.eventId;
    const ticketType = ticket.ticketType;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `Trade vé ${ticketType.type} - ${event.title}`,
          },
          unit_amount: ticketType.price * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${CLIENT_URL}/verify-trade?success=true&ticketId=${ticket._id}`,
      cancel_url: `${CLIENT_URL}/verify-trade?success=false&ticketId=${ticket._id}`,
      metadata: {
        ticketId: ticket._id.toString(),
        recipientId: userId,
        senderId: ticket.ownerId.toString(),
      },
    });

    res.json({ success: true, sessionUrl: session.url });

  } catch (error) {
    console.error("acceptTrade error:", error);
    res.status(500).json({ success: false, message: "Server error during trade payment." });
  }
};

// 4. Confirm trade after payment (User B đã thanh toán thành công)
 const confirmTrade = async (req, res) => {
  try {
    const { ticketId } = req.body;
    const userId = req.user.userId;

    const ticket = await userTicketModel.findOne({
      _id: ticketId,
      isPendingTrade: true,
      pendingRecipient: userId
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not available for confirmation." });
    }

    const fromUserId = ticket.ownerId;
    const toUserId = userId;

    // 1. Xác định xem vé đã từng được nhận qua trade chưa
    const isReceivedTicket = ticket.isTraded;

    // 2. Cập nhật điểm uy tín
    await userModel.findByIdAndUpdate(
      fromUserId,
      { $inc: { reputationScore: isReceivedTicket ? -2 : -1 } }
    );

    await userModel.findByIdAndUpdate(
      toUserId,
      { $inc: { reputationScore: 1 } }
    );

    // 3.  Chuyển quyền sở hữu
    ticket.ownerId = userId;
    ticket.isPendingTrade = false;
    ticket.pendingRecipient = null;
    ticket.pendingTradeCreatedAt = null;
    ticket.isTraded = true;

    await ticket.save();

    res.json({ success: true, message: "Ticket trade confirmed successfully." });
  } catch (error) {
    console.error("confirmTrade error:", error);
    res.status(500).json({ success: false, message: "Server error during trade confirmation." });
  }
};

//5.  Cancel Trade (User A hủy gửi vé)
const cancelTrade = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.userId;

    console.log("Cancel Trade Debug:");
    console.log("ticketId:", ticketId);
    console.log("userId from token:", userId);

    const ticket = await userTicketModel.findOne({
      _id: ticketId,
      pendingRecipient: req.user.userId,
      isPendingTrade: true
    });

    if (!ticket) {
      console.log("Ticket not found or not cancellable.");
      return res.status(404).json({ success: false, message: "Trade not found or not cancellable." });
    }

    ticket.isPendingTrade = false;
    ticket.pendingRecipient = null;
    ticket.pendingTradeCreatedAt = null;

    await ticket.save();

    res.json({ success: true, message: "Trade canceled." });
  } catch (error) {
    console.error("Cancel trade error:", error);
    res.status(500).json({ success: false, message: "Failed to cancel trade." });
  }
};


export {getUserTickets, getTicketDetails, generateTicketQR, tradeTicket, getPendingTrades, acceptTrade, confirmTrade, cancelTrade};