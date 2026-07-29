import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true }, // e.g. /uploads/media/logo.webp
  website: { type: String },
  category: { type: String, enum: ["Sponsor", "Partner", "Supporter"], default: "Partner" },
  description: { type: String },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Partner", partnerSchema);
