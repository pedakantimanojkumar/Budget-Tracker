import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validateEmail } from "../utils/validators.js";
import AppError from "../utils/AppError.js";

// SIGNUP
export const signup = async (req, res, next) => {
  try {
    let { email, password, name } = req.body;

    email = email?.trim().toLowerCase();
    name = name?.trim();

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    if (!validateEmail(email)) {
      throw new AppError("Invalid email format", 400);
    }

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      name,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });

  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    if (!validateEmail(email)) {
      throw new AppError("Invalid email format", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (err) {
    next(err);
  }
};