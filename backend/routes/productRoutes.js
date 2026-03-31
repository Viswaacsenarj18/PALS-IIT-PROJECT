import express from "express";
import upload from "../middleware/multerConfig.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

/* ══════════════════════════════════════════════════════════
   PUBLIC ROUTES
══════════════════════════════════════════════════════════ */

// ✅ Get all products
router.get("/", getAllProducts);

// ✅ Get single product
router.get("/:id", getProductById);

/* ══════════════════════════════════════════════════════════
   PROTECTED (FARMER ONLY)
══════════════════════════════════════════════════════════ */

// ✅ Create product (WITH IMAGE)
router.post(
  "/",
  protect,
  authorizeRoles("farmer"),
  (req, res, next) => {
    // 🔥 HANDLE multer errors properly
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("❌ Multer Error:", err.message);
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
        });
      }
      next();
    });
  },
  createProduct
);

// ✅ Update product
router.put(
  "/:id",
  protect,
  authorizeRoles("farmer"),
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("❌ Multer Error:", err.message);
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
        });
      }
      next();
    });
  },
  updateProduct
);

// ✅ Delete product
router.delete(
  "/:id",
  protect,
  authorizeRoles("farmer"),
  deleteProduct
);

export default router;