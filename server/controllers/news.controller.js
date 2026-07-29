import News from "../models/News.js";
import VersionHistory from "../models/VersionHistory.js";
import Activity from "../models/Activity.js";

const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await Activity.create({ admin: adminId, action, details, ipAddress: ip });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

// Helper to save version snapshot
const saveVersion = async (docId, modelName, data, editorId) => {
  try {
    const latestVersion = await VersionHistory.findOne({ documentId: docId, documentModel: modelName })
      .sort({ versionNumber: -1 });
    
    const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;
    
    await VersionHistory.create({
      documentId: docId,
      documentModel: modelName,
      versionNumber,
      data,
      editor: editorId
    });
    return versionNumber;
  } catch (err) {
    console.error("Failed to save version history:", err);
  }
};

export const getNewsList = async (req, res) => {
  try {
    const { category, search, featured, published, page = 1, limit = 9 } = req.query;
    const query = {};

    // For public views, fetch only published articles
    if (published === "true" || !req.admin) {
      query.published = true;
    } else if (published === "false") {
      query.published = false;
    }

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
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);
    const articles = await News.find(query)
      .populate("author", "username displayName")
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.status(200).json({
      articles,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("Get news error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Increment view count
    const article = await News.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "username displayName");

    if (!article) {
      return res.status(404).json({ error: "Article not found." });
    }

    res.status(200).json({ article });
  } catch (error) {
    console.error("Get article by slug error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createNewsArticle = async (req, res) => {
  try {
    const { title, slug, description, content, coverImage, category, published, featured, seo } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: "Title, slug, and content are required." });
    }

    const exists = await News.findOne({ slug });
    if (exists) {
      return res.status(400).json({ error: "Slug must be unique. This slug is already in use." });
    }

    const newArticle = await News.create({
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      description,
      content,
      coverImage,
      category,
      published: published === "true" || published === true,
      featured: featured === "true" || featured === true,
      seo: seo || {},
      author: req.admin.id
    });

    // Save Version 1 snapshot
    await saveVersion(newArticle._id, "News", newArticle.toObject(), req.admin.id);
    await logActivity(req.admin.id, "News Publish", `Published news article: ${title}`, req);

    res.status(201).json({
      message: "News article created successfully.",
      article: newArticle
    });
  } catch (error) {
    console.error("Create news error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateNewsArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, content, coverImage, category, published, featured, seo } = req.body;

    const article = await News.findById(id);
    if (!article) {
      return res.status(404).json({ error: "News article not found." });
    }

    if (slug && slug !== article.slug) {
      const exists = await News.findOne({ slug });
      if (exists) {
        return res.status(400).json({ error: "Slug already in use." });
      }
      article.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    }

    if (title) article.title = title;
    if (description !== undefined) article.description = description;
    if (content) article.content = content;
    if (coverImage !== undefined) article.coverImage = coverImage;
    if (category) article.category = category;
    if (published !== undefined) article.published = published;
    if (featured !== undefined) article.featured = featured;
    if (seo) article.seo = { ...article.seo, ...seo };

    await article.save();
    
    // Save new edit history snapshot
    const versionNumber = await saveVersion(article._id, "News", article.toObject(), req.admin.id);
    await logActivity(req.admin.id, "News Edit", `Updated news article: ${article.title} (Version ${versionNumber})`, req);

    res.status(200).json({
      message: "News article updated successfully.",
      article
    });
  } catch (error) {
    console.error("Update news error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteNewsArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await News.findById(id);

    if (!article) {
      return res.status(404).json({ error: "News article not found." });
    }

    await News.findByIdAndDelete(id);
    
    // Delete version history snapshots
    await VersionHistory.deleteMany({ documentId: id, documentModel: "News" });
    
    await logActivity(req.admin.id, "News Delete", `Deleted news article: ${article.title}`, req);

    res.status(200).json({ message: "News article deleted successfully." });
  } catch (error) {
    console.error("Delete news error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getArticleVersions = async (req, res) => {
  try {
    const { id } = req.params;
    const versions = await VersionHistory.find({ documentId: id, documentModel: "News" })
      .populate("editor", "username displayName")
      .sort({ versionNumber: -1 });

    res.status(200).json({ versions });
  } catch (error) {
    console.error("Get versions error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const rollbackArticleVersion = async (req, res) => {
  try {
    const { id, versionNumber } = req.params;

    const version = await VersionHistory.findOne({
      documentId: id,
      documentModel: "News",
      versionNumber: parseInt(versionNumber)
    });

    if (!version) {
      return res.status(404).json({ error: "Version snapshot not found." });
    }

    const article = await News.findById(id);
    if (!article) {
      return res.status(404).json({ error: "News article not found." });
    }

    // Rollback fields from snapshot
    const snapshot = version.data;
    article.title = snapshot.title;
    article.slug = snapshot.slug;
    article.description = snapshot.description;
    article.content = snapshot.content;
    article.coverImage = snapshot.coverImage;
    article.category = snapshot.category;
    article.published = snapshot.published;
    article.featured = snapshot.featured;
    article.seo = snapshot.seo;

    await article.save();

    // Create a new version snapshot indicating rollback
    const newVer = await saveVersion(article._id, "News", article.toObject(), req.admin.id);
    await logActivity(req.admin.id, "News Edit", `Rolled back article "${article.title}" to version ${versionNumber} (New Version ${newVer})`, req);

    res.status(200).json({
      message: `Article rolled back to version ${versionNumber} successfully.`,
      article
    });
  } catch (error) {
    console.error("Rollback error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
