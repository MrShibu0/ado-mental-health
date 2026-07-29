import mongoose from "mongoose";

const versionHistorySchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  documentModel: { type: String, enum: ["News", "PageContent"], required: true },
  versionNumber: { type: Number, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  editor: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
}, { timestamps: true });

export default mongoose.model("VersionHistory", versionHistorySchema);
