import express from "express";
import { verifyAdmin } from "../middleware/auth.js";
import { getEventSalesStats, getTicketTypeSalesStats } from "../controllers/statsController.js";

const statsRouter = express.Router();

statsRouter.get("/event-sales", verifyAdmin, getEventSalesStats);
statsRouter.get("/ticket-sales/:eventId", verifyAdmin, getTicketTypeSalesStats);

export default statsRouter;
