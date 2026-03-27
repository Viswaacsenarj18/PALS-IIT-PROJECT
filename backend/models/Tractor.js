import mongoose from "mongoose";

const tractorSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    model: { type: String, required: true },
    tractorNumber: { type: String, required: true, unique: true },
    horsepower: { type: Number, required: true },
    fuelType: {
      type: String,
      enum: ["Diesel", "Petrol", "Bio-Diesel"],
      required: true,
    },
    rentPerHour: { type: Number, required: true },
    rentPerDay: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Tractor", tractorSchema);
