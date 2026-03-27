import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET || "hillSmartSecret";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const validRoles = ["farmer", "tractor_owner"];
    const finalRole = validRoles.includes(role) ? role : "farmer";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id, // Number custom field
        _id: user._id, // Mongo ObjectId
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔴 VALIDATION
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    console.log("🔐 Login attempt:", email);

    // 🔍 FIND USER
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "User not found" });
    }

    // 🔑 PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("🔑 Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // 🔐 GENERATE TOKEN with BOTH id and _id
    const token = jwt.sign(
      { 
        id: user.id, // Number
        _id: user._id.toString(), // ObjectId string
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ RESPONSE with BOTH fields
    res.status(200).json({
      token,
      user: {
        id: user.id, // Number for frontend filter
        _id: user._id, // ObjectId for Mongo refs
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({ message: "If email exists, link sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    });

    res.json({ message: "Reset link sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

