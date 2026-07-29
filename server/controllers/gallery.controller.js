import fs from "fs";
import path from "path";
import Gallery from "../models/Gallery.js";
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

export const getGalleryItems = async (req, res) => {
  try {
    const { category, search, featured, sort, page = 1, limit = 12 } = req.query;
    
    const query = { deleted: false };

    if (category && category !== "All") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption = { createdAt: -1 }; // default: newest upload
    if (sort === "newest") {
      sortOption = { eventDate: -1 };
    } else if (sort === "oldest") {
      sortOption = { eventDate: 1 };
    } else if (sort === "views") {
      sortOption = { views: -1 };
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);
    const items = await Gallery.find(query)
      .populate("mediaRef")
      .sort(sortOption)
      .skip(skipIndex)
      .limit(parseInt(limit));

    const total = await Gallery.countDocuments(query);

    res.status(200).json({
      items,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("Get gallery error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Increment view count
    const item = await Gallery.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("mediaRef");

    if (!item || item.deleted) {
      return res.status(404).json({ error: "Gallery item not found." });
    }

    res.status(200).json({ item });
  } catch (error) {
    console.error("Get gallery item by id error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const uploadGalleryItem = async (req, res) => {
  try {
    const { title, description, category, altText, location, eventDate, featured, mediaId } = req.body;

    if (!title || !category || !eventDate) {
      return res.status(400).json({ error: "Title, Category, and Event Date are required." });
    }

    let media;
    // Check if selecting existing media or uploading a new file
    if (req.file) {
      // Process uploaded image (saves to server/uploads/gallery/)
      const processed = await processImage(req.file.buffer, req.file.originalname, "gallery");
      
      // Create Media item in library
      media = await Media.create({
        filename: processed.filename,
        url: processed.imageUrl,
        thumbnailUrl: processed.thumbnailUrl,
        size: processed.size,
        mimeType: "image/webp",
        uploadedBy: req.admin.id
      });
    } else if (mediaId) {
      media = await Media.findById(mediaId);
      if (!media) {
        return res.status(404).json({ error: "Selected Media ID not found in library." });
      }
    } else {
      return res.status(400).json({ error: "Please upload an image or select one from the Media Library." });
    }

    const newItem = await Gallery.create({
      title,
      description,
      category,
      mediaRef: media._id,
      imageUrl: media.url,
      thumbnailUrl: media.thumbnailUrl,
      altText: altText || title,
      location,
      eventDate: new Date(eventDate),
      featured: featured === "true" || featured === true,
      uploadedBy: req.admin.id
    });

    await logActivity(req.admin.id, "Image Upload", `Added image to gallery: ${title}`, req);

    res.status(201).json({
      message: "Gallery item added successfully.",
      item: newItem
    });
  } catch (error) {
    console.error("Upload gallery error:", error);
    res.status(500).json({ error: error.message || "Failed to add gallery item." });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, altText, location, eventDate, featured } = req.body;

    const item = await Gallery.findById(id);
    if (!item || item.deleted) {
      return res.status(404).json({ error: "Gallery item not found." });
    }

    if (title) item.title = title;
    if (description !== undefined) item.description = description;
    if (category) item.category = category;
    if (altText !== undefined) item.altText = altText;
    if (location !== undefined) item.location = location;
    if (eventDate) item.eventDate = new Date(eventDate);
    if (featured !== undefined) item.featured = featured;

    await item.save();
    await logActivity(req.admin.id, "Image Edit", `Updated gallery item: ${item.title}`, req);

    res.status(200).json({
      message: "Gallery item updated successfully.",
      item
    });
  } catch (error) {
    console.error("Update gallery error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      return res.status(404).json({ error: "Gallery item not found." });
    }

    // Soft delete if it is active
    if (!item.deleted) {
      item.deleted = true;
      item.deletedAt = new Date();
      await item.save();
      await logActivity(req.admin.id, "Image Delete", `Soft-deleted gallery item: ${item.title}`, req);
      return res.status(200).json({ message: "Item moved to Recycle Bin." });
    }

    // Permanent delete if already in Recycle Bin (Super Admin and Admin only)
    if (item.deleted) {
      // Find associated media if any
      const media = await Media.findById(item.mediaRef);
      if (media) {
        // Delete files from disk
        const originalDiskPath = path.join(process.cwd(), "server", media.url);
        if (fs.existsSync(originalDiskPath)) {
          fs.unlinkSync(originalDiskPath);
        }
        const thumbDiskPath = path.join(process.cwd(), "server", media.thumbnailUrl);
        if (fs.existsSync(thumbDiskPath)) {
          fs.unlinkSync(thumbDiskPath);
        }
        // Delete Media document
        await Media.findByIdAndDelete(media._id);
      }

      await Gallery.findByIdAndDelete(id);
      await logActivity(req.admin.id, "Image Delete", `Permanently deleted gallery item: ${item.title}`, req);
      return res.status(200).json({ message: "Gallery item permanently deleted." });
    }
  } catch (error) {
    console.error("Delete gallery item error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const restoreGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item || !item.deleted) {
      return res.status(404).json({ error: "Item not found in Recycle Bin." });
    }

    item.deleted = false;
    item.deletedAt = undefined;
    await item.save();
    
    await logActivity(req.admin.id, "Profile Update", `Restored gallery item: ${item.title}`, req); // Profile Update falls under audits or change it below

    res.status(200).json({
      message: "Gallery item restored successfully.",
      item
    });
  } catch (error) {
    console.error("Restore gallery item error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getRecycleBinItems = async (req, res) => {
  try {
    const items = await Gallery.find({ deleted: true })
      .populate("mediaRef")
      .sort({ deletedAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    console.error("Get recycle bin items error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const bulkDeleteGalleryItems = async (req, res) => {
  try {
    const { ids, permanent = false } = req.body;
    if (!ids || !ids.length) {
      return res.status(400).json({ error: "No IDs provided." });
    }

    if (!permanent) {
      // Bulk soft delete
      await Gallery.updateMany(
        { _id: { $in: ids }, deleted: false },
        { deleted: true, deletedAt: new Date() }
      );
      await logActivity(req.admin.id, "Image Delete", `Bulk soft-deleted ${ids.length} gallery items.`, req);
      return res.status(200).json({ message: "Items moved to Recycle Bin." });
    } else {
      // Bulk permanent delete (requires file deletion as well)
      const items = await Gallery.find({ _id: { $in: ids } }).populate("mediaRef");
      for (const item of items) {
        if (item.mediaRef) {
          const media = item.mediaRef;
          // Delete files from disk
          const originalDiskPath = path.join(process.cwd(), "server", media.url);
          if (fs.existsSync(originalDiskPath)) {
            fs.unlinkSync(originalDiskPath);
          }
          if (media.thumbnailUrl) {
            const thumbDiskPath = path.join(process.cwd(), "server", media.thumbnailUrl);
            if (fs.existsSync(thumbDiskPath)) {
              fs.unlinkSync(thumbDiskPath);
            }
          }
          await Media.findByIdAndDelete(media._id);
        }
        await Gallery.findByIdAndDelete(item._id);
      }
      await logActivity(req.admin.id, "Image Delete", `Bulk permanently deleted ${ids.length} gallery items.`, req);
      return res.status(200).json({ message: "Gallery items permanently deleted." });
    }
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getGalleryAnalytics = async (req, res) => {
  try {
    const totalImages = await Gallery.countDocuments({ deleted: false });
    const featuredImages = await Gallery.countDocuments({ deleted: false, featured: true });

    // Categories breakdown
    const categoriesStats = await Gallery.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Storage Used (sum of all sizes of referenced Media items)
    const activeGallery = await Gallery.find({ deleted: false }).select("mediaRef");
    const activeMediaIds = activeGallery.map(g => g.mediaRef);
    const mediaSizes = await Media.aggregate([
      { $match: { _id: { $in: activeMediaIds } } },
      { $group: { _id: null, totalSize: { $sum: "$size" } } }
    ]);
    const totalStorageBytes = mediaSizes[0]?.totalSize || 0;
    const storageUsed = (totalStorageBytes / (1024 * 1024)).toFixed(2) + " MB"; // Convert to MB

    // Monthly uploads count (current year)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const uploadsThisMonth = await Gallery.countDocuments({
      deleted: false,
      createdAt: { $gte: startOfMonth }
    });

    const uploadsThisYear = await Gallery.countDocuments({
      deleted: false,
      createdAt: { $gte: startOfYear }
    });

    // Most Viewed Gallery Items (top 5)
    const mostViewed = await Gallery.find({ deleted: false })
      .sort({ views: -1 })
      .limit(5);

    // Newest Upload
    const newestUpload = await Gallery.findOne({ deleted: false })
      .sort({ createdAt: -1 });

    // Most Used Category
    let mostUsedCategory = "None";
    if (categoriesStats.length > 0) {
      categoriesStats.sort((a, b) => b.count - a.count);
      mostUsedCategory = categoriesStats[0]._id;
    }

    res.status(200).json({
      totalImages,
      featuredImages,
      categories: categoriesStats,
      storageUsed,
      uploadsThisMonth,
      uploadsThisYear,
      mostUsedCategory,
      mostViewed,
      newestUpload: newestUpload ? newestUpload.title : "None"
    });
  } catch (error) {
    console.error("Gallery analytics error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
