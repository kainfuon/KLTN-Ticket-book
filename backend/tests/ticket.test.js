import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import eventModel from "../models/eventModel.js";
import ticketModel from "../models/ticketModel.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import userModel from "../models/userModel.js"; // Mô hình người dùng của bạn
import jwt from 'jsonwebtoken'; // Đảm bảo bạn đã import jwt

let mongoServer;
let token;
let event;
let eventId;

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
  token = jwt.sign(adminPayload, "your_secret_key", { expiresIn: "1h" });
});


beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();

  // Tạo sự kiện mới cho mỗi lần test
  event = await eventModel.create({
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
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("🎟️ Ticket Controller", () => {
    it("POST /api/ticket/add - should add a ticket", async () => {
    const res = await request(app)
      .post("/api/ticket/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        eventId,
        type: "VIP",
        price: 500,
        totalSeats: 100,
      });

    console.log("ADD response:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.type).toBe("VIP");
    expect(res.body.data.eventId).toBe(eventId.toString());
    });

  it("PUT /api/ticket/update/:ticketId - should update ticket", async () => {
    const ticket = await ticketModel.create({
      eventId,
      type: "Standard",
      price: 100,
      totalSeats: 50,
      availableSeats: 50,
      ticketsSold: 0,
      status: "available",
    });
  
    // Đảm bảo ticket đã được tạo và sử dụng đúng ticket ID
    console.log("🔍 PATCH ticketId:", ticket._id);

    const res = await request(app)
      .put(`/api/ticket/update/${ticket._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 350, totalSeats: 60 });
  
    // Kiểm tra phản hồi
    expect(res.statusCode).toBe(200); // Kiểm tra status code
    expect(res.body.data.price).toBe(350); // Kiểm tra giá
    expect(res.body.data.totalSeats).toBe(60); // Kiểm tra số ghế
  });
  

  it("DELETE /api/ticket/delete/:ticketId - should delete ticket if not sold", async () => {
    const ticket = await ticketModel.create({
      eventId,
      type: "Standard",
      price: 200,
      totalSeats: 20,
      availableSeats: 20,
      ticketsSold: 0,
      status: "available",
    });

    const res = await request(app)
      .delete(`/api/ticket/delete/${ticket._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("Ticket deleted");
  });

  it("GET /api/ticket/event/:eventId - should get tickets for an event", async () => {
    await ticketModel.create({
      eventId,
      type: "Regular",
      price: 250,
      totalSeats: 100,
      availableSeats: 100,
      ticketsSold: 0,
      status: "available",
    });

    const res = await request(app).get(`/api/ticket/event/${eventId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  describe("🔒 Ticket Controller - Unauthorized Access", () => {
    it("❌ POST /api/ticket/add - should fail without token", async () => {
      const res = await request(app)
        .post("/api/ticket/add")
        .send({
          eventId,
          type: "VIP",
          price: 500,
          totalSeats: 100,
        });
  
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Access denied. No token provided.");
    });
  
    it("❌ PUT /api/ticket/update/:ticketId - should fail without token", async () => {
      const ticket = await ticketModel.create({
        eventId,
        type: "Standard",
        price: 100,
        totalSeats: 50,
        availableSeats: 50,
        ticketsSold: 0,
        status: "available",
      });
  
      const res = await request(app)
        .put(`/api/ticket/update/${ticket._id}`)
        .send({ price: 350 });
  
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Access denied. No token provided.");

    });
  
    it("❌ DELETE /api/ticket/delete/:ticketId - should fail without token", async () => {
      const ticket = await ticketModel.create({
        eventId,
        type: "Standard",
        price: 200,
        totalSeats: 20,
        availableSeats: 20,
        ticketsSold: 0,
        status: "available",
      });
  
      const res = await request(app)
        .delete(`/api/ticket/delete/${ticket._id}`);
  
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Access denied. No token provided.");
    });
  });
  
});
