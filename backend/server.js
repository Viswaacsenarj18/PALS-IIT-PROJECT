// ✅ LOAD ENV FIRST (VERY IMPORTANT)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import cors from "cors";

import tractorRoutes from "./routes/tractorRoutes.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import nodeRoutes from "./routes/nodeRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// ✅ DEBUG (optional)
console.log("🔐 JWT SECRET:", process.env.JWT_SECRET);

// ❗ SAFETY CHECK (prevents crash confusion)
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing in .env");
  process.exit(1);
}

const app = express();

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://hillssmartfarming.vercel.app",
    "https://pals-iit-project.onrender.com"
  ],
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ Mongo Error:", err.message);
  });

// ✅ Routes
app.use("/api/tractors", tractorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/nodes", nodeRoutes);
app.use("/api/products", productRoutes);

// ✅ Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Message required" });
    }

    const response = await axios.post(
      "http://51.21.181.68:5678/webhook/chat",
      { message: userMessage }
    );

    res.json({
      reply:
        response.data.reply ||
        response.data.output ||
        response.data.message ||
        "No response",
    });

  } catch (error) {
    console.error("❌ Chat error:", error.message);
    res.status(500).json({
      reply: "⚠️ AI service unavailable",
    });
  }
});

// ✅ Start Server
const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log("✅ CORS enabled for local + production domains");
});