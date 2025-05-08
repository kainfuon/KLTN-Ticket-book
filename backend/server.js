// server.js
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { updateEventStatus, checkPendingTrades } from "./cron/updateEventStatus.js";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 4001;

// Kết nối DB và chạy server
connectDB();
updateEventStatus();
checkPendingTrades();

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
