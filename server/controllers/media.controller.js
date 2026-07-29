import fs from "fs";
import path from "path";
import Media from "../models/Media.js";
import Activity from "../models/Activity.js";
import { processImage } from "../utils/imageProcessor.js";

const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await Activity.create({ admin: adminId, action, details, ipAddress: ip });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    // Process image using sharp utility (saves to server/uploads/media/)
    const processed = await processImage(req.file.buffer, req.file.originalname, "media");

    const media = await Media.create({
      filename: processed.filename,
      url: processed.imageUrl,
      thumbnailUrl: processed.thumbnailUrl,
      size: processed.size,
      mimeType: "image/webp", // output is always WebP
      uploadedBy: req.admin.id
    });

    await logActivity(req.admin.id, "Image Upload", `Uploaded media file: ${processed.filename}`, req);

    res.status(201).json({
      message: "Media uploaded successfully.",
      media
    });
  } catch (error) {
    console.error("Upload media error:", error);
    res.status(500).json({ error: error.message || "Failed to upload media." });
  }
};

export const getMediaList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const media = await Media.find()
      .populate("uploadedBy", "username displayName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Media.countDocuments();

    res.status(200).json({
      media,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Get media list error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ error: "Media file not found." });
    }

    // Delete original file from disk
    const originalDiskPath = path.join(process.cwd(), "server", media.url);
    if (fs.existsSync(originalDiskPath)) {
      fs.unlinkSync(originalDiskPath);
    }

    // Delete thumbnail from disk
    if (media.thumbnailUrl) {
      const thumbDiskPath = path.join(process.cwd(), "server", media.thumbnailUrl);
      if (fs.existsSync(thumbDiskPath)) {
        fs.unlinkSync(thumbDiskPath);
      }
    }

    await Media.findByIdAndDelete(id);
    await logActivity(req.admin.id, "Image Delete", `Deleted media file: ${media.filename}`, req);

    res.status(200).json({ message: "Media deleted successfully." });
  } catch (error) {
    console.error("Delete media error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
