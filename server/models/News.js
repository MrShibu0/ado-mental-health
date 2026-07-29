import mongoose from "mongoose";

const seoSchema = new mongoose.Schema({
  title: { type: String },
  metaDescription: { type: String },
  keywords: [{ type: String }],
  ogImageUrl: { type: String },
  canonicalUrl: { type: String }
}, { _id: false });

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  content: { type: String, required: true },
  coverImage: { type: String }, // path e.g. /uploads/media/file.webp
  category: { type: String, default: "General" },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  seo: { type: seoSchema, default: () => ({}) },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
}, { timestamps: true });

export default mongoose.model("News", newsSchema);
