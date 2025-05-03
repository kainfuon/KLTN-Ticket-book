import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userModel from "../models/userModel.js"; // Mô hình người dùng của bạn
import eventModel from '../models/eventModel.js'; // Mô hình sự kiện của bạn
import fs from 'fs';
import { fileURLToPath } from 'url';  // Import module này
import path from 'path';
import jwt from 'jsonwebtoken'; // Đảm bảo bạn đã import jwt

// Đoạn này thay thế cho __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongoServer;
let adminToken; // Biến lưu trữ token của admin

beforeAll(async () => {
    // Thiết lập MongoDB in-memory server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    // Tạo tài khoản admin
    const adminUser = new userModel({
      name: "admin",
      email: "admin@gmail.com",
      password: "admin_password",
      role: "admin"
    });
  
    await adminUser.save();
  
    // Tạo token thủ công cho admin
    const adminPayload = { userId: adminUser._id, role: "admin" };
    adminToken = jwt.sign(adminPayload, "your_secret_key", { expiresIn: "1h" });
  });

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Event Controller", () => {
    let createdEventId;
  
    describe("POST /api/event/add", () => {
        it("should add a new event (admin only)", async () => {
            const eventData = {
            title: "Music Concert",
            description: "A live music concert",
            eventDate: new Date("2025-12-01"),
            saleStartDate: new Date("2025-10-01"),
            venue: "Concert Hall",
            category: "Âm nhạc"
            };
    
            const res = await request(app)
            .post("/api/event/add")
            .set("Authorization", `Bearer ${adminToken}`)
            .field("title", eventData.title)
            .field("description", eventData.description)
            .field("eventDate", eventData.eventDate.toISOString())
            .field("saleStartDate", eventData.saleStartDate.toISOString())
            .field("venue", eventData.venue)
            .field("category", eventData.category)
            .attach("image", path.join(__dirname, "1745922053037-sakura.jpg"));
    
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Event added successfully!");
            expect(res.body.data).toHaveProperty("title", "Music Concert");
    
            // Lưu lại ID cho các test sau
            createdEventId = res.body.data._id;
        });
    });
  
    describe("GET /api/event/:id", () => {
        it("should return event detail", async () => {
            const res = await request(app).get(`/api/event/${createdEventId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty("_id", createdEventId);
        });
    });
  
    describe("PUT /api/event/update/:id", () => {
        it("should update event (admin only)", async () => {
            const res = await request(app)
            .put(`/api/event/update/${createdEventId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .field("title", "Updated Title")
            .field("venue", "Updated Venue")
            .attach("image", path.join(__dirname, "1745922053037-sakura.jpg"));
    
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe("Updated Title");
            expect(res.body.data.venue).toBe("Updated Venue");
        });
    });
  
    describe("DELETE /api/event/remove/:id", () => {
        it("should delete event (admin only)", async () => {
            const res = await request(app)
            .delete(`/api/event/remove/${createdEventId}`)
            .set("Authorization", `Bearer ${adminToken}`);
    
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain("Event Removed");
    
            const check = await eventModel.findById(createdEventId);
            expect(check).toBeNull();
        });
    });
    describe("Event Controller - Unauthorized Access", () => {
        it("POST /api/event/add - should fail without token", async () => {
          const res = await request(app)
            .post("/api/event/add")
            .send({
              title: "Unauthorized Event",
              description: "This should fail",
              eventDate: new Date().toISOString(),
              saleStartDate: new Date().toISOString(),
              venue: "Unauthorized Venue",
              category: "Âm nhạc"
            });
      
          expect(res.statusCode).toBe(401);
          expect(res.body.message).toMatch(/no token/i);
        });
      
        it("PUT /api/event/update/:id - should fail without token", async () => {
          const dummyId = new mongoose.Types.ObjectId();
          const res = await request(app)
            .put(`/api/event/update/${dummyId}`)
            .send({
              title: "Attempted Update Without Token",
              venue: "Nowhere"
            });
      
          expect(res.statusCode).toBe(401);
          expect(res.body.message).toMatch(/no token/i);
        });
      
        it("DELETE /api/event/remove/:id - should fail without token", async () => {
          const dummyId = new mongoose.Types.ObjectId();
          const res = await request(app).delete(`/api/event/remove/${dummyId}`);
      
          expect(res.statusCode).toBe(401);
          expect(res.body.message).toMatch(/no token/i);
        });
    });      
      
});
  

