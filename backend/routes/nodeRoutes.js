import express from "express";
import Node from "../models/Node.js";
import axios from "axios";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET USER'S NODES
router.get("/my-nodes", protect, async (req, res) => {
  try {
    const nodes = await Node.find({ user: req.user._id, status: "active" }).populate("user", "name");
    res.json({ success: true, data: nodes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET NODE DATA FROM THINGSPEAK
router.get("/:nodeId/data", protect, async (req, res) => {
  try {
    const node = await Node.findOne({ 
      nodeId: req.params.nodeId, 
      user: req.user._id,
      status: "active"
    });

    if (!node) {
      return res.status(404).json({ success: false, message: "Node not found or access denied" });
    }

    const response = await axios.get(
      `https://api.thingspeak.com/channels/${node.channelId}/feeds.json?api_key=${node.readApiKey}&results=1`
    );

    const feeds = response.data.feeds;
    if (!feeds || feeds.length === 0) {
      return res.json({ 
        success: true, 
        data: { temperature: null, ph: null, water: null, light: null } 
      });
    }

    const latest = feeds[0];
    const data = {
      temperature: parseFloat(latest.field1 || "0"),
      ph: parseFloat(latest.field2 || "0"),
      water: parseFloat(latest.field3 || "0"),
      light: parseFloat(latest.field4 || "0"),
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error("ThingSpeak fetch error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch node data" });
  }
});

export default router;
