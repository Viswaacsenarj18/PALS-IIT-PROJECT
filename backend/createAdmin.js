import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    // 🔥 DO NOT HASH HERE - let schema middleware handle it
    const admin = new User({
      id: 1,
      name: "Admin",
      email: "admin@gmail.com",
      password: "123456", // plain password - schema will hash
      role: "admin",
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    console.log("Email: admin@gmail.com");
    console.log("Password: 123456");
    process.exit();

  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
