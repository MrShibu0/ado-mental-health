import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ado-mental-health";

async function checkAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    const admins = await Admin.find({});
    console.log("Current Admin Accounts in DB:");
    admins.forEach(a => {
      console.log(`- Username: ${a.username}, Display: ${a.displayName}, Role: ${a.role}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdmins();
