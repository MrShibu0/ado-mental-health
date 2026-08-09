import fs from "fs";
import path from "path";
import Gallery from "../models/Gallery.js";
import Media from "../models/Media.js";
import { processImage } from "./imageProcessor.js";

const SYSTEM_IMAGES_MAPPING = {
  "home.hero.slide1": {
    title: "Group Therapy Slide",
    description: "Group therapy session for community members in La Gonâve",
    category: "System Hero",
    altText: "Group therapy session of people sitting in a circle",
    source: "Group Therapy.png",
    usedOn: [{ page: "home", section: "hero-slide-1" }]
  },
  "home.hero.slide2": {
    title: "Mental Health Counseling Slide",
    description: "One-on-one therapy session at the clinic",
    category: "System Hero",
    altText: "Mental health professional counseling a patient in a private office",
    source: "Mental Health Counseling Scene.png",
    usedOn: [{ page: "home", section: "hero-slide-2" }]
  },
  "home.hero.slide3": {
    title: "Community Resilience Slide",
    description: "Community resilience programs and outreach",
    category: "System Hero",
    altText: "Community group planting a tree together",
    source: "Community Resilience.png",
    usedOn: [{ page: "home", section: "hero-slide-3" }]
  },
  "home.welcome": {
    title: "Welcome Section Image",
    description: "Welcome banner image highlighting community support",
    category: "System Section",
    altText: "Children and community members gathered in a circle holding hands",
    source: "Community Resilience & Well-being.png",
    usedOn: [{ page: "home", section: "welcome" }]
  },
  "home.volunteer": {
    title: "Volunteer Section Background",
    description: "Volunteer registration campaign banner",
    category: "System Section",
    altText: "Counseling scene background for volunteering call to action",
    source: "Mental Health Counseling Scene.png",
    usedOn: [{ page: "home", section: "volunteer" }]
  },
  "home.finalCta": {
    title: "Footer final Call to Action Image",
    description: "Final CTA background image",
    category: "System Section",
    altText: "Community resilience and support visual backdrop",
    source: "Community Resilience & Well-being.png",
    usedOn: [{ page: "home", section: "cta" }]
  },
  "about.hero": {
    title: "About Page Hero Banner",
    description: "Hero banner image on the About Us page",
    category: "System Hero",
    altText: "Counseling session in a clinical setting representing the About page hero banner",
    source: "Mental Health Counseling Scene.png",
    usedOn: [{ page: "about", section: "hero" }]
  },
  "common.logo": {
    title: "ADO Center Logo",
    description: "ADO Center official logo badge",
    category: "System Logo",
    altText: "Official logo mark of ADO Center",
    source: "logo.png",
    usedOn: [{ page: "common", section: "logo" }]
  },
  "home.outreach.slide1": {
    title: "Outreach Program - School Mental Health",
    description: "School mental health program outreach in La Gonâve",
    category: "System Section",
    altText: "School program session with children",
    source: "School Mental Health Program.png",
    usedOn: [{ page: "home", section: "outreach-slide-1" }]
  },
  "home.outreach.slide2": {
    title: "Outreach Program - Family Therapy",
    description: "Family counseling outreach services",
    category: "System Section",
    altText: "Family therapy discussion scene",
    source: "Family Therapy Service.png",
    usedOn: [{ page: "home", section: "outreach-slide-2" }]
  },
  "home.outreach.slide3": {
    title: "Outreach Program - Group Therapy",
    description: "Group therapy session",
    category: "System Section",
    altText: "Group therapy circle",
    source: "Group Therapy.png",
    usedOn: [{ page: "home", section: "outreach-slide-3" }]
  },
  "home.outreach.slide4": {
    title: "Outreach Program - Training",
    description: "Training and capacity building session for local leaders",
    category: "System Section",
    altText: "Staff capacity training workshop",
    source: "Training & Capacity Building.png",
    usedOn: [{ page: "home", section: "outreach-slide-4" }]
  },
  "home.outreach.slide5": {
    title: "Outreach Program - Community Outreach",
    description: "General neighborhood community outreach and education",
    category: "System Section",
    altText: "Outdoor community meeting and educational session",
    source: "Community Outreach Program.png",
    usedOn: [{ page: "home", section: "outreach-slide-5" }]
  },
  "home.service.counseling": {
    title: "Service - Individual Counseling",
    description: "One-on-one professional counseling representation image",
    category: "System Resource",
    altText: "Counselor listening to a client",
    source: "Mental Health Counseling Scene.png",
    usedOn: [{ page: "home", section: "service-counseling" }]
  },
  "home.service.group": {
    title: "Service - Group Therapy",
    description: "Group therapy program card representation image",
    category: "System Resource",
    altText: "Group therapy meeting circle",
    source: "Group Therapy.png",
    usedOn: [{ page: "home", section: "service-group" }]
  },
  "home.service.family": {
    title: "Service - Family Therapy",
    description: "Family therapy and resolution session card representation image",
    category: "System Resource",
    altText: "Counselor resolving conflict with a family",
    source: "Family Therapy Service.png",
    usedOn: [{ page: "home", section: "service-family" }]
  },
  "home.service.crisis": {
    title: "Service - Crisis Intervention",
    description: "Crisis counseling and support card representation image",
    category: "System Resource",
    altText: "Crisis intervention and immediate support session",
    source: "Crisis Intervention.png",
    usedOn: [{ page: "home", section: "service-crisis" }]
  },
  "home.service.psychiatric": {
    title: "Service - Psychiatric Consultation",
    description: "Service - Psychiatric Consultation",
    category: "System Resource",
    altText: "Clinical checkup and prescription consultation",
    source: "Psychiatric Consultation.png",
    usedOn: [{ page: "home", section: "service-psychiatric" }]
  },
  "home.service.community": {
    title: "Service - Community Outreach",
    description: "Community program and outreach session card representation image",
    category: "System Resource",
    altText: "Community training workshop",
    source: "Community Outreach Program.png",
    usedOn: [{ page: "home", section: "service-community" }]
  },
  "home.story.slide1": {
    title: "Success Story - Family Restoration",
    description: "Successfully resolved family conflicts",
    category: "System Section",
    altText: "Happy family counseling session",
    source: "Family Therapy Service.png",
    usedOn: [{ page: "home", section: "success-story-1" }]
  },
  "home.story.slide2": {
    title: "Success Story - Individual Recovery",
    description: "Successfully resolved acute distress and anxiety",
    category: "System Section",
    altText: "Therapist and smiling client",
    source: "Mental Health Counseling Scene.png",
    usedOn: [{ page: "home", section: "success-story-2" }]
  },
  "home.story.slide3": {
    title: "Success Story - Community Growth",
    description: "Trained community leaders expanding peer support networks",
    category: "System Section",
    altText: "Community meeting in progress",
    source: "Community Outreach Program.png",
    usedOn: [{ page: "home", section: "success-story-3" }]
  }
};

export const seedSystemImages = async (superAdminId) => {
  console.log("🚀 Starting system images seeder...");
  try {
    const keys = Object.keys(SYSTEM_IMAGES_MAPPING);
    
    for (const key of keys) {
      // 1. Check if the system image is already seeded
      const existing = await Gallery.findOne({ systemKey: key });
      if (existing) {
        // Skip, preserving admin modifications
        continue;
      }

      const info = SYSTEM_IMAGES_MAPPING[key];
      const sourcePath = path.join(process.cwd(), "src", "Images", info.source);

      if (!fs.existsSync(sourcePath)) {
        console.warn(`⚠️ Source file not found: ${sourcePath}. Skipping.`);
        continue;
      }

      // Read file buffer
      const fileBuffer = fs.readFileSync(sourcePath);

      // Process image using processor (compresses and sizes to WEBP original + thumbnail)
      const processed = await processImage(fileBuffer, info.source, "gallery");

      // 2. Create Media record
      const media = await Media.create({
        filename: processed.filename,
        url: processed.imageUrl,
        thumbnailUrl: processed.thumbnailUrl,
        size: processed.size,
        mimeType: "image/webp",
        uploadedBy: superAdminId || null
      });

      // 3. Create Gallery record with system key and mappings
      await Gallery.create({
        title: info.title,
        description: info.description,
        category: info.category,
        mediaRef: media._id,
        imageUrl: media.url,
        thumbnailUrl: media.thumbnailUrl,
        altText: info.altText,
        location: "La Gonâve, Haiti",
        eventDate: new Date(),
        featured: false,
        usageType: "system",
        usedOn: info.usedOn,
        systemKey: key,
        uploadedBy: superAdminId || null
      });

      console.log(`✅ Seeded system image: ${key} (${info.title})`);
    }
    
    console.log("🏁 System images seeder completed successfully.");
  } catch (err) {
    console.error("❌ Error seeding system images:", err);
  }
};
