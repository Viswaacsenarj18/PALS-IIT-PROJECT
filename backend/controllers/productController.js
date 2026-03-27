import Product from "../models/Product.js";
import User from "../models/user.js";
import { cloudinary, uploadToCloudinary } from "../middleware/multerConfig.js";
import mongoose from "mongoose";

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

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      pricePerKg, 
      totalQuantity, 
      phone, 
      category,
      imageUrl 
    } = req.body;

    console.log("Received data:", { name, description, pricePerKg, totalQuantity, phone, category, imageUrl });

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (!pricePerKg || pricePerKg <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price per kg is required.",
      });
    }

    if (!totalQuantity || totalQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid total quantity is required.",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    // Calculate total price and stock in controller (not in middleware)
    const calculatedTotalPrice = Number(pricePerKg) * Number(totalQuantity);
    const calculatedStock = Number(totalQuantity);

    let imagePath = "https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=No+Image";

    // Handle image - Priority: 1. File upload, 2. Image URL, 3. Default
    if (req.file) {
      try {
        imagePath = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        console.log("✅ Image uploaded via file:", imagePath);
      } catch (uploadErr) {
        console.warn("Cloudinary upload failed:", uploadErr.message);
      }
    } else if (imageUrl && imageUrl.trim()) {
      imagePath = imageUrl.trim();
      console.log("✅ Image URL provided:", imagePath);
    }

    // Create product with calculated values
    const product = new Product({
      name: name.trim(),
      description: description?.trim() || "",
      pricePerKg: Number(pricePerKg),
      totalQuantity: Number(totalQuantity),
      totalPrice: calculatedTotalPrice,
      stock: calculatedStock,
      phone: cleanPhone,
      category: category?.trim() || "other",
      image: imagePath,
      seller: req.user._id,
      isActive: true,
    });

    // Update user phone if needed
    const user = await User.findById(req.user._id);
    if (user && cleanPhone && user.phone !== cleanPhone) {
      user.phone = cleanPhone;
      await user.save();
    }

    // Save product
    await product.save();

    console.log(`✅ Product created successfully: ${product.name}`);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product: " + error.message,
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;

    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .populate('seller', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    res.status(200).json({ 
      success: true, 
      data: products, 
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID format" 
      });
    }

    const product = await Product.findById(id)
      .populate('seller', 'name phone');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, pricePerKg, totalQuantity, phone, category, isActive, imageUrl } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID format" 
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to update this product" 
      });
    }

    let finalImageUrl = product.image;

    // Handle image update
    if (req.file) {
      const oldId = getPublicId(product.image);
      if (oldId) await cloudinary.uploader.destroy(oldId).catch(() => {});
      finalImageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    } else if (imageUrl && imageUrl.trim() && imageUrl.trim() !== product.image) {
      const oldId = getPublicId(product.image);
      if (oldId) await cloudinary.uploader.destroy(oldId).catch(() => {});
      finalImageUrl = imageUrl.trim();
    }

    // Update fields
    if (name) product.name = name.trim();
    if (description !== undefined) product.description = description?.trim() || "";
    if (pricePerKg && pricePerKg > 0) product.pricePerKg = Number(pricePerKg);
    if (totalQuantity && totalQuantity >= 0) {
      product.totalQuantity = Number(totalQuantity);
      product.stock = Number(totalQuantity);
    }
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length === 10) product.phone = cleanPhone;
    }
    if (category) product.category = category.trim();
    if (isActive !== undefined) product.isActive = isActive;
    product.image = finalImageUrl;

    // Recalculate total price
    product.totalPrice = product.pricePerKg * product.totalQuantity;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID format" 
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to delete this product" 
      });
    }

    const publicId = getPublicId(product.image);
    if (publicId && !product.image.includes('placeholder')) {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await product.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};