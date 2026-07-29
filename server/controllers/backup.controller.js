import fs from "fs";
import path from "path";
import multer from "multer";
import { createBackupZip, restoreFromZip } from "../utils/zipHelper.js";
import Activity from "../models/Activity.js";

const logActivity = async (adminId, action, details, req) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await Activity.create({ admin: adminId, action, details, ipAddress: ip });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

export const exportBackup = async (req, res) => {
  try {
    const tempDir = path.join(process.cwd(), "server", "temp_backups");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const backupFileName = `ado_center_backup_${timestamp}.zip`;
    const backupFilePath = path.join(tempDir, backupFileName);

    await createBackupZip(backupFilePath);
    await logActivity(req.admin.id, "Backup Database", "Exported database and media uploads backup zip.", req);

    res.download(backupFilePath, backupFileName, (err) => {
      if (err) {
        console.error("Download backup zip error:", err);
      }
      // Delete temporary backup zip from backend disk
      if (fs.existsSync(backupFilePath)) {
        fs.unlinkSync(backupFilePath);
      }
    });
  } catch (error) {
    console.error("Export backup error:", error);
    res.status(500).json({ error: "Failed to generate system backup." });
  }
};

export const restoreBackup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a backup zip file." });
    }

    const uploadedZipPath = req.file.path;

    await restoreFromZip(uploadedZipPath);
    await logActivity(req.admin.id, "Restore Database", "Restored database and media uploads from backup zip.", req);

    // Clean up uploaded zip file
    if (fs.existsSync(uploadedZipPath)) {
      fs.unlinkSync(uploadedZipPath);
    }

    res.status(200).json({ message: "System restored successfully from backup." });
  } catch (error) {
    console.error("Restore backup error:", error);
    // Cleanup file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message || "Failed to restore system backup." });
  }
};
