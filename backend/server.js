import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import eventRouter from "./routers/eventRoutes.js"
import userRouter from "./routers/userRoutes.js"
import ticketRouter from "./routers/ticketRoutes.js"
import orderRouter from "./routers/orderRoutes.js"
import userTicketRouter from "./routers/userTicketRouters.js"
import statsRouter from "./routers/statsRouter.js"
import aiRouter from "./routers/aiRouter.js"

//import dotenv from "dotenv"
//import 'dotenv/config'

// app config
const app = express()
const port = 4001

//middleware
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173", // Đúng domain frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));


// db connect
connectDB();

// api endpoint
app.use("/api/event", eventRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/ticket", ticketRouter)
app.use("/api/order", orderRouter)
app.use("/api/userTicket", userTicketRouter)
app.use("/api/stats", statsRouter);  
app.use("/api/ai", aiRouter); // Đường dẫn cho router AI
app.get("/",(req, res) => {
    res.send("API work")
})

app.listen(port,() => {
    console.log(`Server start on http://localhost:${port}`)
})
