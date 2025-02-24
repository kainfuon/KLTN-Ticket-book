import orderModel from "../models/orderModel.js";
import ticketModel from "../models/ticketModel.js";
import eventModel from "../models/eventModel.js";
import userTicketModel from "../models/userTicketModel.js";

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const { eventId, tickets, fullName, email, phone } = req.body;
        if (!eventId || !tickets.length || !fullName || !email || !phone) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Lấy userId từ token
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID is missing." });
        }

        // Kiểm tra sự kiện có tồn tại không
        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        let totalPrice = 0;
        let userTickets = [];

        // Xử lý từng loại vé
        for (let item of tickets) {
            const ticket = await ticketModel.findById(item.ticketId);
            if (!ticket || ticket.eventId.toString() !== eventId) {
                return res.status(400).json({ success: false, message: "Invalid ticket selection." });
            }
            if (ticket.availableSeats < item.quantity) {
                return res.status(400).json({ success: false, message: `Not enough seats for ${ticket.type}` });
            }

            totalPrice += ticket.price * item.quantity;

            // Tạo từng vé riêng biệt trong bảng userTicket
            for (let i = 0; i < item.quantity; i++) {
                const newUserTicket = await userTicketModel.create({
                    ticketType: ticket._id,
                    eventId,
                    ownerId: userId
                });
                userTickets.push(newUserTicket._id);
            }
        }

        // Tạo đơn hàng
         const newOrder = new orderModel({
            userId,
            eventId,
            tickets: userTickets,
            fullName,
            email,
            phone,
            totalPrice,
            status: "pending",
        });

        await newOrder.save();

        res.json({ success: true, message: "Order placed successfully!", data: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


const confirmPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId).populate({
            path: "tickets",
            populate: { path: "ticketType" }, // Populate ticketType để lấy thông tin vé
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        if (order.status === "paid") {
            return res.json({ success: true, message: "Order already paid.", data: order });
        }

        // 🔍 Đếm số lượng vé theo type
        const ticketCounts = {};
        order.tickets.forEach((userTicket) => {
            if (!userTicket.ticketType) {
                console.warn("⚠️ userTicket không có ticketType:", userTicket._id);
                return;
            }

            const type = userTicket.ticketType.type; // Lấy type từ ticketType
            ticketCounts[type] = (ticketCounts[type] || 0) + 1;
        });

        console.log("📊 Số lượng vé theo loại:", ticketCounts);

        // 🏷 Cập nhật số lượng vé trong ticketModel
        for (const [type, count] of Object.entries(ticketCounts)) {
            const ticket = await ticketModel.findOne({ eventId: order.eventId, type });

            if (ticket) {
                ticket.availableSeats -= count;
                ticket.ticketsSold += count;

                if (ticket.availableSeats <= 0) {
                    ticket.status = "sold_out";
                }

                await ticket.save();
            } else {
                console.warn(`⚠️ Không tìm thấy ticket với type: ${type}`);
            }
        }

        //  Cập nhật trạng thái order
        order.status = "paid";
        await order.save();

        res.json({ success: true, message: "Payment successful!", data: order });
    } catch (error) {
        console.error("🚨 Error confirming payment:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};



// Get list orders for the authenticated user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy userId từ auth middleware

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID is missing." });
        }

        const orders = await orderModel
            .find({ userId })
            // .populate("eventId", "title eventDate venue image") // Fetch event name, date, and location only
            .populate({
                path: "tickets", 
                select: "ticketType", // Chỉ lấy `ticketType` trong `userTicket`
                populate: { path: "ticketType", select: "type price" } // Fetch ticket type and price from `ticket` collection
            });


        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// Get order details
const getOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId).populate("eventId").populate("tickets.ticketId");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const getUserTickets = async (req, res) => {
    try {
        const userId = req.user?.userId; // Lấy userId từ token đã xác thực

        // Tìm tất cả các đơn hàng của user
        const orders = await orderModel.find({ userId });

        // Lấy danh sách tất cả ticket mà user đã mua
        let userTickets = [];
        for (const order of orders) {
            for (const item of order.tickets) {
                const ticket = await ticketModel.findById(item.ticketId);
                const event = await eventModel.findById(ticket.eventId);

                if (ticket && event) {
                    userTickets.push({
                        eventTitle: event.title,
                        ticketType: ticket.type,
                        price: ticket.price,
                        quantity: item.quantity,
                        eventDate: event.eventDate,
                        venue: event.venue,
                    });
                }
            }
        }

        res.json({ success: true, data: userTickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

export { placeOrder, confirmPayment, getUserOrders, getOrderDetail, getUserTickets };
