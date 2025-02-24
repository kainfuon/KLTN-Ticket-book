import express from "express";
import { placeOrder, confirmPayment, getUserOrders, getOrderDetail, getUserTickets } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", verifyToken, placeOrder); // Place order
orderRouter.post("/confirm", verifyToken, confirmPayment); // Place order
//orderRouter.get("/user/my-tickets", verifyToken, getUserTickets);
orderRouter.get("/user/my-orders", verifyToken, getUserOrders); // Get user orders
orderRouter.get("/:orderId", verifyToken, getOrderDetail); // Get order details


export default orderRouter;
