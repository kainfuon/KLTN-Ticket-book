import express from "express";
import { verifyAdmin } from "../middleware/auth.js";
import {
    addTicket,
    getTicketsByEvent,
    getTicketById,
    updateTicket,
    deleteTicket
} from "../controllers/ticketController.js";

const ticketRouter = express.Router();

// API routes for tickets
ticketRouter.post("/add", verifyAdmin, addTicket); // Add a new ticket
ticketRouter.get("/event/:eventId", getTicketsByEvent); // Get all tickets for an event
ticketRouter.get("/:ticketId", getTicketById); // Get details of a specific ticket
ticketRouter.put("/update/:ticketId", verifyAdmin, updateTicket); // Update ticket details
ticketRouter.delete("/delete/:ticketId", verifyAdmin, deleteTicket); // Delete a ticket

export default ticketRouter;
