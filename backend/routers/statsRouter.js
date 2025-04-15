import express from "express";
import { verifyAdmin } from "../middleware/auth.js";
import { getEventSalesStats, getTicketTypeSalesStats } from "../controllers/statsController.js";

const statsRouter = express.Router();

statsRouter.get("/events", verifyAdmin, getEventSalesStats);
statsRouter.get("/tickets/:eventId", verifyAdmin, getTicketTypeSalesStats);

export default statsRouter;
