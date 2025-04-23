import eventModel from "../models/eventModel.js";
import fs from 'fs'
import path from "path";

// add event
const addEvent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded." });
        }

        const { title, description, eventDate, saleStartDate, venue, status } = req.body;
        const tempImagePath = req.file.path; // Ảnh đang nằm trong temp_uploads/
        const finalImagePath = path.join("uploads", req.file.filename); // Đích đến

        // Tạo event trong database
        const event = new eventModel({
            title,
            description,
            eventDate,
            saleStartDate,
            venue,
            status: status || "ongoing",
            category,
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
  
      // Find the existing event
      const existingEvent = await eventModel.findById(eventId);
      if (!existingEvent) {
        // If image was uploaded, delete it from temp
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.log("Error deleting temp image:", err);
          });
        }
        return res.status(404).json({ success: false, message: "Event not found." });
      }
  
      // Get update data from request body
      const { title, description, eventDate, saleStartDate, venue, category, status } = req.body;
  
      // Prepare update data
      const updateData = {
        title: title || existingEvent.title,
        description: description || existingEvent.description,
        eventDate: eventDate || existingEvent.eventDate,
        saleStartDate: saleStartDate || existingEvent.saleStartDate,
        venue: venue || existingEvent.venue,
        category: category || existingEvent.category,
        status: status || existingEvent.status
      };
  
      // Handle image update if new image is uploaded
      if (req.file) {
        const tempImagePath = req.file.path;
        const finalImagePath = path.join("uploads", req.file.filename);
  
        // Delete old image if it exists
        if (existingEvent.image) {
          const oldImagePath = path.join("uploads", existingEvent.image);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.log("Error deleting old image:", err);
          });
        }
  
        // Move new image from temp to uploads
        fs.rename(tempImagePath, finalImagePath, (err) => {
          if (err) console.log("Error moving file:", err);
        });
  
        // Update image filename in database
        updateData.image = req.file.filename;
      }
  
      // Update event in database
      const updatedEvent = await eventModel.findByIdAndUpdate(
        eventId,
        updateData,
        { new: true, runValidators: true }
      );
  
      res.json({
        success: true,
        message: "Event updated successfully!",
        data: updatedEvent
      });
  
    } catch (error) {
      console.log("Error updating event:", error);
  
      // If error occurs and new image was uploaded, delete it from temp
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.log("Error deleting temp image:", err);
        });
      }
  
      res.status(500).json({
        success: false,
        message: "Error updating event."
      });
    }
  };
  


export { addEvent, getlistEvent, getEventDetail, removeEvent , updateEvent };
