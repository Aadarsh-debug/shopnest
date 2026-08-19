import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import Otp from "../models/Otp.js";

const generateWebToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY || "shopnest_fallback_secret", { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User with this email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashedPass,
      verified: true, // Default to true for smooth onboarding & testing
    });

    if (user) {
      // Optional OTP notification in background
      try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        await Otp.create({ email, otp });
        sendEmail({
          email: user.email,
          subject: "Welcome to ShopNest",
          message: `<h2>Welcome to ShopNest, ${name}!</h2><p>Your verification code is: <strong>${otp}</strong></p>`,
        }).catch(() => {});
      } catch (e) {}

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateWebToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateWebToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpExist = await Otp.findOne({
      email,
      otp,
    });
    if (!otpExist) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.verified = true;
    await user.save();
    await Otp.deleteMany({ email });
    return res.status(200).json({
      message: "Account verified successfully",
      token: generateWebToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
