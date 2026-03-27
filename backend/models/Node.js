import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema(
  {
    nodeId: {
      type: String,
      required: [true, "Node ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Node name is required"],
      trim: true,
    },
    channelId: {
      type: String,
      required: [true, "ThingSpeak Channel ID is required"],
    },
    readApiKey: {
      type: String,
      required: [true, "Read API Key is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index on schema field instead of manual
// nodeSchema.index({ nodeId: 1 }); // Removed duplicate index

nodeSchema.index({ user: 1 });

const Node = mongoose.models.Node || mongoose.model("Node", nodeSchema);
export default Node;
