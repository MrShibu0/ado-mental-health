import mongoose from "mongoose";

const visitorLogSchema = new mongoose.Schema({
  ipHash: { type: String, required: true },
  path: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  referrer: { type: String },
  browser: { type: String },
  deviceType: { type: String },
  country: { type: String },
  duration: { type: Number, default: 0 } // duration of session in seconds
}, { timestamps: true });

export default mongoose.model("VisitorLog", visitorLogSchema);
