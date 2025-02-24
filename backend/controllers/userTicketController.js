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

        const qrData = JSON.stringify({
            ticketId: ticket._id,
            eventId: ticket.eventId,
            ticketType: ticket.ticketType,
            ownerId: ticket.ownerId
        });

        const qrCode = await QRCode.toDataURL(qrData);
        res.json({ success: true, qrCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Trade ticket
const tradeTicket = async (req, res) => {
    try {
        const { ticketId, recipientId, password } = req.body;
        const userId = req.user.userId;

        if (!ticketId || !recipientId || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // Lấy user + password
        const user = await userModel.findById(userId).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid password." });
        }

        // Tìm vé & đổi chủ sở hữu
        const ticket = await userTicketModel.findOne({ _id: ticketId, ownerId: userId });
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found or not owned by you." });
        }

        ticket.ownerId = recipientId;
        ticket.isTraded = true;
        await ticket.save();

        res.json({ success: true, message: "Ticket traded successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};



export {getUserTickets, getTicketDetails, generateTicketQR, tradeTicket};