import mongoose from "mongoose";

const tractorBookingSchema = new mongoose.Schema(
{
  tractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tractor",
    required: true,
  },

  renterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  renterName: {
    type: String,
    required: true,
    trim: true,
  },

  renterEmail: {
    type: String,
    required: true,
    lowercase: true,
  },

  ownerName: {
    type: String,
    required: true,
  },

  ownerEmail: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  rentalType: {
    type: String,
    enum: ["hourly", "daily"],
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  totalCost: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["confirmed", "completed", "cancelled"],
    default: "confirmed",
  },

},
{ timestamps: true }
);

export default mongoose.model("TractorBooking", tractorBookingSchema);