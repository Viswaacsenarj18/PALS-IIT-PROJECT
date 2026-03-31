import jwt from "jsonwebtoken";
import User from "../models/user.js";

/* ======================================
   🔐 PROTECT (VERIFY TOKEN)
====================================== */
export const protect = async (req, res, next) => {
  try {
    // ✅ Get JWT dynamically (FIX)
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server config error: JWT_SECRET missing",
      });
    }

    let token;

    // ✅ Extract token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login.",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Find user
    const userId = decoded._id || decoded.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // ✅ Attach user
    req.user = {
      id: user.id,
      _id: user._id,
      role: user.role,
      ...user.toObject(),
    };

    next();

  } catch (error) {
    console.error("🔴 Auth Error:", error.message);

    let message = "Invalid or expired token";

    if (error.name === "JsonWebTokenError") {
      message = "Invalid token signature";
    } else if (error.name === "TokenExpiredError") {
      message = "Token expired";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

/* ======================================
   🔐 AUTHORIZE ROLES
====================================== */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Allowed roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};