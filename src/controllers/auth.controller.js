const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const isEmailExist = await userModel.findOne({ email });

    if (isEmailExist) {
      res.status(400).json({ message: `Email already exists!` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      email,
      password: hashedPassword,
    });

    console.log(user);
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log(error.message);
    next(error);
    // res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(401).json({ message: "Invalid EMAIL/PASSWORD!" });
    }
    const user = await userModel.findOne({ email });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid EMAIL/PASSWORD!" });
    }

    // res.status(200).json({ message: "LOGIN successful!" });

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY || helloworld,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "LOGIN SUCCESSFUL",
      email: user.email,
      token,
      expiresIn: "1hr",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = { register, login };
