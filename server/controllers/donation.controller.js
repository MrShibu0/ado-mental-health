import StripeService from "../services/stripe.service.js";
import Donation from "../models/Donation.js";
import Activity from "../models/Activity.js";

const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await Activity.create({ admin: adminId, action, details, ipAddress: ip });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, frequency, name, email, provider = "stripe" } = req.body;

    // Validate request
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid donation amount." });
    }
    if (!name || !email) {
      return res.status(400).json({ error: "Donor name and email are required." });
    }

    if (provider === "stripe") {
      const sessionUrl = await StripeService.createSession({ amount, frequency, name, email });
      
      // Save pending donation record
      // We extract session ID from Stripe url or session object (handled asynchronously in webhook, but creating pending row is useful)
      await Donation.create({
        donorName: name,
        email,
        amount,
        paymentProvider: "Stripe",
        status: "pending"
      });

      return res.status(200).json({ checkoutUrl: sessionUrl });
    } else {
      return res.status(400).json({ error: "Unsupported payment provider." });
    }

  } catch (error) {
    console.error("Checkout Session Error:", error);
    res.status(500).json({ error: "An error occurred while initiating the donation." });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const rawBody = req.body;

  try {
    const event = StripeService.verifyWebhook(rawBody, sig);
    
    // Handle checkout session completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // Look up if we have a pending donation from this email/amount or update based on Stripe fields
      const email = session.customer_details?.email || session.metadata?.email;
      const donorName = session.customer_details?.name || session.metadata?.name;
      const amount = session.amount_total / 100;
      const currency = session.currency?.toUpperCase() || "USD";
      const transactionId = session.id;

      // Update existing or create a completed record
      await Donation.findOneAndUpdate(
        { email, amount, status: "pending" },
        { 
          donorName: donorName || "Anonymous Donor",
          status: "completed", 
          transactionId, 
          currency,
          date: new Date()
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Donation successful! Transaction ID: ${transactionId}, Amount: ${amount} ${currency}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// Admin panel Donation tracking (Protected)
export const getDonations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({ status: "completed" })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donation.countDocuments({ status: "completed" });

    res.status(200).json({
      donations,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Get donations error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getDonationStats = async (req, res) => {
  try {
    // Total Completed Donations sum
    const totalStats = await Donation.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    const totalDonations = totalStats[0]?.totalAmount || 0;
    const totalCount = totalStats[0]?.count || 0;

    // Monthly completed donations sum
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyStats = await Donation.aggregate([
      { $match: { status: "completed", date: { $gte: startOfMonth } } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    const monthlyDonations = monthlyStats[0]?.totalAmount || 0;

    // Recent Donations (last 10 completed)
    const recentDonations = await Donation.find({ status: "completed" })
      .sort({ date: -1 })
      .limit(10);

    res.status(200).json({
      totalDonations,
      totalCount,
      monthlyDonations,
      recentDonations
    });
  } catch (error) {
    console.error("Get donation stats error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
