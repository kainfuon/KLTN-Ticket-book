import eventModel from "../models/eventModel.js";
import userTicketModel from "../models/userTicketModel.js"; 

export const updateEventStatus = async () => {
  try {
    const now = new Date();

    const result = await eventModel.updateMany(
      { eventDate: { $lt: now }, status: "ongoing" },
      { $set: { status: "completed" } }
    );

    console.log(`[CRON] Cập nhật sự kiện: ${result.modifiedCount} sự kiện đã chuyển sang "completed"`);
  } catch (error) {
    console.error("[CRON] Lỗi khi cập nhật trạng thái sự kiện:", error);
  }
};


// Hàm kiểm tra vé quá 24h mà chưa được chấp nhận
export const checkPendingTrades = async () => {
  try {
      const now = new Date();
      const tickets = await userTicketModel.find({
          isPendingTrade: true,
          pendingTradeCreatedAt: { $lt: new Date(now - 24 * 60 * 60 * 1000) }  // Vé đã quá 24 giờ
      });

      // Duyệt qua từng vé để hoàn trả lại cho người gửi
      for (const ticket of tickets) {
          // Đặt lại trạng thái trade
          ticket.isPendingTrade = false;
          ticket.pendingRecipient = null;  // Xóa thông tin người nhận
          ticket.pendingTradeCreatedAt = null;  // Xóa thời gian trade

          // Lưu lại thay đổi
          await ticket.save();
          console.log(`Ticket ${ticket._id} has been reverted to owner ${ticket.ownerId}`);
      }
      console.log(`${tickets.length} tickets have been reverted to their original owners.`);
  } catch (error) {
      console.error('Error checking pending trades:', error);
  }
};

import orderModel from "../models/orderModel.js"; // đường dẫn đến orderModel

export const cancelExpiredOrders = async () => {
  try {
    const now = new Date();
    const expiryTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // trừ 24h

    // Tìm các đơn pending quá hạn
    const expiredOrders = await orderModel.find({
      status: "pending",
      createdAt: { $lt: expiryTime }
    });

    if (expiredOrders.length > 0) {
      const ids = expiredOrders.map(order => order._id);

      await orderModel.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "cancelled" } }
      );

      console.log(`✅ Đã hủy ${expiredOrders.length} đơn hàng quá hạn.`);
    } else {
      console.log("✅ Không có đơn hàng nào quá hạn.");
    }
  } catch (err) {
    console.error("❌ Lỗi khi hủy đơn hàng quá hạn:", err);
  }
};

