import express from "express";
import mongoose from "mongoose";
import Tractor from "../models/Tractor.js";
import TractorBooking from "../models/TractorBooking.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload, { uploadToCloudinary } from "../middleware/multerConfig.js";

import {
  sendRegistrationEmail,
  sendRentalConfirmationEmail,
} from "../utils/emailService.js";

const router = express.Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

////////////////////////////////////////////////////////////
// REGISTER TRACTOR
////////////////////////////////////////////////////////////

router.post(
  "/register",
  protect,
  authorizeRoles("farmer", "tractor_owner"),
  upload.single("image"),
  async (req, res) => {
    try {
const {
  ownerName,
  email,
  phone,
  location,
  model,
  tractorNumber,
  horsepower,
  fuelType,
  rentPerHour,
  rentPerDay,
  isAvailable = true,
  imageUrl,
} = req.body;

let image = null;
      if (req.file) {
        try {
          image = await uploadToCloudinary(
            req.file.buffer,
            req.file.originalname
          );
        } catch (error) {
          console.error("Cloudinary upload failed:", error);
        }
      } else if (imageUrl && imageUrl.trim()) {
        image = imageUrl.trim();
      }

if (
        !ownerName || !email || !phone || !location || !model ||
        !tractorNumber || !horsepower || !fuelType || !rentPerHour || !rentPerDay || 
        Number(horsepower) <= 0 || Number(rentPerHour) <= 0 || Number(rentPerDay) <= 0 ||
        !image
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing or invalid required tractor fields (incl. image)",
        });
      }

      const tractor = new Tractor({
        ownerName,
        email,
        phone,
        location,
        model,
        tractorNumber: tractorNumber.toUpperCase().trim(),
        horsepower: Number(horsepower),
        fuelType,
        rentPerHour: Number(rentPerHour),
        rentPerDay: Number(rentPerDay),
        isAvailable,
        image: image,
        registeredBy: req.user._id,
      });


      const savedTractor = await tractor.save();

      sendRegistrationEmail({
        ownerName: savedTractor.ownerName,
        email: savedTractor.email,
        model: savedTractor.model,
        tractorNumber: savedTractor.tractorNumber,
      }).catch(() => {});

      res.status(201).json({
        success: true,
        message: "Tractor registered successfully",
        data: savedTractor,
      });
    } catch (error) {
      console.error("Register tractor error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to register tractor",
      });
    }
  }
);

////////////////////////////////////////////////////////////
// GET ALL TRACTORS (AUTO RELEASE EXPIRED BOOKINGS)
////////////////////////////////////////////////////////////

router.get("/", async (req, res) => {
  try {
    const now = new Date();

    /* check expired bookings */
    const expiredBookings = await TractorBooking.find({
      status: "confirmed",
      endDate: { $lte: now },
    });

    for (const booking of expiredBookings) {
      booking.status = "completed";
      await booking.save();

      await Tractor.findByIdAndUpdate(booking.tractorId, {
        isAvailable: true,
      });
    }

    const tractors = await Tractor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tractors,
    });
  } catch (error) {
    console.error("Fetch tractors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tractors",
    });
  }
});

////////////////////////////////////////////////////////////
// GET MY BOOKINGS  ← must come BEFORE /:id
////////////////////////////////////////////////////////////

router.get("/bookings/my", protect, async (req, res) => {
  try {
    const bookings = await TractorBooking.find({ renterId: req.user._id })
      .populate("tractorId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Fetch my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
});

////////////////////////////////////////////////////////////
// GET SINGLE TRACTOR
////////////////////////////////////////////////////////////

router.get("/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tractor ID",
      });
    }

    const tractor = await Tractor.findById(req.params.id);

    if (!tractor) {
      return res.status(404).json({
        success: false,
        message: "Tractor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tractor,
    });
  } catch (error) {
    console.error("Fetch tractor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tractor",
    });
  }
});

////////////////////////////////////////////////////////////
// CONFIRM RENTAL
////////////////////////////////////////////////////////////

router.post(
  "/confirm-rental",
  protect,                          // ✅ FIX 1: Removed authorizeRoles("farmer")
  async (req, res) => {
    try {
      const {
        tractorId,
        renterName,
        renterEmail,                // ✅ FIX 2: Accept renterEmail from frontend
        startDate,
        startTime,                  // ✅ FIX 3: Accept startTime from frontend
        rentalType,
        duration,
        totalCost,
      } = req.body;

      if (!tractorId || !renterName || !startDate || !duration || !totalCost) {
        return res.status(400).json({
          success: false,
          message: "Missing rental details",
        });
      }

      const tractor = await Tractor.findById(tractorId);

      if (!tractor) {
        return res.status(404).json({
          success: false,
          message: "Tractor not found",
        });
      }

      if (!tractor.isAvailable) {
        return res.status(409).json({
          success: false,
          message: "Tractor not available",
        });
      }

      // ✅ FIX 4: Combine startDate + startTime correctly to avoid timezone/time loss
      const startDateObj = startTime
        ? new Date(`${startDate}T${startTime}:00`)
        : new Date(`${startDate}T00:00:00`);

      /* calculate endDate */
      let endDate;
      if (rentalType === "hourly") {
        endDate = new Date(startDateObj.getTime() + duration * 60 * 60 * 1000);
      } else {
        endDate = new Date(startDateObj.getTime() + duration * 24 * 60 * 60 * 1000);
      }

      // ✅ FIX 5: Use renterEmail from body if provided, fallback to logged-in user's email
      const resolvedRenterEmail = renterEmail?.trim() || req.user.email;

      const booking = new TractorBooking({
        tractorId: tractor._id,
        renterId: req.user._id,
        renterName,
        renterEmail: resolvedRenterEmail,

        ownerName: tractor.ownerName,
        ownerEmail: tractor.email,

        startDate: startDateObj,
        endDate,

        rentalType,
        duration: Number(duration),
        totalCost: Number(totalCost),

        status: "confirmed",
      });

      await booking.save();

      tractor.isAvailable = false;
      await tractor.save();

      sendRentalConfirmationEmail({
        ownerEmail: tractor.email,
        ownerName: tractor.ownerName,
        renterName,
        renterEmail: resolvedRenterEmail,
        model: tractor.model,
        tractorNumber: tractor.tractorNumber,
        totalCost,
        startDate: startDateObj,
        endDate,
        rentalType,
        duration,
      }).catch(() => {});

      res.status(200).json({
        success: true,
        message: "Rental confirmed successfully",
        data: booking,
      });
    } catch (error) {
      console.error("Confirm rental error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to confirm rental",
      });
    }
  }
);

////////////////////////////////////////////////////////////
// CANCEL BOOKING
////////////////////////////////////////////////////////////

router.patch("/bookings/:bookingId/cancel", protect, async (req, res) => {
  try {
    const booking = await TractorBooking.findById(
      req.params.bookingId
    ).populate("tractorId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    await Tractor.findByIdAndUpdate(booking.tractorId._id, {
      isAvailable: true,
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
});

export default router;