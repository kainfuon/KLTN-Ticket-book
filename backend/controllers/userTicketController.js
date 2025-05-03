import userTicketModel from "../models/userTicketModel.js";
import userModel from "../models/userModel.js";
import QRCode from "qrcode";

// Get all user tickets
const getUserTickets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const tickets = await userTicketModel.find({ ownerId: userId })
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

const tradeTicket = async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { recipientEmail, password } = req.body;
  
      // Verify current user's password
      const currentUser = await userModel.findById(req.user.userId);
      const isPasswordValid = await currentUser.comparePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password."
        });
      }

      console.log("Provided password:", password);
console.log("User hash:", currentUser.password);
console.log("Password valid:", isPasswordValid);

  
      // Find recipient by email
      const recipient = await userModel.findOne({ email: recipientEmail });
      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: "Recipient email not found."
        });
      }
  
      // Check if user is trying to trade to themselves
      if (recipient._id.toString() === req.user.userId) {
        return res.status(400).json({
          success: false,
          message: "Cannot trade ticket to yourself."
        });
      }
  
      // Find and verify ticket ownership
      const ticket = await userTicketModel.findOne({
        _id: ticketId,
        ownerId: req.user.userId
      });
  
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found or you don't own this ticket."
        });
      }

      // Thêm thông tin trade vào lịch sử trade
      ticket.tradeHistory.push({
          fromUserId: req.user.userId,
          toUserId: recipient._id,
          tradeDate: new Date(),
      });
      
      // Update ticket ownership
      ticket.ownerId = recipient._id;
      await ticket.save();
  
      // You might want to add notification or email service here
      // to notify the recipient about the ticket transfer
  
      res.json({
        success: true,
        message: "Ticket successfully transferred.",
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
  


export {getUserTickets, getTicketDetails, generateTicketQR, tradeTicket};