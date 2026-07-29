import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed."), false);
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const blockedExtensions = [".exe", ".bat", ".js", ".php", ".svg", ".sh", ".py", ".pl", ".rb", ".html", ".htm", ".xml"];
  
  if (blockedExtensions.includes(ext)) {
    return cb(new Error("Upload rejected: File format blocked for security reasons."), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

export default upload;
