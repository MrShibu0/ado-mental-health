import mongoose from "mongoose";

const seoSchema = new mongoose.Schema({
  title: { type: String },
  metaDescription: { type: String },
  keywords: [{ type: String }],
  ogImageUrl: { type: String }
}, { _id: false });

const pageContentSchema = new mongoose.Schema({
  page: { type: String, required: true }, // e.g. "home", "about", "services"
  section: { type: String, required: true }, // e.g. "hero", "mission"
  locale: { type: String, enum: ["en", "fr", "ht"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  seo: { type: seoSchema, default: () => ({}) }
}, { timestamps: true });

// Ensure we have a unique combination for quick lookups and upserts
pageContentSchema.index({ page: 1, section: 1, locale: 1 }, { unique: true });

export default mongoose.model("PageContent", pageContentSchema);
