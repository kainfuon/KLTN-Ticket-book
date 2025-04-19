import { spawn } from "child_process";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"; // Nếu cần lấy thêm info user
import userTicketModel from "../models/userTicketModel.js";

// Hàm gọi script AI để đánh giá 1 user
const predictScalperFromStats = (totalTickets, tradesCount) => {
    return new Promise((resolve) => {
        const py = spawn("python", [
            "backend/ai/detect_scalper.py",
            "predict",
            totalTickets,
            tradesCount,
        ]);

        let result = "";
        py.stdout.on("data", (data) => {
            result += data.toString();
        });

        py.stderr.on("data", (data) => {
            console.error("AI error:", data.toString());
        });

        py.on("close", () => {
            const isScalper = result.trim() === "1";
            resolve(isScalper);
        });
    });
};

export const getSuspectedScalpers = async (req, res) => {
    try {
        // Lấy danh sách tất cả user có đơn hàng
        const users = await orderModel.distinct("userId");

        const result = [];

        for (let userId of users) {
            const totalTicketsOrdered = await orderModel.aggregate([
                { $match: { userId } },
                { $unwind: "$tickets" },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$tickets.quantity" },
                    },
                },
            ]);

            const tradesCount = await userTicketModel.countDocuments({
                ownerId: userId,
                isTraded: true,
            });

            const ticketCount = totalTicketsOrdered[0]?.total || 0;

            const isScalper = await predictScalperFromStats(ticketCount, tradesCount);

            result.push({
                userId,
                totalTickets: ticketCount,
                trades: tradesCount,
                isScalper,
            });
        }

        res.json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.error("Error checking scalpers:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
