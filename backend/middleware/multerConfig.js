import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

/* ═══════════════════════════════════════════════════════
   CLOUDINARY CONFIG  (works with cloudinary v2)
═══════════════════════════════════════════════════════ */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ═══════════════════════════════════════════════════════
   FILE FILTER — only image types
═══════════════════════════════════════════════════════ */
const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, png, webp, gif)"), false);
  }
};

/* ═══════════════════════════════════════════════════════
   MULTER — memoryStorage (file stays in req.file.buffer)
   No disk writes, no multer-storage-cloudinary needed
═══════════════════════════════════════════════════════ */
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

/* ═══════════════════════════════════════════════════════
   uploadToCloudinary — call this inside your controller
   after multer has parsed the file into req.file.buffer

   Usage:
     const url = await uploadToCloudinary(req.file.buffer, req.file.originalname);
═══════════════════════════════════════════════════════ */
export const uploadToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {

    if (!buffer) {
      return reject(new Error("No file buffer received"));
    }

    const publicId = `hillsmart/products/${Date.now()}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary error:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer); // 🔥 IMPORTANT FIX
  });
};

export { cloudinary };
export default upload;