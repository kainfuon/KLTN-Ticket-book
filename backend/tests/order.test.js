import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import eventModel from "../models/eventModel.js";
import ticketModel from "../models/ticketModel.js";
import orderModel from "../models/orderModel.js";
import userTicketModel from "../models/userTicketModel.js";

let mongoServer;
let token;
let userId;
let eventId;
let ticketId;
let orderId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create user
  const user = await userModel.create({
    name: "Test User",
    email: "test@example.com",
    password: "123456",
  });
  userId = user._id;
  token = jwt.sign({ userId: user._id }, "your_secret_key", { expiresIn: "1h" });

  // Create event
  const event = await eventModel.create({
    title: "Test Event",
    description: "Description",
    eventDate: new Date("2025-12-01"),
    saleStartDate: new Date("2025-11-01"),
    venue: "Stadium",
    image: "dummy.jpg",
    category: "Thể thao",
    status: "ongoing"
  });
  eventId = event._id;

  // Create ticket with totalSeats
  const ticket = await ticketModel.create({
    eventId,
    type: "Standard",
    price: 50,
    availableSeats: 10,
    ticketsSold: 0,
    status: "available",
    totalSeats: 10,  // Cung cấp giá trị cho totalSeats
  });
  ticketId = ticket._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Order Controller Tests", () => {

  it("POST /api/order/confirm - should confirm payment and update order status to paid", async () => {
    // Create a pending order for the user
    const order = await orderModel.create({
      userId,
      eventId,
      tickets: [{ ticketType: ticketId, quantity: 2 }],
      fullName: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      totalPrice: 100,
      status: "pending",
    });

    const res = await request(app)
      .post("/api/order/confirm")
      .set("Authorization", `Bearer ${token}`)
      .send({ orderId: order._id });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("paid");

    // Kiểm tra trong cơ sở dữ liệu để xác nhận đơn hàng đã được cập nhật
    const updatedOrder = await orderModel.findById(order._id);
    expect(updatedOrder.status).toBe("paid");

    // Kiểm tra số lượng vé người dùng đã nhận
    const userTickets = await userTicketModel.find({ orderId: order._id });
    expect(userTickets.length).toBe(2);
  });

//   it("GET /api/order/user/my-orders - should return list of user's orders", async () => {
//     // Create a pending order for the user
//     const order = await orderModel.create({
//       userId,
//       eventId,
//       tickets: [{ ticketType: ticketId, quantity: 2 }],
//       fullName: "John Doe",
//       email: "john@example.com",
//       phone: "123456789",
//       totalPrice: 100,
//       status: "pending",
//     });

//     const res = await request(app)
//       .get("/api/order/user/my-orders")
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data.length).toBeGreaterThan(0);
//     expect(res.body.data[0]._id.toString()).toBe(order._id.toString());
//   });

//   it("GET /api/order/:orderId - should return order detail", async () => {
//     const order = await orderModel.create({
//       userId,
//       eventId,
//       tickets: [{ ticketType: ticketId, quantity: 2 }],
//       fullName: "John Doe",
//       email: "john@example.com",
//       phone: "123456789",
//       totalPrice: 100,
//       status: "pending",
//     });
  
//     const res = await request(app)
//       .get(`/api/order/${order._id}`)
//       .set("Authorization", `Bearer ${token}`);
  
//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data._id.toString()).toBe(order._id.toString());
  
//     // Check populated ticketType inside the tickets array
//     expect(res.body.data.tickets[0].ticketType).toBeDefined();
//   });

});
