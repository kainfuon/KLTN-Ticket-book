import express from "express";
import {getUserTickets, getTicketDetails, generateTicketQR, tradeTicket} from "../controllers/userTicketController.js";
import { verifyToken } from "../middleware/auth.js";

const userTicketRouter = express.Router()

userTicketRouter.get("/my-tickets", verifyToken, getUserTickets);
userTicketRouter.post("/:ticketId/trade", verifyToken, tradeTicket);
userTicketRouter.get("/:ticketId/qr", verifyToken, generateTicketQR); 
userTicketRouter.get("/:ticketId", verifyToken, getTicketDetails); 


export default userTicketRouter