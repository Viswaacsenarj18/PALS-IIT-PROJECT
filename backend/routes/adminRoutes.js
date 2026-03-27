import express from "express";
import User from "../models/user.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👑 ADMIN ONLY
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const users = await User.find();
    res.json(users);
  }
);

// ❌ DELETE USER
router.delete(
  "/user/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  }
);

// Fixed duplicate import - User already imported above
import Node from "../models/Node.js";

// CREATE NODE
router.post(
  "/node",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const node = new Node(req.body);
      await node.save();
      res.json({ success: true, data: node });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// ASSIGN NODE TO USER
router.post(
  "/assign-node",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { nodeId, userId } = req.body;

      const node = await Node.findOne({ nodeId });
      if (!node) {
        return res.status(404).json({ success: false, message: "Node not found" });
      }

      if (node.user) {
        return res.status(400).json({ success: false, message: "Node already assigned" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      node.user = userId;
      await node.save();

      res.json({ success: true, data: node });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// GET ALL NODES
router.get(
  "/nodes",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const nodes = await Node.find().populate("user", "name email role");
      res.json({ success: true, data: nodes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
