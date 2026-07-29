import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  paymentProvider: { type: String, required: true },
  transactionId: { type: String, unique: true, index: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Donation", donationSchema);
