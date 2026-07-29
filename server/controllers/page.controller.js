import PageContent from "../models/PageContent.js";
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

export const getPageSection = async (req, res) => {
  try {
    const { page, section, locale } = req.params;
    const content = await PageContent.findOne({ page, section, locale });
    
    if (!content) {
      return res.status(404).json({ error: "Page section content not found." });
    }
    
    res.status(200).json({ content });
  } catch (error) {
    console.error("Get page section error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getPageContent = async (req, res) => {
  try {
    const { page, locale } = req.params;
    const contents = await PageContent.find({ page, locale });
    res.status(200).json({ contents });
  } catch (error) {
    console.error("Get page content error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updatePageSection = async (req, res) => {
  try {
    const { page, section, locale } = req.params;
    const { content, seo } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Section content data is required." });
    }

    let pageSec = await PageContent.findOne({ page, section, locale });
    
    if (!pageSec) {
      pageSec = new PageContent({
        page,
        section,
        locale,
        content,
        seo: seo || {}
      });
    } else {
      pageSec.content = content;
      if (seo) pageSec.seo = { ...pageSec.seo, ...seo };
    }

    await pageSec.save();

    // Save edit version snapshot
    const versionNumber = await saveVersion(pageSec._id, "PageContent", pageSec.toObject(), req.admin.id);
    await logActivity(req.admin.id, "Settings Update", `Updated section "${section}" on page "${page}" (${locale}, Version ${versionNumber})`, req);

    res.status(200).json({
      message: "Page section updated successfully.",
      content: pageSec
    });
  } catch (error) {
    console.error("Update page section error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getSectionVersions = async (req, res) => {
  try {
    const { page, section, locale } = req.params;
    const pageSec = await PageContent.findOne({ page, section, locale });

    if (!pageSec) {
      return res.status(404).json({ error: "Page section not found." });
    }

    const versions = await VersionHistory.find({ documentId: pageSec._id, documentModel: "PageContent" })
      .populate("editor", "username displayName")
      .sort({ versionNumber: -1 });

    res.status(200).json({ versions });
  } catch (error) {
    console.error("Get section versions error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const rollbackSectionVersion = async (req, res) => {
  try {
    const { page, section, locale, versionNumber } = req.params;

    const pageSec = await PageContent.findOne({ page, section, locale });
    if (!pageSec) {
      return res.status(404).json({ error: "Page section not found." });
    }

    const version = await VersionHistory.findOne({
      documentId: pageSec._id,
      documentModel: "PageContent",
      versionNumber: parseInt(versionNumber)
    });

    if (!version) {
      return res.status(404).json({ error: "Version snapshot not found." });
    }

    // Rollback
    pageSec.content = version.data.content;
    pageSec.seo = version.data.seo;
    await pageSec.save();

    const newVer = await saveVersion(pageSec._id, "PageContent", pageSec.toObject(), req.admin.id);
    await logActivity(req.admin.id, "Settings Update", `Rolled back section "${section}" on page "${page}" (${locale}) to version ${versionNumber} (New Version ${newVer})`, req);

    res.status(200).json({
      message: `Section rolled back to version ${versionNumber} successfully.`,
      content: pageSec
    });
  } catch (error) {
    console.error("Rollback section error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
