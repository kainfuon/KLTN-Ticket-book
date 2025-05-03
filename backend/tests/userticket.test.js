import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import userTicketModel from "../models/userTicketModel.js";
import ticketModel from "../models/ticketModel.js";
import eventModel from "../models/eventModel.js";
import bcrypt from "bcrypt";

let mongoServer;
let token;
let userId;
let ticketId;
let userTicketId;
let eventId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });
  
  beforeEach(async () => {
    // Clear dữ liệu
    await Promise.all([
      userModel.deleteMany({}),
      eventModel.deleteMany({}),
      ticketModel.deleteMany({}),
      userTicketModel.deleteMany({})
    ]);
  
    // ✅ Hash mật khẩu trước khi tạo user
    const hashedPassword = await bcrypt.hash("123456", 10);
    const user = await userModel.create({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    });
  
    userId = user._id;
    token = jwt.sign({ userId, role: "user" }, "your_secret_key", { expiresIn: "1h" });
  
    const event = await eventModel.create({
      title: "Test Event",
      eventDate: new Date(),
      saleStartDate: new Date(),
      venue: "Test Venue",
      image: "test.jpg",
      category: "Âm nhạc",
      description: "Test Event Description",
      status: "ongoing",
    });
    eventId = event._id;
  
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
  
    const userTicket = await userTicketModel.create({
      ownerId: userId,
      ticketType: ticketId,
      eventId,
    });
    userTicketId = userTicket._id;
});
  

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("🎫 User Ticket Controller Tests", () => {
  it("GET /api/userTicket/my-tickets - should return all user tickets", async () => {
    const res = await request(app)
      .get("/api/userTicket/my-tickets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]._id).toBe(userTicketId.toString());
  });

  it("GET /api/userTicket/:ticketId - should return ticket details", async () => {
    const res = await request(app)
      .get(`/api/userTicket/${userTicketId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(userTicketId.toString());
  });

  it("GET /api/userTicket/:ticketId/qr - should generate QR code", async () => {
    const res = await request(app)
      .get(`/api/userTicket/${userTicketId}/qr`)  // Sửa thành GET thay vì POST
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.qrCode).toBeDefined();
  });
  

  it("POST /api/userTicket/:ticketId/trade - should trade ticket", async () => {
    // ✅ Hash password cho recipient
    const hashedRecipientPassword = await bcrypt.hash("654321", 10);
    const recipient = await userModel.create({
      name: "Recipient User",
      email: "recipient@example.com",
      password: hashedRecipientPassword,
    });
  
    const res = await request(app)
      .post(`/api/userTicket/${userTicketId}/trade`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        recipientEmail: recipient.email,
        password: "123456", // plain password (đã được hash bên trên cho user gửi)
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Ticket successfully transferred.");
    expect(res.body.recipientEmail).toBe(recipient.email);
  
    const updatedTicket = await userTicketModel.findById(userTicketId);
    expect(updatedTicket.ownerId.toString()).toBe(recipient._id.toString());
  });
   
});
