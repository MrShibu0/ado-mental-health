import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    required: true,
    enum: [
      "Community Programs", "Counseling", "Family Therapy", 
      "School Programs", "Training", "Workshops", 
      "Community Outreach", "Events", "Team", 
      "Awareness Campaigns", "Other"
    ]
  },
  mediaRef: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
  imageUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  altText: { type: String },
  location: { type: String },
  eventDate: { type: Date, required: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
}, { timestamps: true });

export default mongoose.model("Gallery", gallerySchema);
