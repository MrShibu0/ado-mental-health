import crypto from "crypto";
import VisitorLog from "../models/VisitorLog.js";
import Gallery from "../models/Gallery.js";
import News from "../models/News.js";
import Donation from "../models/Donation.js";
import ContactMessage from "../models/ContactMessage.js";
import Media from "../models/Media.js";

const hashIP = (ip) => {
  return crypto.createHash("sha256").update(ip || "127.0.0.1").digest("hex");
};

export const logVisit = async (req, res) => {
  try {
    const { path: visitPath, referrer, browser, deviceType, country, duration } = req.body;
    if (!visitPath) {
      return res.status(400).json({ error: "Path is required." });
    }

    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ipHash = hashIP(ip);
    
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Look for existing log today for this visitor/path
    let log = await VisitorLog.findOne({ ipHash, path: visitPath, date });

    if (!log) {
      log = await VisitorLog.create({
        ipHash,
        path: visitPath,
        date,
        referrer: referrer || "Direct",
        browser: browser || "Unknown",
        deviceType: deviceType || "Desktop",
        country: country || "Haiti",
        duration: duration || 0
      });
    } else if (duration) {
      // Update session duration
      log.duration += duration;
      await log.save();
    }

    res.status(200).json({ message: "Visit logged successfully." });
  } catch (error) {
    console.error("Log visit error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 1. Visitors today (unique IP hashes)
    const visitorsToday = await VisitorLog.distinct("ipHash", { date: today });
    const visitorsCount = visitorsToday.length;

    // 2. Gallery Views
    const galleryViewsResult = await Gallery.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const galleryViews = galleryViewsResult[0]?.totalViews || 0;

    // 3. Most Viewed Image
    const mostViewedImage = await Gallery.findOne({ deleted: false })
      .sort({ views: -1 })
      .select("title views imageUrl");

    // 4. News Views
    const newsViewsResult = await News.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const newsViews = newsViewsResult[0]?.totalViews || 0;

    // 5. Total Donations
    const donationResult = await Donation.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    const totalDonations = donationResult[0]?.totalAmount || 0;

    // 6. Contact Messages
    const totalMessages = await ContactMessage.countDocuments();
    const unreadMessages = await ContactMessage.countDocuments({ status: "unread" });
    const pendingReplies = await ContactMessage.countDocuments({ status: "read" }); // read but not replied

    // 7. Storage Used
    const mediaSizes = await Media.aggregate([
      { $group: { _id: null, totalSize: { $sum: "$size" } } }
    ]);
    const totalStorageBytes = mediaSizes[0]?.totalSize || 0;
    const storageMB = (totalStorageBytes / (1024 * 1024)).toFixed(2);

    // 8. Recent Items for Widgets
    const recentUploads = await Gallery.find({ deleted: false })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("title thumbnailUrl category");

    const recentDonations = await Donation.find({ status: "completed" })
      .sort({ date: -1 })
      .limit(5);

    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentlyPublishedNews = await News.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title slug category views");

    res.status(200).json({
      visitorsToday: visitorsCount,
      galleryViews,
      mostViewedImage,
      newsViews,
      totalDonations,
      totalMessages,
      unreadMessages,
      pendingReplies,
      storageMB,
      recentUploads,
      recentDonations,
      recentMessages,
      recentlyPublishedNews
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getVisitorAnalytics = async (req, res) => {
  try {
    // 1. Visitors count by date over the past 30 days
    const past30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      past30Days.push(d.toISOString().split("T")[0]);
    }

    const visitorTrend = await Promise.all(
      past30Days.map(async (date) => {
        const uniqueIps = await VisitorLog.distinct("ipHash", { date });
        const hits = await VisitorLog.countDocuments({ date });
        return {
          date,
          visitors: uniqueIps.length,
          pageViews: hits
        };
      })
    );

    // 2. Browser statistics
    const browsers = await VisitorLog.aggregate([
      { $group: { _id: "$browser", count: { $sum: 1 } } }
    ]);

    // 3. Device type statistics
    const devices = await VisitorLog.aggregate([
      { $group: { _id: "$deviceType", count: { $sum: 1 } } }
    ]);

    // 4. Referrers statistics
    const referrers = await VisitorLog.aggregate([
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 5. Country statistics
    const countries = await VisitorLog.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      visitorTrend,
      browsers,
      devices,
      referrers,
      countries
    });
  } catch (error) {
    console.error("Get visitor analytics error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
