import eventModel from "../models/eventModel.js";

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
