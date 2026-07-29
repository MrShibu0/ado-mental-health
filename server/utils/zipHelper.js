import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import * as archiverNamespace from "archiver";
import * as unzipperNamespace from "unzipper";

const archiver = archiverNamespace.default || archiverNamespace;
const unzipper = unzipperNamespace.default || unzipperNamespace;

const UPLOADS_ROOT = path.join(process.cwd(), "server", "uploads");

// Dump MongoDB collections to JSON
const dumpCollections = async () => {
  const collections = mongoose.connection.collections;
  const dump = {};
  for (const key in collections) {
    const documents = await collections[key].find({}).toArray();
    dump[key] = documents;
  }
  return JSON.stringify(dump, null, 2);
};

// Create a zipped backup of all collections and files
export const createBackupZip = (outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => resolve(archive.pointer()));
      archive.on("error", (err) => reject(err));

      archive.pipe(output);

      // Dump DB collections
      const dbDumpJson = await dumpCollections();
      archive.append(dbDumpJson, { name: "db_backup.json" });

      // Add uploads directory if it exists
      if (fs.existsSync(UPLOADS_ROOT)) {
        archive.directory(UPLOADS_ROOT, "uploads");
      }

      await archive.finalize();
    } catch (error) {
      reject(error);
    }
  });
};

// Restore from a zip file
export const restoreFromZip = (zipFilePath) => {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(process.cwd(), "server", "temp_restore");

    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: tempDir }))
      .on("close", async () => {
        try {
          const dbBackupFile = path.join(tempDir, "db_backup.json");
          const tempUploadsDir = path.join(tempDir, "uploads");

          // Restore uploads
          if (fs.existsSync(tempUploadsDir)) {
            if (!fs.existsSync(UPLOADS_ROOT)) {
              fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
            }
            fs.cpSync(tempUploadsDir, UPLOADS_ROOT, { recursive: true });
          }

          // Restore DB
          if (fs.existsSync(dbBackupFile)) {
            const dbData = JSON.parse(fs.readFileSync(dbBackupFile, "utf-8"));
            for (const collName in dbData) {
              const model = mongoose.connection.collections[collName];
              if (model) {
                // Clear collection first
                await model.deleteMany({});
                
                // Insert documents
                if (dbData[collName].length > 0) {
                  const docs = dbData[collName].map(doc => {
                    // Helper to parse dates and objectIds recursively
                    const parseDoc = (item) => {
                      if (item === null || item === undefined) return item;
                      if (typeof item === "object") {
                        if (item.$oid) return new mongoose.Types.ObjectId(item.$oid);
                        if (item.$date) return new Date(item.$date);
                        
                        // Recurse into arrays and nested objects
                        if (Array.isArray(item)) {
                          return item.map(parseDoc);
                        }
                        
                        const newObj = {};
                        for (const key in item) {
                          newObj[key] = parseDoc(item[key]);
                        }
                        return newObj;
                      }
                      // Handle string ids
                      return item;
                    };
                    
                    const parsed = parseDoc(doc);
                    // Ensure the main _id is an ObjectId
                    if (parsed._id && typeof parsed._id === "string") {
                      parsed._id = new mongoose.Types.ObjectId(parsed._id);
                    }
                    return parsed;
                  });
                  await model.insertMany(docs);
                }
              }
            }
          }

          // Clean up temp directory
          fs.rmSync(tempDir, { recursive: true, force: true });
          resolve();
        } catch (err) {
          // Clean up temp directory on error
          fs.rmSync(tempDir, { recursive: true, force: true });
          reject(err);
        }
      })
      .on("error", (err) => {
        fs.rmSync(tempDir, { recursive: true, force: true });
        reject(err);
      });
  });
};
