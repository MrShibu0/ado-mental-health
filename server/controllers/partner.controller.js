import Partner from "../models/Partner.js";
import Activity from "../models/Activity.js";

const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await Activity.create({ admin: adminId, action, details, ipAddress: ip });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

export const getPartners = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    const partners = await Partner.find(query).sort({ createdAt: -1 });
    res.status(200).json({ partners });
  } catch (error) {
    console.error("Get partners error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createPartner = async (req, res) => {
  try {
    const { name, logo, website, category, description, featured } = req.body;
    if (!name || !logo) {
      return res.status(400).json({ error: "Name and Logo URL/path are required." });
    }

    const partner = await Partner.create({
      name,
      logo,
      website,
      category,
      description,
      featured: featured === "true" || featured === true
    });

    await logActivity(req.admin.id, "Partner Create", `Added partner organization: ${name}`, req);

    res.status(201).json({
      message: "Partner created successfully.",
      partner
    });
  } catch (error) {
    console.error("Create partner error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, website, category, description, featured } = req.body;

    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({ error: "Partner not found." });
    }

    if (name) partner.name = name;
    if (logo) partner.logo = logo;
    if (website !== undefined) partner.website = website;
    if (category) partner.category = category;
    if (description !== undefined) partner.description = description;
    if (featured !== undefined) partner.featured = featured;

    await partner.save();
    await logActivity(req.admin.id, "Partner Edit", `Updated partner: ${partner.name}`, req);

    res.status(200).json({
      message: "Partner updated successfully.",
      partner
    });
  } catch (error) {
    console.error("Update partner error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findById(id);

    if (!partner) {
      return res.status(404).json({ error: "Partner not found." });
    }

    await Partner.findByIdAndDelete(id);
    await logActivity(req.admin.id, "Partner Delete", `Deleted partner: ${partner.name}`, req);

    res.status(200).json({ message: "Partner deleted successfully." });
  } catch (error) {
    console.error("Delete partner error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
