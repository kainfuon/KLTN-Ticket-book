import eventModel from "../models/eventModel.js";
import ticketModel from "../models/ticketModel.js";

// Thống kê số vé đã bán & doanh thu theo từng sự kiện
const getEventSalesStats = async (req, res) => {
    try {
        const events = await eventModel.find({}, "_id title saleStartDate");

        const salesStats = await Promise.all(events.map(async (event) => {
            const tickets = await ticketModel.find({ eventId: event._id });
            let totalTickets = tickets.reduce((sum, ticket) => sum + ticket.totalSeats, 0);
            let totalTicketsSold = tickets.reduce((sum, ticket) => sum + ticket.ticketsSold, 0);
            let totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.ticketsSold * ticket.price, 0);

            return {
                eventId: event._id,
                eventTitle: event.title,
                saleStartDate: event.saleStartDate,
                ticketsTotal: totalTickets,
                ticketsSold: totalTicketsSold,
                totalRevenue
            };
        }));

        res.json(salesStats);
    } catch (error) {
        console.error("Lỗi thống kê sự kiện:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Thống kê số vé đã bán & doanh thu theo từng loại vé trong một sự kiện
const getTicketTypeSalesStats = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await eventModel.findById(eventId, "title saleStartDate");
        if (!event) {
            return res.status(404).json({ message: "Sự kiện không tồn tại" });
        }

        const tickets = await ticketModel.find({ eventId });

        const ticketStats = tickets.map(ticket => ({
            eventId: event._id,
            eventTitle: event.title,
            saleStartDate: event.saleStartDate,
            ticketType: ticket.type,
            ticketsSold: ticket.ticketsSold,
            totalRevenue: ticket.ticketsSold * ticket.price
        }));

        res.json(ticketStats);
    } catch (error) {
        console.error("Lỗi thống kê loại vé:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export { getEventSalesStats, getTicketTypeSalesStats };
