import orderModel from "../models/orderModel.js";
import ticketModel from "../models/ticketModel.js";
import eventModel from "../models/eventModel.js";

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const { eventId, tickets, fullName, email, phone } = req.body;
        if (!eventId || !tickets.length || !fullName || !email || !phone) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        //console.log("User from token:", req.user);
        // Lấy userId từ token
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID is missing." });
        }

        // Check if event exists
        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        let totalPrice = 0;

        // Validate tickets
        for (let item of tickets) {
            const ticket = await ticketModel.findById(item.ticketId);
            if (!ticket || ticket.eventId.toString() !== eventId) {
                return res.status(400).json({ success: false, message: "Invalid ticket selection." });
            }
            if (ticket.availableSeats < item.quantity) {
                return res.status(400).json({ success: false, message: `Not enough seats for ${ticket.type}` });
            }

            totalPrice += ticket.price * item.quantity;
        }

        // Create and save order
        const newOrder = new orderModel({
            userId,
            eventId,
            tickets,
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
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        if (order.status === "paid") {
            return res.json({ success: true, message: "Order already paid.", data: order });
        }

        order.status = "paid";
        await order.save();

        res.json({ success: true, message: "Payment successful!", data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// Get orders for the authenticated user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy userId từ auth middleware

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID is missing." });
        }

        const orders = await orderModel
            .find({ userId })
            .populate("eventId")
            .populate("tickets.ticketId");

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
