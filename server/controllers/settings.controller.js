import Settings from "../models/Settings.js";
import Activity from "../models/Activity.js";

const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await Activity.create({ admin: adminId, action, details, ipAddress: ip });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Seed default settings if empty
    if (!settings) {
      settings = await Settings.create({
        organizationName: "ADO Center",
        email: "contact@adocenter.org",
        phone: "+509 XXXX XXXX",
        address: "Anse-à-Galets, La Gonâve, Haiti",
        mission: "To support mental health and community resilience.",
        vision: "A community where mental health services are accessible to all.",
        footerText: "ADO Center - Mental Health Care"
      });
    }
    
    res.status(200).json({ settings });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { 
      organizationName, logo, address, phone, email, googleMapUrl,
      facebook, instagram, linkedin, youtube, mission, vision, footerText 
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (organizationName) settings.organizationName = organizationName;
    if (logo !== undefined) settings.logo = logo;
    if (address !== undefined) settings.address = address;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (googleMapUrl !== undefined) settings.googleMapUrl = googleMapUrl;
    
    // Update socials
    settings.socialLinks = {
      facebook: facebook !== undefined ? facebook : settings.socialLinks?.facebook,
      instagram: instagram !== undefined ? instagram : settings.socialLinks?.instagram,
      linkedin: linkedin !== undefined ? linkedin : settings.socialLinks?.linkedin,
      youtube: youtube !== undefined ? youtube : settings.socialLinks?.youtube
    };

    if (mission !== undefined) settings.mission = mission;
    if (vision !== undefined) settings.vision = vision;
    if (footerText !== undefined) settings.footerText = footerText;

    await settings.save();
    
    await logActivity(req.admin.id, "Settings Update", "Updated organization settings.", req);

    res.status(200).json({
      message: "Settings updated successfully.",
      settings
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
