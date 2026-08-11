import sharp from "sharp";
import fs from "fs";
import path from "path";

const UPLOADS_ROOT = path.join(process.cwd(), "server", "uploads");

export const processImage = async (fileBuffer, originalFilename, subfolder = "media", customFilename = null) => {
  const date = new Date();
  const year = date.getFullYear().toString();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = monthNames[date.getMonth()];

  const relativeDir = customFilename ? subfolder : path.join(subfolder, year, month);
  const targetDir = path.join(UPLOADS_ROOT, relativeDir);

  // Ensure directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Generate base filename
  const cleanName = customFilename || path.parse(originalFilename).name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const originalFilenameWebp = customFilename ? `${cleanName}.webp` : `${cleanName}_${Date.now()}.webp`;
  const thumbnailFilenameWebp = customFilename ? `${cleanName}_thumb.webp` : `${cleanName}_${Date.now()}_thumb.webp`;

  const originalPath = path.join(targetDir, originalFilenameWebp);
  const thumbnailPath = path.join(targetDir, thumbnailFilenameWebp);

  // Process original image (max width 1920px, WebP, 80% quality)
  const sharpImg = sharp(fileBuffer);
  const metadata = await sharpImg.metadata();

  let originalResize = sharpImg;
  if (metadata.width > 1920) {
    originalResize = sharpImg.resize({ width: 1920, withoutEnlargement: true });
  }
  await originalResize.webp({ quality: 80 }).toFile(originalPath);

  // Process thumbnail image (max width 400px, WebP, 70% quality)
  await sharp(fileBuffer)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(thumbnailPath);

  const formatUrl = (p) => `/uploads/${p}`.replace(/\\/g, "/");

  // Return relative paths for DB storage
  return {
    imageUrl: formatUrl(path.join(relativeDir, originalFilenameWebp)),
    thumbnailUrl: formatUrl(path.join(relativeDir, thumbnailFilenameWebp)),
    filename: originalFilenameWebp,
    size: fs.statSync(originalPath).size
  };
};
