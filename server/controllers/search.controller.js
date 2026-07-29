import Gallery from "../models/Gallery.js";
import News from "../models/News.js";
import Partner from "../models/Partner.js";
import Donation from "../models/Donation.js";
import ContactMessage from "../models/ContactMessage.js";

export const performSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search query string is required." });
    }

    const regex = { $regex: q, $options: "i" };

    // 1. Search Gallery
    const gallery = await Gallery.find({
      deleted: false,
      $or: [
        { title: regex },
        { description: regex },
        { location: regex }
      ]
    }).limit(10);

    // 2. Search News
    const news = await News.find({
      $or: [
        { title: regex },
        { description: regex },
        { content: regex },
        { category: regex }
      ]
    }).limit(10);

    // 3. Search Partners
    const partners = await Partner.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex }
      ]
    }).limit(10);

    // 4. Search Contact Messages
    const messages = await ContactMessage.find({
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
        { message: regex }
      ]
    }).limit(10);

    // 5. Search Donations
    const donations = await Donation.find({
      status: "completed",
      $or: [
        { donorName: regex },
        { email: regex },
        { transactionId: regex }
      ]
    }).limit(10);

    res.status(200).json({
      gallery,
      news,
      partners,
      messages,
      donations
    });
  } catch (error) {
    console.error("Perform search error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
