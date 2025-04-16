import orderModel from "../models/orderModel.js";
import ticketModel from "../models/ticketModel.js";
import eventModel from "../models/eventModel.js";
import userTicketModel from "../models/userTicketModel.js";
import dotenv from "dotenv";
dotenv.config(); // 🔥 Load biến môi trường từ .env

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    const CLIENT_URL = "http://localhost:5173";

    try {
        const { eventId, tickets, fullName, email, phone } = req.body;
        if (!eventId || !tickets.length || !fullName || !email || !phone) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID is missing." });
        }

        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        let totalPrice = 0;
        let ticketItems = [];
        let lineItems = [];

        for (let item of tickets) {
            const ticket = await ticketModel.findById(item.ticketId);
            if (!ticket || ticket.eventId.toString() !== eventId) {
                return res.status(400).json({ success: false, message: "Invalid ticket selection." });
            }
            if (ticket.availableSeats < item.quantity) {
                return res.status(400).json({ success: false, message: `Not enough seats for ${ticket.type}` });
            }

            totalPrice += ticket.price * item.quantity;

            ticketItems.push({
                ticketType: ticket._id,
                quantity: item.quantity,
            });

            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: `${ticket.type} - ${event.title}` },
                    unit_amount: ticket.price * 100,
                },
                quantity: item.quantity,
            });
        }

        const newOrder = new orderModel({
            userId,
            eventId,
            tickets: ticketItems, // Lưu lại loại và số lượng vé
            fullName,
            email,
            phone,
            totalPrice,
            status: "pending",
        });

        await newOrder.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${CLIENT_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${CLIENT_URL}/verify?success=false&orderId=${newOrder._id}`,
            metadata: { orderId: newOrder._id.toString() },
        });

        res.json({ success: true, message: "Order placed!", sessionUrl: session.url });

    } catch (error) {
        console.error('Stripe Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process payment'
        });
    }
};

const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Atomically check & mark the order as processing
    const order = await orderModel.findOneAndUpdate(
      {
        _id: orderId,
        status: "pending",
        userTickets: { $size: 0 }
      },
      { status: "processing" },
      { new: true, runValidators: true }
    )
      .populate("tickets.ticketType")
      .populate("eventId");

    if (!order) {
      const existingOrder = await orderModel.findById(orderId)
        .populate("tickets.ticketType")
        .populate("eventId");

      if (!existingOrder) {
        return res.status(404).json({ success: false, message: "Order not found." });
      }

      return res.json({
        success: true,
        message: "Order already processed.",
        data: existingOrder
      });
    }

    let createdUserTickets = [];

    for (const ticketItem of order.tickets) {
      const updatedTicket = await ticketModel.findOneAndUpdate(
        {
          _id: ticketItem.ticketType,
          availableSeats: { $gte: ticketItem.quantity }
        },
        {
          $inc: {
            availableSeats: -ticketItem.quantity,
            ticketsSold: ticketItem.quantity
          }
        },
        { new: true }
      );

      if (!updatedTicket) {
        await orderModel.findByIdAndUpdate(orderId, { status: "pending" });
        return res.status(400).json({
          success: false,
          message: `Not enough available seats for ticket type: ${ticketItem.ticketType}`
        });
      }

      // After update, mark ticket as sold_out if necessary
      if (updatedTicket.availableSeats === 0 && updatedTicket.status !== "sold_out") {
        updatedTicket.status = "sold_out";
        await updatedTicket.save();
      }

      const userTicketsToCreate = Array(ticketItem.quantity).fill().map(() => ({
        ticketType: updatedTicket._id,
        eventId: order.eventId,
        ownerId: order.userId,
        orderId: order._id
      }));

      const newUserTickets = await userTicketModel.insertMany(userTicketsToCreate);
      createdUserTickets.push(...newUserTickets.map(ticket => ticket._id));
    }

    const finalOrder = await orderModel.findOneAndUpdate(
      { _id: orderId, status: "processing" },
      {
        status: "paid",
        userTickets: createdUserTickets
      },
      { new: true }
    );

    if (!finalOrder) {
      throw new Error('Failed to update order status to paid');
    }

    res.json({
      success: true,
      message: "Payment confirmed and tickets issued successfully!",
      data: finalOrder
    });

  } catch (error) {
    console.error("🚨 Error in confirmPayment:", error);
    await orderModel.findOneAndUpdate(
      { _id: req.body.orderId, status: "processing" },
      { status: "pending" }
    );
    res.status(500).json({ success: false, message: "Internal server error." });
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
