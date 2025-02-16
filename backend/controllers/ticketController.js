import ticketModel from "../models/ticketModel.js";
import eventModel from "../models/eventModel.js";

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

export { addTicket, getTicketsByEvent, getTicketById, updateTicket, deleteTicket };
