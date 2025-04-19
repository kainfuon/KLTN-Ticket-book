import express from "express";
import { getSuspectedScalpers } from "../controllers/aiController.js";
import { verifyAdmin } from "../middleware/auth.js";

const aiRouter = express.Router();

// API chỉ admin mới được quyền gọi
aiRouter.get("/suspects", verifyAdmin, getSuspectedScalpers);

export default aiRouter;
