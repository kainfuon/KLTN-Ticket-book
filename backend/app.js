// app.js
import express from "express";
import cors from "cors";
import eventRouter from "./routers/eventRoutes.js";
import userRouter from "./routers/userRoutes.js";
import ticketRouter from "./routers/ticketRoutes.js";
import orderRouter from "./routers/orderRoutes.js";
import userTicketRouter from "./routers/userTicketRouters.js";
import statsRouter from "./routers/statsRouter.js";
import aiRouter from "./routers/aiRouter.js";

// Tạo app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

// Static file
app.use("/images", express.static('uploads'));

// Routers
app.use("/api/event", eventRouter);
app.use("/api/user", userRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/order", orderRouter);
app.use("/api/userTicket", userTicketRouter);
app.use("/api/stats", statsRouter);
app.use("/api/ai", aiRouter);

// Test endpoint
app.get("/", (req, res) => {
  res.send("API work");
});

export default app;
