import Product from "../models/Product.js";
import User from "../models/user.js";
import { cloudinary, uploadToCloudinary } from "../middleware/multerConfig.js";
import mongoose from "mongoose";

/* =========================================
   HELPERS
========================================= */

const getPublicId = (url) => {
  if (!url || !url.includes("cloudinary")) return null;
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    const afterUpload = parts.slice(uploadIndex + 1);
    if (/^v\d+$/.test(afterUpload[0])) afterUpload.shift();

    return afterUpload.join("/").replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* =========================================
   CREATE PRODUCT
========================================= */

export const createProduct = async (req, res) => {
  try {
    const { name, description, pricePerKg, totalQuantity, phone, category, imageUrl } = req.body;

    console.log("📦 BODY:", req.body);
    console.log("📸 FILE:", req.file);

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Product name required" });
    }

    if (!pricePerKg || pricePerKg <= 0) {
      return res.status(400).json({ success: false, message: "Valid price required" });
    }

    if (!totalQuantity || totalQuantity <= 0) {
      return res.status(400).json({ success: false, message: "Valid quantity required" });
    }

    if (!phone?.trim()) {
      return res.status(400).json({ success: false, message: "Phone required" });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    let imagePath = "https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=No+Image";

    // ✅ FILE UPLOAD
    if (req.file) {
      try {
        imagePath = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        );
        console.log("✅ Uploaded:", imagePath);
      } catch (err) {
        console.error("❌ Cloudinary Error:", err);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    // ✅ URL fallback
    else if (imageUrl?.trim()) {
      imagePath = imageUrl.trim();
    }

    const totalPrice = Number(pricePerKg) * Number(totalQuantity);

    const product = new Product({
      name: name.trim(),
      description: description?.trim() || "",
      pricePerKg: Number(pricePerKg),
      totalQuantity: Number(totalQuantity),
      totalPrice,
      stock: Number(totalQuantity),
      phone: cleanPhone,
      category: category?.trim() || "other",
      image: imagePath,
      seller: req.user._id,
      isActive: true,
    });

    await product.save();

    // update user phone
    const user = await User.findById(req.user._id);
    if (user && user.phone !== cleanPhone) {
      user.phone = cleanPhone;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   GET ALL PRODUCTS
========================================= */

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("seller", "name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* =========================================
   GET PRODUCT BY ID ✅ FIX ADDED
========================================= */

export const getProductById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const product = await Product.findById(req.params.id)
      .populate("seller", "name phone");

    if (!product) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* =========================================
   UPDATE PRODUCT
========================================= */

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ success: false });

    let imageUrl = product.image;

    if (req.file) {
      const oldId = getPublicId(product.image);
      if (oldId) await cloudinary.uploader.destroy(oldId).catch(() => {});

      imageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.pricePerKg = Number(req.body.pricePerKg || product.pricePerKg);
    product.totalQuantity = Number(req.body.totalQuantity || product.totalQuantity);
    product.totalPrice = product.pricePerKg * product.totalQuantity;
    product.image = imageUrl;

    await product.save();

    res.json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* =========================================
   DELETE PRODUCT
========================================= */

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ success: false });

    const publicId = getPublicId(product.image);
    if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => {});

    await product.deleteOne();

    res.json({ success: true, message: "Deleted" });

  } catch {
    res.status(500).json({ success: false });
  }
};