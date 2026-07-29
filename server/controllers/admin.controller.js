import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import Activity from "../models/Activity.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

// helper to log activities
const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await Activity.create({ admin: adminId, action, details, ipAddress: ip });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      // Log login failure
      const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await Activity.create({ action: "Login Failure", details: `Failed attempt for user: ${username}`, ipAddress: ip });
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await Activity.create({ action: "Login Failure", details: `Failed attempt for user: ${username}`, ipAddress: ip });
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    await logActivity(admin._id, "Login Success", `User ${username} logged in successfully.`, req);

    res.status(200).json({
      message: "Logged in successfully.",
      admin: {
        id: admin._id,
        username: admin.username,
        displayName: admin.displayName,
        role: admin.role,
        profilePhoto: admin.profilePhoto,
        preferredLanguage: admin.preferredLanguage,
        theme: admin.theme
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.admin) {
      await logActivity(req.admin.id, "Logout", "User logged out.", req);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const verify = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ error: "Admin user not found." });
    }
    res.status(200).json({ admin });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided." });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired refresh token." });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    const newAccessToken = generateAccessToken(admin);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({ message: "Token refreshed successfully." });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { displayName, username, password, preferredLanguage, theme, profilePhoto } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ error: "Admin user not found." });
    }

    if (username && username !== admin.username) {
      const exists = await Admin.findOne({ username });
      if (exists) {
        return res.status(400).json({ error: "Username already taken." });
      }
      admin.username = username;
    }

    if (displayName) admin.displayName = displayName;
    if (preferredLanguage) admin.preferredLanguage = preferredLanguage;
    if (theme) admin.theme = theme;
    if (profilePhoto) admin.profilePhoto = profilePhoto;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
      await logActivity(admin._id, "Password Change", "Admin updated their password.", req);
    }

    await admin.save();
    await logActivity(admin._id, "Profile Update", "Admin updated their profile details.", req);

    res.status(200).json({
      message: "Profile updated successfully.",
      admin: {
        id: admin._id,
        username: admin.username,
        displayName: admin.displayName,
        role: admin.role,
        profilePhoto: admin.profilePhoto,
        preferredLanguage: admin.preferredLanguage,
        theme: admin.theme
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const activities = await Activity.find()
      .populate("admin", "username displayName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments();

    res.status(200).json({
      activities,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Admin list management (Super Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await Admin.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, displayName, role } = req.body;
    if (!username || !password || !displayName || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const exists = await Admin.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "Username already taken." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Admin.create({
      username,
      password: hashedPassword,
      displayName,
      role
    });

    await logActivity(req.admin.id, "Permission Change", `Created new admin user: ${username} with role: ${role}`, req);

    res.status(201).json({
      message: "Admin user created successfully.",
      user: {
        id: newUser._id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent self deletion
    if (id === req.admin.id) {
      return res.status(400).json({ error: "You cannot delete your own account." });
    }

    const user = await Admin.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    await Admin.findByIdAndDelete(id);
    await logActivity(req.admin.id, "Permission Change", `Deleted admin user: ${user.username}`, req);

    res.status(200).json({ message: "Admin user deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
