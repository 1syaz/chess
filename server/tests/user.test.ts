import supertest from "supertest";
import app from "../src/app";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
} from "./test-utils/MongoMemoryServerSetup";
import { User } from "../src/models/userModel";

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
    it("should create a new user and return 201", async () => {
      const res = await supertest(app).post("/api/v1/users").send({
        username: "testuser",
        email: "test@example.com",
        password: "123456",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created");
    });

    it("should return 400 for invalid input", async () => {
      const res = await supertest(app).post("/api/v1/users").send({
        username: "ps", // username less then 4
        email: "invalid-email", // invalid-email
        password: "pass",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid request body for creating user");
    });

    it("should return 409 if user exists", async () => {
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
});
