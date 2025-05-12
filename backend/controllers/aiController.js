import { spawn } from "child_process";
import userTicketModel from "../models/userTicketModel.js";
import userModel from "../models/userModel.js";

// Hàm gọi script AI để đánh giá 1 user
const predictScalperFromStats = (totalTickets, tradesCount, reputationScore) => {
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
        const userIds = await userTicketModel.distinct("ownerId");

        const result = [];

        const promises = userIds.map(async (userId) => {
            const userInfo = await userModel.findById(userId);

            // Bỏ qua user đã bị xóa khỏi hệ thống
            if (!userInfo) return null;

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
            ]);

            const ticketCount = totalTicketsOrdered[0]?.total || 0;
            const reputationScore = userInfo.reputationScore || 0;

            const isScalper = await predictScalperFromStats(ticketCount, tradesCount, reputationScore);

            return {
                userId,
                totalTickets: ticketCount,
                trades: tradesCount,
                reputationScore,
                isScalper,
            };
        });

        const scalperResults = await Promise.all(promises);

        // Lọc bỏ các kết quả null (user đã bị xóa)
        result.push(...scalperResults.filter(r => r !== null));

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