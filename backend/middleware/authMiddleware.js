import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "hillSmartSecret";

/* ======================================
   🔐 PROTECT (VERIFY TOKEN)
====================================== */
export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check Bearer token
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

    // 🔥 Use _id ObjectId for Mongo ops, id Number for filters
    const userId = decoded._id || decoded.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // ✅ req.user with BOTH IDs
    req.user = { 
      id: user.id, 
      _id: user._id, 
      role: user.role,
      ...user.toObject()
    };

    next();
  } catch (error) {
    console.error("🔴 Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
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

    // ✅ role check
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Allowed roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

