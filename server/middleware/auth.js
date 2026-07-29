import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "../utils/jwt.js";
import Admin from "../models/Admin.js";

export const authenticate = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies || {};

  if (!accessToken) {
    return handleRefresh(req, res, next, refreshToken);
  }

  const decoded = verifyAccessToken(accessToken);
  if (decoded) {
    req.admin = decoded;
    return next();
  }

  // If access token is invalid/expired, try refreshing
  return handleRefresh(req, res, next, refreshToken);
};

const handleRefresh = async (req, res, next, token) => {
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    // Clear cookies since they are invalid
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }

  try {
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(admin);

    // Set new cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    req.admin = { id: admin._id, username: admin.username, role: admin.role };
    next();
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Internal server error during authentication." });
  }
};

// Role authorization middleware
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    if (roles.length && !roles.includes(req.admin.role)) {
      return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
    }

    next();
  };
};
