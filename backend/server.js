import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import eventRouter from "./routers/eventRoutes.js"
import userRouter from "./routers/userRoutes.js"
import ticketRouter from "./routers/ticketRoutes.js"
import orderRouter from "./routers/orderRoutes.js"

//import dotenv from "dotenv"
//import 'dotenv/config'

// app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cors())


// db connect
connectDB();

// api endpoint
app.use("/api/event", eventRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/ticket", ticketRouter)
app.use("/api/order", orderRouter)

app.get("/",(req, res) => {
    res.send("API work")
})

app.listen(port,() => {
    console.log(`Server start on http://localhost:${port}`)
})
