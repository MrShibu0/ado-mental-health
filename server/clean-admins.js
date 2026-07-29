import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ado-mental-health";

async function cleanAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    const deleteResult = await Admin.deleteMany({});
    console.log(`🧹 Wiped all admin accounts from database: deleted ${deleteResult.deletedCount} items.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

cleanAdmins();
