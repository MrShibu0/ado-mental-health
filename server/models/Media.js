import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true }, // e.g. "/uploads/media/2026/July/photo.webp"
  thumbnailUrl: { type: String }, // e.g. "/uploads/media/2026/July/photo_thumb.webp"
  size: { type: Number, required: true }, // in bytes
  mimeType: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
}, { timestamps: true });

export default mongoose.model("Media", mediaSchema);
