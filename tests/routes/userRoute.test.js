const request = require("supertest");
const app = require("../../app");
const UserModel = require("../../src/models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../src/models/user.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Routes", () => {
  it("POST /api/users/register should register a new user", async () => {
    const newUser = { username: "testuser", password: "password" };
    const hashedPassword = "hashedpassword";
    bcrypt.hash.mockResolvedValue(hashedPassword);
    UserModel.prototype.save.mockResolvedValue({
      ...newUser,
      password: hashedPassword,
    });

    const response = await request(app)
      .post("/api/users/register")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      username: "testuser",
      password: hashedPassword,
    });
  });

  it("POST /api/users/register should handle errors", async () => {
    const error = new Error("Database Error");
    UserModel.prototype.save.mockRejectedValue(error);

    const response = await request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "password" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("POST /api/users/login should login a user", async () => {
    const user = {
      _id: "123",
      username: "testuser",
      password: "hashedpassword",
    };
    UserModel.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    const token = "testtoken";
    jwt.sign.mockReturnValue(token);

    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "password" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token });
  });

  it("POST /api/users/login should handle invalid credentials", async () => {
    UserModel.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "password" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid username or password");
  });

  it("POST /api/users/login should handle errors", async () => {
    const error = new Error("Database Error");
    UserModel.findOne.mockRejectedValue(error);

    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "password" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal Server Error");
  });
});
