import supertest from "supertest";
import app from "../src/app";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
} from "./test-utils/MongoMemoryServerSetup";
import { User } from "../src/models/userModel";
import { ObjectId } from "mongoose";

jest.setTimeout(30_000);

describe("User API", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("Create user", () => {
    it("should create a new user", async () => {
      const res = await supertest(app).post("/api/v1/users").send({
        username: "testuser",
        email: "test@example.com",
        password: "123456",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created");
    });

    it("should fail with 400 for invalid input", async () => {
      const res = await supertest(app).post("/api/v1/users").send({
        username: "ps", // username less then 4
        email: "invalid-email", // invalid-email
        password: "pass",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid request body for creating user");
    });

    it("should return 409 if user already exists", async () => {
      await User.create({
        username: "existing",
        email: "exists@example.com",
        password: "123456",
      });

      const res = await supertest(app).post("/api/v1/users").send({
        username: "newuser",
        email: "exists@example.com",
        password: "password",
      });

      expect(res.status).toBe(409);
    });
  });

  describe("Login user", () => {
    it("should log in a valid user", async () => {
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "password",
      });

      const res = await supertest(app).post("/api/v1/users/login").send({
        username: "testuser",
        password: "password",
      });

      expect(res.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringContaining("accessToken"),
          expect.stringContaining("refreshToken"),
        ])
      );

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({
        _id: (user._id as ObjectId).toString(),
        username: user.username,
        email: user.email,
      });
    });

    it("should return 401 for incorrect password", async () => {
      await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "password",
      });

      const res = await supertest(app).post("/api/v1/users/login").send({
        username: "testuser",
        password: "password1",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid user credentials");
    });

    it("should return 401 if user does not exist", async () => {
      await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "password",
      });

      const res = await supertest(app).post("/api/v1/users/login").send({
        username: "usertest",
        password: "password",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("User not found, Invalid credentials");
    });
  });
});
