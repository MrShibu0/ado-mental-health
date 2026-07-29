import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  organizationName: { type: String, default: "ADO Center" },
  logo: { type: String }, // e.g. /uploads/media/logo.webp
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  googleMapUrl: { type: String },
  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String }
  },
  mission: { type: String },
  vision: { type: String },
  footerText: { type: String }
}, { timestamps: true });

export default mongoose.model("Settings", settingsSchema);
