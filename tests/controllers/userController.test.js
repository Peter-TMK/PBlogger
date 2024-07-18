const { register, login } = require("../../src/controllers/auth.controller");
const UserModel = require("../../src/models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../src/models/user.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  it("should register a new user", async () => {
    const req = { body: { username: "testuser", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const hashedPassword = "hashedpassword";
    bcrypt.hash.mockResolvedValue(hashedPassword);

    const savedUser = { username: "testuser", password: hashedPassword };
    UserModel.prototype.save.mockResolvedValue(savedUser);

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedUser);
  });

  it("should handle errors in register", async () => {
    const req = { body: { username: "testuser", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const error = new Error("Database Error");
    UserModel.prototype.save.mockRejectedValue(error);

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should login a user", async () => {
    const req = { body: { username: "testuser", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const user = {
      _id: "123",
      username: "testuser",
      password: "hashedpassword",
    };
    UserModel.findOne.mockResolvedValue(user);

    bcrypt.compare.mockResolvedValue(true);

    const token = "testtoken";
    jwt.sign.mockReturnValue(token);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token });
  });

  it("should handle invalid login credentials", async () => {
    const req = { body: { username: "testuser", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    UserModel.findOne.mockResolvedValue(null);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid username or password",
    });
  });

  it("should handle errors in loginUser", async () => {
    const req = { body: { username: "testuser", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const error = new Error("Database Error");
    UserModel.findOne.mockRejectedValue(error);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
