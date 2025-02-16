import eventModel from "../models/eventModel.js";
import fs from 'fs'
import path from "path";

// add event

// add event
const addEvent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded." });
        }

        const { title, description, eventDate, venue, status } = req.body;
        const tempImagePath = req.file.path; // Ảnh đang nằm trong temp_uploads/
        const finalImagePath = path.join("uploads", req.file.filename); // Đích đến

        // Tạo event trong database
        const event = new eventModel({
            title,
            description,
            eventDate,
            venue,
            status: status || "ongoing",
            image: req.file.filename // Chỉ lưu tên file vào database
        });

        await event.save();

        // Nếu lưu thành công, di chuyển file từ temp_uploads → uploads
        fs.rename(tempImagePath, finalImagePath, (err) => {
            if (err) console.log("Error moving file:", err);
        });

        res.json({ success: true, message: "Event added successfully!", data: event });

    } catch (error) {
        console.log(error);

        // Nếu lỗi xảy ra, xóa ảnh trong temp_uploads
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.log("Error deleting image:", err);
            });
        }

        res.status(500).json({ success: false, message: "Error adding event." });
    }
};


// Get event list
const getlistEvent = async (req, res) => {
    try {
        const events = await eventModel.find({});
        res.json({ success: true, data: events });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching events" });
    }
};

// Get event detail
const getEventDetail = async (req, res) => {
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) {
            return res.json({ success: false, message: "Event not found" });
        }
        res.json({ success: true, data: event });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching event details" });
    }
};

// Remove event
const removeEvent = async (req, res) => {
    try {
        const event = await eventModel.findById(req.body.id);
        if (event && event.image) {
            fs.unlink(`uploads/${event.image}`, () => {});
        }
        await eventModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Event Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing event" });
    }
};


// Cập nhật thông tin sự kiện (hỗ trợ cập nhật ảnh)
const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, description, eventDate, venue, status } = req.body;
        const imageFile = req.file; // Ảnh mới (nếu có)

        console.log("Received Event ID:", eventId); // Debugging
        console.log("Uploaded Image:", imageFile?.filename); // Debugging

        // Kiểm tra sự kiện có tồn tại không
        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        // Nếu có ảnh mới, xoá ảnh cũ
        if (imageFile) {
            if (event.image) {
                const oldImagePath = `uploads/${event.image}`;
                fs.access(oldImagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(oldImagePath, (unlinkErr) => {
                            if (unlinkErr) console.log("Error deleting old image:", unlinkErr);
                        });
                    }
                });
            }
            event.image = imageFile.filename; // Cập nhật ảnh mới
        }

        // Cập nhật thông tin khác
        event.title = title || event.title;
        event.description = description || event.description;
        event.eventDate = eventDate || event.eventDate;
        event.venue = venue || event.venue;
        event.status = status || event.status;

        const updatedEvent = await event.save();

        res.json({ success: true, message: "Event updated successfully!", data: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


export { addEvent, getlistEvent, getEventDetail, removeEvent , updateEvent };
