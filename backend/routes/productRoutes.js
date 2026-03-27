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
   PUBLIC
══════════════════════════════════════════════════════════ */

// GET all products (marketplace — anyone can browse)
router.get("/", getAllProducts);

// GET single product
router.get("/:id", getProductById);

/* ══════════════════════════════════════════════════════════
   FARMER ONLY
══════════════════════════════════════════════════════════ */

// POST create product (with optional image upload)
router.post(
  "/",
  protect,
  authorizeRoles("farmer"),
  upload.single("image"),        // field name must be "image"
  createProduct
);

// PUT update product (with optional new image)
router.put(
  "/:id",
  protect,
  authorizeRoles("farmer"),
  upload.single("image"),
  updateProduct
);

// DELETE product
router.delete(
  "/:id",
  protect,
  authorizeRoles("farmer"),
  deleteProduct
);

export default router;