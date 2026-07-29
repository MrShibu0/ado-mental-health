import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  profilePhoto: { type: String }, // path to media object URL or standard string
  preferredLanguage: { type: String, enum: ["en", "fr", "ht"], default: "en" },
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  role: { 
    type: String, 
    enum: ["super-admin", "admin", "editor"], 
    default: "admin" 
  }
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
