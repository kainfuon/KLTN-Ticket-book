import express from "express";
import {getUserTickets, getTicketDetails, generateTicketQR, tradeTicket, getPendingTrades, acceptTrade, confirmTrade, cancelTrade, getSuccessfulTrades} from "../controllers/userTicketController.js";
import { verifyToken , verifyAdmin} from "../middleware/auth.js";

const userTicketRouter = express.Router()


userTicketRouter.get("/all-trades", verifyAdmin, getSuccessfulTrades);
userTicketRouter.get("/my-tickets", verifyToken, getUserTickets);
userTicketRouter.get("/pending-trades", verifyToken, getPendingTrades);
userTicketRouter.post("/confirm-trade", verifyToken, confirmTrade);


userTicketRouter.post("/:ticketId/trade", verifyToken, tradeTicket);
userTicketRouter.get("/:ticketId/qr", verifyToken, generateTicketQR);
userTicketRouter.post("/:ticketId/accept-trade", verifyToken, acceptTrade);
userTicketRouter.post("/:ticketId/cancel-trade", verifyToken, cancelTrade);
userTicketRouter.get("/:ticketId", verifyToken, getTicketDetails);


export default userTicketRouter