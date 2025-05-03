import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import userModel from '../models/userModel.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  await userModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Controller', () => {
  describe('POST /api/user/register', () => {
    it('should register a user successfully', async () => {
      const res = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'user'
        });

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User registered successfully');
    });

    it('should not register with an existing email', async () => {
      await userModel.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user'
      });

      const res = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'user'
        });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email already registered');
    });

    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
          role: 'user'
        });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email');
    });

    it('should validate password length', async () => {
      const res = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'short',
          role: 'user'
        });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Password must be at least 8 characters long');
    });
  });

  describe('POST /api/user/login', () => {
    beforeEach(async () => {
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.default.hash('password123', 10);
      await userModel.create({
        name: 'Login User',
        email: 'login@example.com',
        password: hashedPassword,
        role: 'user'
      });
    });

    it('should login successfully and return token', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.role).toBe('user');
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpass'
        });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: 'notfound@example.com',
          password: 'password123'
        });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });

  describe('GET /api/user/info', () => {
    it('should return user info with valid token', async () => {
      const user = await userModel.create({
        name: 'Info User',
        email: 'info@example.com',
        password: 'irrelevant',
        role: 'user'
      });

      const token = jwt.sign({ userId: user._id, role: 'user' }, 'your_secret_key', { expiresIn: '1h' });

      const res = await request(app)
        .get('/api/user/info')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('info@example.com');
      expect(res.body.data.password).toBeUndefined(); // password should not be returned
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/api/user/info');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
