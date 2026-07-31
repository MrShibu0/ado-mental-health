import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

// Import Routes
import donationRoutes from "./routes/donation.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import newsRoutes from "./routes/news.routes.js";
import partnerRoutes from "./routes/partner.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import pageRoutes from "./routes/page.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import backupRoutes from "./routes/backup.routes.js";
import searchRoutes from "./routes/search.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ado-mental-health";

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    seedAdmin(); // Run admin seeder on successful connection
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Seeder logic for first admin user
const seedAdmin = async () => {
  try {
    const Admin = (await import("./models/Admin.js")).default;
    const count = await Admin.countDocuments();
    if (count === 0) {
      const bcrypt = (await import("bcryptjs")).default;
      const username = process.env.ADMIN_USERNAME || "admin";
      const password = process.env.ADMIN_PASSWORD || "admin123";

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await Admin.create({
        username,
        password: hashedPassword,
        displayName: "Super Administrator",
        role: "super-admin"
      });
      console.log(`👤 Seeded first admin user: ${username} with role super-admin`);
    }
  } catch (err) {
    console.error("Error seeding default admin:", err);
  }
};

// Webhook needs raw body, so we separate it from the standard JSON parser
app.use("/api/webhook", express.raw({ type: "application/json" }));

// Standard middleware
app.use(cors({
  origin: true,
  credentials: true // allows cookie headers to be sent in cross-origin requests
}));
app.use(express.json());
app.use(cookieParser());

// Static file serving for uploads
app.use("/uploads", express.static(path.join(process.cwd(), "server", "uploads")));

// Register Routers
app.use("/api", donationRoutes);
app.use("/api", adminRoutes);
app.use("/api", galleryRoutes);
app.use("/api", newsRoutes);
app.use("/api", partnerRoutes);
app.use("/api", contactRoutes);
app.use("/api", settingsRoutes);
app.use("/api", pageRoutes);
app.use("/api", mediaRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", backupRoutes);
app.use("/api", searchRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "ADO Backend is running" });
});

// Serve production frontend assets from the Vite build directory
if (process.env.NODE_ENV === "production" || process.env.RENDER) {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  // Catch-all route to serve the React SPA entry index.html for all non-API paths
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
