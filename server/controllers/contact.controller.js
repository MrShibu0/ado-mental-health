import ContactMessage from "../models/ContactMessage.js";
import Activity from "../models/Activity.js";

const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await Activity.create({ admin: adminId, action, details, ipAddress: ip });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
      status: "unread"
    });

    res.status(201).json({
      message: "Your message has been submitted successfully.",
      contactMessage: newMessage
    });
  } catch (error) {
    console.error("Submit contact form error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(parseInt(limit));

    const total = await ContactMessage.countDocuments(query);
    const unreadCount = await ContactMessage.countDocuments({ status: "unread" });

    res.status(200).json({
      messages,
      total,
      unreadCount,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("Get contact messages error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unread", "read", "replied"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ error: "Contact message not found." });
    }

    message.status = status;
    await message.save();

    res.status(200).json({
      message: "Message status updated successfully.",
      contactMessage: message
    });
  } catch (error) {
    console.error("Update message status error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ error: "Reply text is required." });
    }

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ error: "Contact message not found." });
    }

    // In a real application, you would send an email here.
    // For this CMS, we mark it as replied and log the admin action.
    message.status = "replied";
    await message.save();

    await logActivity(req.admin.id, "Profile Update", `Sent a reply to contact message from ${message.email}`, req); // Or customize action in Activity log if needed

    res.status(200).json({
      message: "Reply recorded and status updated successfully.",
      contactMessage: message
    });
  } catch (error) {
    console.error("Reply message error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    await ContactMessage.findByIdAndDelete(id);
    await logActivity(req.admin.id, "Image Delete", `Deleted contact message from ${message.name} (${message.email})`, req); // Delete log

    res.status(200).json({ message: "Contact message deleted successfully." });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
