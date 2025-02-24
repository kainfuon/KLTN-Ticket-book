import express from "express";
import { verifyAdmin, verifyToken } from "../middleware/auth.js";
import {
    addTicket,
    getTicketsByEvent,
    updateTicket,
    deleteTicket
} from "../controllers/ticketController.js";

const ticketRouter = express.Router();

// API routes for tickets
ticketRouter.post("/add", verifyAdmin, addTicket); // Add a new ticket
ticketRouter.put("/update/:ticketId", verifyAdmin, updateTicket); // Update ticket details
ticketRouter.delete("/delete/:ticketId", verifyAdmin, deleteTicket); // Delete a ticket
ticketRouter.get("/event/:eventId", getTicketsByEvent); // Get all tickets for an event
//ticketRouter.get("/:ticketId/qr", verifyToken, getTicketQR); // Get qr code forfor ticket
//ticketRouter.get("/:ticketId", verifyToken, getTicketById); // Get details of a specific ticket


export default ticketRouter;
