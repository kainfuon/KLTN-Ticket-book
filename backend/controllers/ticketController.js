import ticketModel from "../models/ticketModel.js";
import eventModel from "../models/eventModel.js";
import orderModel from "../models/orderModel.js";
import QRCode from "qrcode";

// Thao tác của admin

// Add a new ticket for an event
const addTicket = async (req, res) => {
    try {
        const { eventId, type, price, totalSeats } = req.body;

        // Check if event exists
        const event = await eventModel.findById(eventId);
        console.log("Request Body:", req.body);
        if (!event) {
            console.log("Received eventId:", eventId);

            return res.status(404).json({ success: false, message: "Event not found." });
        }

        // Create new ticket
        const newTicket = new ticketModel({
            eventId,
            type,
            price,
            totalSeats,
            availableSeats: totalSeats,
            ticketsSold: 0,
            status: "available"
        });

        await newTicket.save();
        res.json({ success: true, message: "Ticket added successfully!", data: newTicket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Update ticket (price, totalSeats)
const updateTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { price, totalSeats } = req.body;

        // Find and update ticket
        const updatedTicket = await ticketModel.findByIdAndUpdate(
            ticketId,
            { price, totalSeats, availableSeats: totalSeats }, // Reset availableSeats if total changes
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ success: false, message: "Ticket not found." });
        }

        res.json({ success: true, message: "Ticket updated successfully!", data: updatedTicket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Delete ticket
const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Find and delete ticket
        const deletedTicket = await ticketModel.findByIdAndDelete(ticketId);
        if (!deletedTicket) {
            return res.status(404).json({ success: false, message: "Ticket not found." });
        }

        res.json({ success: true, message: "Ticket deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// Thao tác của người dùng

// Get all tickets for an event
const getTicketsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Find all tickets for this event
        const tickets = await ticketModel.find({ eventId });
        res.json({ success: true, data: tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Get ticket details by ID
const getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Find ticket by ID
        const ticket = await ticketModel.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found." });
        }

        res.json({ success: true, data: ticket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const getTicketQR = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { ticketId } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID is missing." });
        }

        const order = await orderModel.findOne({ userId, "tickets.ticketId": ticketId, status: "paid" });
        if (!order) {
            return res.status(404).json({ success: false, message: "Ticket not found or not paid." });
        }

        const ticket = order.tickets.find(t => t.ticketId.toString() === ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found." });
        }

        const ticketData = {
            orderId: order._id,
            ticketId: ticket.ticketId,
            userId: order.userId,
            timestamp: Date.now() // Thêm timestamp để QR code thay đổi mỗi lần gọi API
        };
        const qrCode = await QRCode.toDataURL(JSON.stringify(ticketData));

        res.json({ success: true, qrCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

export { addTicket, getTicketsByEvent, getTicketById, updateTicket, deleteTicket, getTicketQR };
