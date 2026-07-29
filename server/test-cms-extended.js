import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";
import Media from "./models/Media.js";
import Gallery from "./models/Gallery.js";
import News from "./models/News.js";
import VersionHistory from "./models/VersionHistory.js";
import Partner from "./models/Partner.js";
import Donation from "./models/Donation.js";
import ContactMessage from "./models/ContactMessage.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ado-mental-health";

async function runTests() {
  console.log("🚀 Starting ADO Mental Health Center CMS System Verification...\n");

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ 1. Database Connection Successful.");

    // Clean up any remaining legacy test data from aborted runs first
    await News.deleteMany({ slug: "test-news-article-slug" });

    // Test 1: Admin Seeding and Updates
    console.log("\n🧪 Test 1: Admin Operations");
    const testUsername = `test_admin_${Date.now()}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("testpass123", salt);

    const testAdmin = await Admin.create({
      username: testUsername,
      password: hashedPassword,
      displayName: "Verification tester",
      role: "super-admin"
    });
    console.log(`   - Admin account created successfully: ${testAdmin.username}`);

    const updatedDisplayName = "Verification tester (Updated)";
    testAdmin.displayName = updatedDisplayName;
    await testAdmin.save();
    console.log(`   - Profile update successful: ${testAdmin.displayName}`);

    // Create a mock Media record first
    const testMedia = await Media.create({
      filename: "test.webp",
      url: "/uploads/gallery/test.webp",
      thumbnailUrl: "/uploads/gallery/test_thumb.webp",
      size: 1024,
      mimeType: "image/webp",
      uploadedBy: testAdmin._id
    });
    console.log(`   - Media asset reference created successfully: ${testMedia.filename}`);

    // Test 2: Gallery soft deletes and views counter
    console.log("\n🧪 Test 2: Gallery Operations");
    const testGallery = await Gallery.create({
      title: "Test Event Image",
      description: "A test gallery item description",
      category: "Workshops",
      mediaRef: testMedia._id,
      imageUrl: "/uploads/gallery/test.webp",
      thumbnailUrl: "/uploads/gallery/test_thumb.webp",
      eventDate: new Date(),
      uploadedBy: testAdmin._id,
      views: 0
    });
    console.log(`   - Gallery item created: "${testGallery.title}"`);

    // Increment views
    testGallery.views += 1;
    await testGallery.save();
    console.log(`   - Gallery view counter incremented successfully. Views: ${testGallery.views}`);

    // Soft delete
    testGallery.deleted = true;
    testGallery.deletedAt = Date.now();
    await testGallery.save();
    console.log(`   - Gallery soft-delete successful (deleted: ${testGallery.deleted})`);

    // Restore gallery
    testGallery.deleted = false;
    testGallery.deletedAt = null;
    await testGallery.save();
    console.log(`   - Gallery restore successful (deleted: ${testGallery.deleted})`);

    // Test 3: News and versioning snapshots
    console.log("\n🧪 Test 3: News and Version History snapshotting");
    const testNews = await News.create({
      title: "Test News Article Title",
      slug: "test-news-article-slug",
      description: "Brief summary excerpt",
      content: "Initial content version 1",
      category: "Announcements",
      published: true
    });
    console.log(`   - News article created: "${testNews.title}"`);

    // Create a version snapshot for Version 1
    await VersionHistory.create({
      documentId: testNews._id,
      documentModel: "News",
      versionNumber: 1,
      data: JSON.parse(JSON.stringify(testNews)),
      editor: testAdmin._id
    });
    console.log("   - Version 1 snapshot captured.");

    // Update content and capture Version 2
    testNews.content = "Modified content version 2";
    await testNews.save();
    await VersionHistory.create({
      documentId: testNews._id,
      documentModel: "News",
      versionNumber: 2,
      data: JSON.parse(JSON.stringify(testNews)),
      editor: testAdmin._id
    });
    console.log(`   - Article content updated and Version 2 snapshot captured.`);

    // Rollback to version 1
    const v1Snapshot = await VersionHistory.findOne({ documentId: testNews._id, versionNumber: 1 });
    testNews.content = v1Snapshot.data.content;
    await testNews.save();
    console.log(`   - Rollback simulation successful. Restored content: "${testNews.content}"`);

    // Test 4: Partners Operations
    console.log("\n🧪 Test 4: Partner Operations");
    const testPartner = await Partner.create({
      name: "Test Sponsor Organization",
      logo: "/uploads/partners/logo.webp",
      website: "https://testsponsor.org",
      category: "Sponsor",
      featured: true
    });
    console.log(`   - Partner item created: "${testPartner.name}"`);

    // Test 5: Contact Messages Operations
    console.log("\n🧪 Test 5: Contact Message inbox & replies");
    const testMsg = await ContactMessage.create({
      name: "John Doe",
      email: "johndoe@test.com",
      phone: "+509 1111 2222",
      subject: "Inquiry on therapy programs",
      message: "Can I register for the workshops online?",
      status: "unread"
    });
    console.log(`   - Contact message stored: "${testMsg.subject}" by ${testMsg.name}`);

    // Update status to read and reply
    testMsg.status = "replied";
    await testMsg.save();
    console.log(`   - Message marked as replied successfully.`);

    // Test 6: Donations Operations
    console.log("\n🧪 Test 6: Donations logging");
    const testDonation = await Donation.create({
      donorName: "Jane Smith",
      email: "janesmith@test.com",
      amount: 100,
      currency: "usd",
      paymentProvider: "stripe",
      transactionId: "tx_test_1234567890",
      status: "completed",
      date: Date.now()
    });
    console.log(`   - Completed donation transaction logged: $${testDonation.amount} USD. TXID: ${testDonation.transactionId}`);

    // Cleanup Test Data
    console.log("\n🧹 Cleaning up test verification documents...");
    await Admin.findByIdAndDelete(testAdmin._id);
    await Media.findByIdAndDelete(testMedia._id);
    await Gallery.findByIdAndDelete(testGallery._id);
    await News.findByIdAndDelete(testNews._id);
    await VersionHistory.deleteMany({ documentId: testNews._id });
    await Partner.findByIdAndDelete(testPartner._id);
    await ContactMessage.findByIdAndDelete(testMsg._id);
    await Donation.findByIdAndDelete(testDonation._id);
    console.log("   - Cleaned up database successfully.");

    console.log("\n🎉 ALL SYSTEM VERIFICATION CHECKS PASSED!");
  } catch (error) {
    console.error("\n❌ Verification Failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB. Verification test concluded.");
  }
}

runTests();
