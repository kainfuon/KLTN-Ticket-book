import express from "express";
import { placeOrder, getUserOrders, getOrderDetail, getUserTickets } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", verifyToken, placeOrder); // Place order
orderRouter.get("/user/:userId", verifyToken, getUserOrders); // Get user orders
orderRouter.get("/:orderId", verifyToken, getOrderDetail); // Get order details
orderRouter.get("/my-tickets", verifyToken, getUserTickets);

export default orderRouter;
