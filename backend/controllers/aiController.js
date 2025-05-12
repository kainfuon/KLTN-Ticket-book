import { spawn } from "child_process";
import userTicketModel from "../models/userTicketModel.js";
import userModel from "../models/userModel.js";

// Hàm gọi script AI để đánh giá 1 user
const predictScalperFromStats = (totalTickets, tradesCount) => {
    return new Promise((resolve) => {
        const py = spawn("python", [
            "ai/detect_scalper.py",
            "predict",
            totalTickets,
            tradesCount,
            reputationScore, 
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
        const users = await userTicketModel.distinct("ownerId");

        const result = [];

        const promises = users.map(async (userId) => {
            const [totalTicketsOrdered, tradesCount] = await Promise.all([
                userTicketModel.aggregate([
                    { $match: { ownerId: userId } },
                    {
                        $group: {
                            _id: "$ownerId",
                            total: { $sum: 1 },
                        },
                    },
                ]),
                getTradeCount(userId),
                getUserReputationScore(userId), 
            ]);

            const ticketCount = totalTicketsOrdered[0]?.total || 0;
            const reputationScore = userInfo?.reputationScore || 0; 

            const isScalper = await predictScalperFromStats(ticketCount, tradesCount, reputationScore);

            return {
                userId,
                totalTickets: ticketCount,
                trades: tradesCount,
                reputationScore,
                isScalper,
            };
        });

        result.push(...await Promise.all(promises));

        res.json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.error("Error checking scalpers:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// Cập nhật để đếm số vé trade từ tradeHistory
const getTradeCount = async (userId) => {
    const tradeCount = await userTicketModel.countDocuments({
        "tradeHistory.fromUserId": userId,
    });
    return tradeCount;
};

// Hàm lấy điểm người dùng từ userModel
const getUserReputationScore = async (userId) => {
    const user = await userModel.findById(userId);
    return user ? user.reputationScore : 0;  // Trả về điểm người dùng, nếu không có thì mặc định là 0
};