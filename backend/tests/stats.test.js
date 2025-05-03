import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import eventModel from "../models/eventModel.js";
import ticketModel from "../models/ticketModel.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import userModel from "../models/userModel.js"; // Mô hình người dùng của bạn
import jwt from "jsonwebtoken"; // Đảm bảo bạn đã import jwt

let mongoServer;
let adminToken;
let eventId;
let ticketId;

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
    role: "admin",
  });

  await adminUser.save();

  // Tạo token thủ công cho admin
  const adminPayload = { userId: adminUser._id, role: "admin" };
  adminToken = jwt.sign(adminPayload, "your_secret_key", { expiresIn: "1h" });

  // Tạo sự kiện
  const event = await eventModel.create({
    title: "Test Concert",
    description: "Test Event Description",
    eventDate: new Date("2025-05-10"),
    saleStartDate: new Date("2025-04-01"),
    venue: "Test Venue",
    image: "test.jpg",
    status: "ongoing",
    category: "Âm nhạc",
  });
  eventId = event._id;

  // Tạo vé cho sự kiện
  const ticket = await ticketModel.create({
    eventId,
    type: "Standard",
    price: 50,
    availableSeats: 10,
    ticketsSold: 0,
    status: "available",
    totalSeats: 10,
  });
  ticketId = ticket._id;
});

describe("Event Sales Stats Controller", () => {
  describe("GET /api/stats/event-sales - With Token", () => {
    it("should return sales stats for all events", async () => {
      const res = await request(app)
        .get("/api/stats/events")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty("eventId");
      expect(res.body[0]).toHaveProperty("eventTitle");
      expect(res.body[0]).toHaveProperty("ticketsTotal");
      expect(res.body[0]).toHaveProperty("ticketsSold");
      expect(res.body[0]).toHaveProperty("totalRevenue");
    });
  });

  describe("GET /api/stats/event-sales - Without Token", () => {
    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/stats/events");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token/i);
    });
  });
});

describe("Ticket Type Sales Stats Controller", () => {
  describe("GET /api/stats/ticket-sales/:eventId - With Token", () => {
    it("should return sales stats for a specific event's ticket types", async () => {
      const res = await request(app)
        .get(`/api/stats/tickets/${eventId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty("eventId");
      expect(res.body[0]).toHaveProperty("ticketType");
      expect(res.body[0]).toHaveProperty("ticketsSold");
      expect(res.body[0]).toHaveProperty("totalRevenue");
    });
  });

  describe("GET /api/stats/ticket-sales/:eventId - Without Token", () => {
    it("should return 401 without token", async () => {
      const res = await request(app)
        .get(`/api/stats/tickets/${eventId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/no token/i);
    });
  });

  
  
});
