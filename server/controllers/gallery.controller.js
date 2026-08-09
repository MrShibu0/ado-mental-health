import fs from "fs";
import path from "path";
import Gallery from "../models/Gallery.js";
import Media from "../models/Media.js";
import Activity from "../models/Activity.js";
import News from "../models/News.js";
import Partner from "../models/Partner.js";
import PageContent from "../models/PageContent.js";
import { processImage } from "../utils/imageProcessor.js";

const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await Activity.create({ admin: adminId, action, details, ipAddress: ip });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

const hasImageRef = (obj, targetUrl, targetId) => {
  if (!obj) return false;
  if (typeof obj === "string") {
    return obj === targetUrl || obj === targetId;
  }
  if (Array.isArray(obj)) {
    return obj.some(item => hasImageRef(item, targetUrl, targetId));
  }
  if (typeof obj === "object") {
    return Object.values(obj).some(val => hasImageRef(val, targetUrl, targetId));
  }
  return false;
};

const getReferences = async (galleryItem) => {
  const refs = [];
  const targetId = galleryItem._id.toString();
  const targetUrl = galleryItem.imageUrl;

  // 1. Check News
  const newsItems = await News.find({ 
    $or: [{ coverImage: targetUrl }, { coverImage: targetId }] 
  });
  newsItems.forEach(n => {
    refs.push({ type: "News", name: n.title, page: "News", section: "Article", refId: n._id });
  });

  // 2. Check Partners
  const partners = await Partner.find({ 
    $or: [{ logo: targetUrl }, { logo: targetId }] 
  });
  partners.forEach(p => {
    refs.push({ type: "Partner", name: p.name, page: "Partners", section: "Logo", refId: p._id });
  });

  // 3. Check PageContent
  const pageContents = await PageContent.find({});
  pageContents.forEach(pc => {
    if (hasImageRef(pc.content, targetUrl, targetId)) {
      refs.push({ 
        type: "PageContent", 
        name: `${pc.page} - ${pc.section} (${pc.locale})`, 
        page: pc.page, 
        section: pc.section, 
        refId: pc._id 
      });
    }
  });

  return refs;
};

export const getGalleryItems = async (req, res) => {
  try {
    const { category, search, featured, sort, usageType, isUsed, page = 1, limit = 12 } = req.query;
    
    const query = { deleted: false };

    if (category && category !== "All") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (usageType) {
      query.usageType = usageType;
    }

    if (isUsed === "true") {
      query.usedOn = { $exists: true, $not: { $size: 0 } };
    } else if (isUsed === "false") {
      query.$or = [
        { usedOn: { $exists: false } },
        { usedOn: { $size: 0 } }
      ];
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { "usedOn.page": { $regex: search, $options: "i" } },
        { "usedOn.section": { $regex: search, $options: "i" } }
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
    const { title, description, category, altText, location, eventDate, featured, mediaId, tags, coordinates, usageType, usedOn } = req.body;

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

    let tagsArray = [];
    if (tags) {
      if (typeof tags === "string") {
        tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
    }

    let usedOnArray = [];
    if (usedOn) {
      if (typeof usedOn === "string") {
        try {
          usedOnArray = JSON.parse(usedOn);
        } catch (e) {}
      } else if (Array.isArray(usedOn)) {
        usedOnArray = usedOn;
      }
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
      tags: tagsArray,
      coordinates,
      usageType: usageType || "gallery",
      usedOn: usedOnArray,
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
    const { title, description, category, altText, location, eventDate, featured, tags, coordinates, usageType, usedOn } = req.body;

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

    if (tags !== undefined) {
      let tagsArray = [];
      if (typeof tags === "string") {
        tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
      item.tags = tagsArray;
    }
    if (coordinates !== undefined) item.coordinates = coordinates;
    if (usageType !== undefined) item.usageType = usageType;
    if (usedOn !== undefined) {
      let usedOnArray = [];
      if (typeof usedOn === "string") {
        try {
          usedOnArray = JSON.parse(usedOn);
        } catch (e) {}
      } else if (Array.isArray(usedOn)) {
        usedOnArray = usedOn;
      }
      item.usedOn = usedOnArray;
    }

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
      const refs = await getReferences(item);
      if (refs.length > 0) {
        return res.status(400).json({
          error: "IMAGE_IN_USE",
          message: "This image cannot be deleted because it is currently used on the website.",
          references: refs
        });
      }

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
      // Bulk permanent delete
      const items = await Gallery.find({ _id: { $in: ids } }).populate("mediaRef");
      const unremovableItems = [];
      
      for (const item of items) {
        const refs = await getReferences(item);
        if (refs.length > 0) {
          unremovableItems.push({ title: item.title, references: refs });
        }
      }

      if (unremovableItems.length > 0) {
        return res.status(400).json({
          error: "IMAGE_IN_USE",
          message: `${unremovableItems.length} of the selected images are currently used on the website and cannot be permanently deleted.`,
          details: unremovableItems
        });
      }

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

export const getSystemImages = async (req, res) => {
  try {
    const items = await Gallery.find({ deleted: false, usageType: "system" });
    const mappings = {};
    items.forEach(item => {
      if (item.usedOn && item.usedOn.length > 0) {
        item.usedOn.forEach(ref => {
          if (!mappings[ref.page]) mappings[ref.page] = {};
          mappings[ref.page][ref.section] = {
            imageUrl: item.imageUrl,
            thumbnailUrl: item.thumbnailUrl,
            altText: item.altText,
            systemKey: item.systemKey,
            updatedAt: item.updatedAt
          };
        });
      }
    });
    res.status(200).json({ systemImages: mappings });
  } catch (error) {
    console.error("Get system images error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getGalleryItemReferences = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found." });
    }
    const references = await getReferences(item);
    res.status(200).json({ references });
  } catch (error) {
    console.error("Get references error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const replaceGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a new replacement image file." });
    }

    const item = await Gallery.findById(id).populate("mediaRef");
    if (!item) {
      return res.status(404).json({ error: "Gallery item not found." });
    }

    const oldMedia = item.mediaRef;
    
    // Process new image
    const processed = await processImage(req.file.buffer, req.file.originalname, "gallery");

    // Save references to old files so we can delete them after successful database update
    let oldFilesToDelete = [];
    if (oldMedia) {
      const originalDiskPath = path.join(process.cwd(), "server", oldMedia.url);
      const thumbDiskPath = path.join(process.cwd(), "server", oldMedia.thumbnailUrl);
      oldFilesToDelete.push(originalDiskPath, thumbDiskPath);
    }

    // Update Media database record
    let mediaId = oldMedia ? oldMedia._id : null;
    if (oldMedia) {
      oldMedia.filename = processed.filename;
      oldMedia.url = processed.imageUrl;
      oldMedia.thumbnailUrl = processed.thumbnailUrl;
      oldMedia.size = processed.size;
      oldMedia.mimeType = "image/webp";
      oldMedia.uploadedBy = req.admin.id;
      await oldMedia.save();
    } else {
      const newMedia = await Media.create({
        filename: processed.filename,
        url: processed.imageUrl,
        thumbnailUrl: processed.thumbnailUrl,
        size: processed.size,
        mimeType: "image/webp",
        uploadedBy: req.admin.id
      });
      mediaId = newMedia._id;
    }

    // Update Gallery record
    item.mediaRef = mediaId;
    item.imageUrl = processed.imageUrl;
    item.thumbnailUrl = processed.thumbnailUrl;
    await item.save();

    // Safely delete old physical files from server disk
    oldFilesToDelete.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error("Failed to delete old file during replacement:", unlinkErr);
        }
      }
    });

    // Synchronize references across models
    if (oldMedia) {
      await News.updateMany({ coverImage: oldMedia.url }, { coverImage: processed.imageUrl });
      await Partner.updateMany({ logo: oldMedia.url }, { logo: processed.imageUrl });
    }
    
    await logActivity(req.admin.id, "Image Upload", `Replaced image files for item: ${item.title}`, req);

    res.status(200).json({
      message: "Image replaced successfully.",
      item
    });
  } catch (error) {
    console.error("Replace image error:", error);
    res.status(500).json({ error: error.message || "Failed to replace image." });
  }
};
