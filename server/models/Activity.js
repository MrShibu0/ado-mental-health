import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // null if login failure
  action: { 
    type: String, 
    required: true,
    enum: [
      "Login Success", "Login Failure", "Logout", "Password Reset", "Password Change", 
      "Profile Update", "Permission Change", "Image Upload", "Image Edit", "Image Delete", 
      "Donation Settings Changes", "News Publish", "News Edit", "News Delete", 
      "Partner Create", "Partner Edit", "Partner Delete", "Settings Update", 
      "Restore Database", "Backup Database"
    ] 
  },
  details: { type: String },
  ipAddress: { type: String }
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
