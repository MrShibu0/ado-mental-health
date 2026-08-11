import fs from "fs";
import path from "path";
import Gallery from "../models/Gallery.js";
import Media from "../models/Media.js";
import { processImage } from "./imageProcessor.js";

const SYSTEM_IMAGES_MAPPING = {
  "common.logo": {
    title: "ADO Center Logo",
    description: "ADO Center official logo badge",
    category: "System Logo",
    altText: "Official logo mark of ADO Center",
    source: "logo.png",
    page: "common",
    section: "logo",
    component: "Navbar/Footer",
    item: "Logo",
    refId: "Header/Footer"
  },
  "common.hero": {
    title: "Generic Page Hero Banner",
    description: "Default banner image shown in generic page header sections",
    category: "System Hero",
    altText: "Default hero graphic backdrop for mental health pages",
    source: "Hero Section Image.png",
    page: "common",
    section: "hero",
    component: "Hero",
    item: "Hero Banner",
    refId: "Hero"
  },
  "home.hero.slide1": {
    title: "Group Therapy Slide",
    description: "Group therapy session for community members in La Gonâve",
    category: "System Hero",
    altText: "Group therapy session of people sitting in a circle",
    source: "Group Therapy.png",
    page: "home",
    section: "hero-slide-1",
    component: "HomeHero",
    item: "Hero Slide 1",
    refId: "Hero"
  },
  "home.hero.slide2": {
    title: "Mental Health Counseling Slide",
    description: "One-on-one therapy session at the clinic",
    category: "System Hero",
    altText: "Mental health professional counseling a patient in a private office",
    source: "Mental Health Counseling Scene.png",
    page: "home",
    section: "hero-slide-2",
    component: "HomeHero",
    item: "Hero Slide 2",
    refId: "Hero"
  },
  "home.hero.slide3": {
    title: "Community Resilience Slide",
    description: "Community resilience programs and outreach",
    category: "System Hero",
    altText: "Community group planting a tree together",
    source: "Community Resilience.png",
    page: "home",
    section: "hero-slide-3",
    component: "HomeHero",
    item: "Hero Slide 3",
    refId: "Hero"
  },
  "home.welcome": {
    title: "Welcome Section Image",
    description: "Welcome banner image highlighting community support",
    category: "System Section",
    altText: "Children and community members gathered in a circle holding hands",
    source: "Community Resilience & Well-being.png",
    page: "home",
    section: "welcome",
    component: "WelcomeSection",
    item: "Welcome Banner",
    refId: "Welcome"
  },
  "home.volunteer": {
    title: "Volunteer Section Background",
    description: "Volunteer registration campaign banner",
    category: "System Section",
    altText: "Counseling scene background for volunteering call to action",
    source: "Mental Health Counseling Scene.png",
    page: "home",
    section: "volunteer",
    component: "Volunteer",
    item: "Volunteer Banner",
    refId: "Volunteer"
  },
  "home.finalCta": {
    title: "Footer final Call to Action Image",
    description: "Final CTA background image",
    category: "System Section",
    altText: "Community resilience and support visual backdrop",
    source: "Community Resilience & Well-being.png",
    page: "home",
    section: "cta",
    component: "FinalCTA",
    item: "CTA Background",
    refId: "Final CTA"
  },
  "about.hero": {
    title: "About Page Hero Banner",
    description: "Hero banner image on the About Us page",
    category: "System Hero",
    altText: "Counseling session in a clinical setting representing the About page hero banner",
    source: "Mental Health Counseling Scene.png",
    page: "about",
    section: "hero",
    component: "AboutHero",
    item: "Hero Banner",
    refId: "Hero"
  },
  "about.story": {
    title: "About Our Story Image",
    description: "Visual banner representation on the Our Story panel",
    category: "System Section",
    altText: "Community outreach session representing company foundation",
    source: "Community Outreach Program.png",
    page: "about",
    section: "story",
    component: "OurStory",
    item: "Story Panel",
    refId: "Our Story"
  },
  "about.matters": {
    title: "About Why Mental Health Matters Image",
    description: "Matters banner representing mental wellbeing significance",
    category: "System Section",
    altText: "Family therapy discussion representing family values",
    source: "Family Therapy Service.png",
    page: "about",
    section: "matters",
    component: "WhyMentalHealthMatters",
    item: "Context Panel",
    refId: "Why Mental Health Matters"
  },
  "about.cta": {
    title: "About Call to Action Image",
    description: "Banner backdrop on the bottom about us call-to-action",
    category: "System Section",
    altText: "Community support structure representing organizational growth",
    source: "Community Resilience.png",
    page: "about",
    section: "cta",
    component: "AboutCTA",
    item: "CTA Banner",
    refId: "About CTA"
  },
  "home.outreach.slide1": {
    title: "Outreach Program - School Mental Health",
    description: "School mental health program outreach in La Gonâve",
    category: "System Section",
    altText: "School program session with children",
    source: "School Mental Health Program.png",
    page: "home",
    section: "outreach-slide-1",
    component: "CommunityOutreach",
    item: "School Program Slide 1",
    refId: "Community Outreach"
  },
  "home.outreach.slide2": {
    title: "Outreach Program - Family Therapy",
    description: "Family counseling outreach services",
    category: "System Section",
    altText: "Family therapy discussion scene",
    source: "Family Therapy Service.png",
    page: "home",
    section: "outreach-slide-2",
    component: "CommunityOutreach",
    item: "Family Therapy Slide 2",
    refId: "Community Outreach"
  },
  "home.outreach.slide3": {
    title: "Outreach Program - Group Therapy",
    description: "Group therapy session",
    category: "System Section",
    altText: "Group therapy circle",
    source: "Group Therapy.png",
    page: "home",
    section: "outreach-slide-3",
    component: "CommunityOutreach",
    item: "Group Therapy Slide 3",
    refId: "Community Outreach"
  },
  "home.outreach.slide4": {
    title: "Outreach Program - Training",
    description: "Training and capacity building session for local leaders",
    category: "System Section",
    altText: "Staff capacity training workshop",
    source: "Training & Capacity Building.png",
    page: "home",
    section: "outreach-slide-4",
    component: "CommunityOutreach",
    item: "Training Slide 4",
    refId: "Community Outreach"
  },
  "home.outreach.slide5": {
    title: "Outreach Program - Community Outreach",
    description: "Outreach program card",
    category: "System Section",
    altText: "Community resilience programs and outreach session banner",
    source: "Community Outreach Program.png",
    page: "home",
    section: "outreach-slide-5",
    component: "CommunityOutreach",
    item: "Community Outreach Slide 5",
    refId: "Community Outreach"
  },
  "home.service.counseling": {
    title: "Service - Mental Health Counseling",
    description: "One-on-one professional therapy sessions",
    category: "System Resource",
    altText: "Counselor advising a patient in a private setting",
    source: "Mental Health Counseling Scene.png",
    page: "home",
    section: "service-counseling",
    component: "EnhancedServices",
    item: "Counseling Service Card",
    refId: "Enhanced Services"
  },
  "home.service.group": {
    title: "Service - Group Therapy",
    description: "Group therapy support programs",
    category: "System Resource",
    altText: "Support group gathering circle",
    source: "Group Therapy.png",
    page: "home",
    section: "service-group",
    component: "EnhancedServices",
    item: "Group Therapy Card",
    refId: "Enhanced Services"
  },
  "home.service.family": {
    title: "Service - Family Therapy",
    description: "Resolving domestic disputes and relational conflicts",
    category: "System Resource",
    altText: "Therapist conducting counseling with family members",
    source: "Family Therapy Service.png",
    page: "home",
    section: "service-family",
    component: "EnhancedServices",
    item: "Family Therapy Card",
    refId: "Enhanced Services"
  },
  "home.service.crisis": {
    title: "Service - Crisis Intervention",
    description: "Emergency support and stabilization helpdesk",
    category: "System Resource",
    altText: "Crisis response team consulting in urgency",
    source: "Crisis Intervention.png",
    page: "home",
    section: "service-crisis",
    component: "EnhancedServices",
    item: "Crisis Intervention Card",
    refId: "Enhanced Services"
  },
  "home.service.psychiatric": {
    title: "Service - Psychiatric Consultation",
    description: "Clinical checkup and treatment planning",
    category: "System Resource",
    altText: "Psychiatrist consulting with a client in a clinical setting",
    source: "Psychiatric Consultation.png",
    page: "home",
    section: "service-psychiatric",
    component: "EnhancedServices",
    item: "Psychiatric Consultation Card",
    refId: "Enhanced Services"
  },
  "home.service.community": {
    title: "Service - Community Outreach",
    description: "Community program and workshops",
    category: "System Resource",
    altText: "Outreach workshop session",
    source: "Community Outreach Program.png",
    page: "home",
    section: "service-community",
    component: "EnhancedServices",
    item: "Community Outreach Card",
    refId: "Enhanced Services"
  },
  "home.story.slide1": {
    title: "Success Story - Family Restoration",
    description: "Successfully resolved family conflicts",
    category: "System Section",
    altText: "Happy family counseling session",
    source: "Family Therapy Service.png",
    page: "home",
    section: "success-story-1",
    component: "SuccessStories",
    item: "Family Restoration",
    refId: "Success Stories"
  },
  "home.story.slide2": {
    title: "Success Story - Individual Recovery",
    description: "Successfully resolved acute distress and anxiety",
    category: "System Section",
    altText: "Therapist and smiling client",
    source: "Mental Health Counseling Scene.png",
    page: "home",
    section: "success-story-2",
    component: "SuccessStories",
    item: "Individual Recovery",
    refId: "Success Stories"
  },
  "home.story.slide3": {
    title: "Success Story - Community Growth",
    description: "Trained community leaders expanding peer support networks",
    category: "System Section",
    altText: "Community meeting in progress",
    source: "Community Outreach Program.png",
    page: "home",
    section: "success-story-3",
    component: "SuccessStories",
    item: "Community Growth",
    refId: "Success Stories"
  },
  "donate.hero": {
    title: "Donation Hero Banner",
    description: "Hero banner graphic shown on the Stripe Donation Page",
    category: "System Banner",
    altText: "Donation page header background illustration",
    source: "Contact Page Banner.png",
    page: "donate",
    section: "hero",
    component: "DonationHero",
    item: "Donation Banner",
    refId: "Hero"
  },
  "impact.background": {
    title: "Impact Dashboard Background",
    description: "Backdrop graphics displaying metrics dashboard details",
    category: "System Banner",
    altText: "Visual statistics backdrop chart and patterns",
    source: "Impact Dashboard Background.png",
    page: "impact",
    section: "dashboard",
    component: "ImpactDashboard",
    item: "Background Banner",
    refId: "Dashboard"
  },
  "mission.care": {
    title: "Mission - Compassionate Care",
    description: "Compassionate care section banner block",
    category: "System Section",
    altText: "Hands held together in support",
    source: "Compassionate Care.png",
    page: "about",
    section: "mission-care",
    component: "Mission",
    item: "Compassionate Care Panel",
    refId: "Mission"
  },
  "mission.trust": {
    title: "Mission - Confidentiality & Trust",
    description: "Confidentiality and trust section banner block",
    category: "System Section",
    altText: "Relational clinical discussion representing confidentiality",
    source: "Confidentiality & Trust.png",
    page: "about",
    section: "mission-trust",
    component: "Mission",
    item: "Confidentiality & Trust Panel",
    refId: "Mission"
  },
  "mission.resilience": {
    title: "Mission - Community Resilience",
    description: "Community resilience section banner block",
    category: "System Section",
    altText: "Grassroots community collaboration",
    source: "Community Resilience.png",
    page: "about",
    section: "mission-resilience",
    component: "Mission",
    item: "Resilience Panel",
    refId: "Mission"
  },
  "programs.outreach": {
    title: "Programs - Community Outreach",
    description: "Outreach program block on community programs page",
    category: "System Partner",
    altText: "Village gathering in La Gonâve",
    source: "Community Outreach Program.png",
    page: "programs",
    section: "outreach",
    component: "CommunityPrograms",
    item: "Community Outreach Card",
    refId: "Overview"
  },
  "programs.school": {
    title: "Programs - School Mental Health",
    description: "School mental health program block on community programs page",
    category: "System Partner",
    altText: "Tutor teaching children in local school",
    source: "School Mental Health Program.png",
    page: "programs",
    section: "school",
    component: "CommunityPrograms",
    item: "School Mental Health Card",
    refId: "Overview"
  },
  "programs.radio": {
    title: "Programs - Community Radio",
    description: "Radio support program block on community programs page",
    category: "System Partner",
    altText: "Broadcast recording studio panel",
    source: "Community Radio Programs.png",
    page: "programs",
    section: "radio",
    component: "CommunityPrograms",
    item: "Community Radio Card",
    refId: "Overview"
  },
  "programs.support": {
    title: "Programs - Support Programs",
    description: "Peer groups support program block on community programs page",
    category: "System Partner",
    altText: "Staff gathering representing support programs",
    source: "Support Programs.png",
    page: "programs",
    section: "support",
    component: "CommunityPrograms",
    item: "Support Programs Card",
    refId: "Overview"
  },
  "contact.hero": {
    title: "Contact Page Banner",
    description: "Backdrop banner for the Contact Us help form Page",
    category: "System Banner",
    altText: "Contact banner backdrop graphics",
    source: "Contact Page Banner.png",
    page: "contact",
    section: "hero",
    component: "Contact",
    item: "Contact Banner",
    refId: "Hero"
  },
  "team.hero": {
    title: "Team Section Image",
    description: "Team and staff banner illustration on the Team Page",
    category: "System Banner",
    altText: "ADO team portrait background representing unity",
    source: "Team Section.png",
    page: "team",
    section: "hero",
    component: "Team",
    item: "Team Banner",
    refId: "Hero"
  },
  "training.hero": {
    title: "Training & Capacity Building Banner",
    description: "Banner display for the Training page header section",
    category: "System Banner",
    altText: "Clinic workshop room showing capacity building",
    source: "Training & Capacity Building.png",
    page: "training",
    section: "hero",
    component: "Training",
    item: "Training Banner",
    refId: "Hero"
  },
  "services.list.counseling": {
    title: "Service Card - Mental Health Counseling",
    description: "Counseling card representation inside the services grid page",
    category: "System Resource",
    altText: "Therapist writing down notes with a client sitting in front",
    source: "Mental Health Counseling Scene.png",
    page: "services",
    section: "counseling",
    component: "Services",
    item: "Individual counseling card",
    refId: "List"
  },
  "services.list.psychiatric": {
    title: "Service Card - Psychiatric Consultation",
    description: "Psychiatric consultation representation inside the services grid page",
    category: "System Resource",
    altText: "Clinical checkup representation",
    source: "Psychiatric Consultation.png",
    page: "services",
    section: "psychiatric",
    component: "Services",
    item: "Psychiatric Consultation card",
    refId: "List"
  },
  "services.list.family": {
    title: "Service Card - Family Therapy",
    description: "Family therapy representation inside the services grid page",
    category: "System Resource",
    altText: "Therapist conducting counseling with family members",
    source: "Family Therapy Service.png",
    page: "services",
    section: "family",
    component: "Services",
    item: "Family Therapy card",
    refId: "List"
  },
  "services.list.assessment": {
    title: "Service Card - Psychological Assessment",
    description: "Assessments card representation inside the services grid page",
    category: "System Resource",
    altText: "Psychological testing and diagnosis worksheets",
    source: "Psychological Assessments.png",
    page: "services",
    section: "assessment",
    component: "Services",
    item: "Psychological Assessment card",
    refId: "List"
  },
  "services.list.group": {
    title: "Service Card - Group Therapy",
    description: "Group support card representation inside the services grid page",
    category: "System Resource",
    altText: "Support group gathering circle",
    source: "Group Therapy.png",
    page: "services",
    section: "group",
    component: "Services",
    item: "Group Therapy card",
    refId: "List"
  },
  "services.list.crisis": {
    title: "Service Card - Crisis Intervention",
    description: "Crisis counseling card representation inside the services grid page",
    category: "System Resource",
    altText: "Crisis intervention and immediate support session",
    source: "Crisis Intervention.png",
    page: "services",
    section: "crisis",
    component: "Services",
    item: "Crisis Intervention card",
    refId: "List"
  },
  "services.list.substance": {
    title: "Service Card - Substance Use Support",
    description: "Substance support card representation inside the services grid page",
    category: "System Resource",
    altText: "Individual counseling session focusing on substance use support",
    source: "Substance Use Support.png",
    page: "services",
    section: "substance",
    component: "Services",
    item: "Substance Use card",
    refId: "List"
  },
  "services.list.olderAdult": {
    title: "Service Card - Older Adult Care",
    description: "Older adult care representation inside the services grid page",
    category: "System Resource",
    altText: "Care worker assisting older client in a compassionate conversation",
    source: "Older Adult Mental Health Care.png",
    page: "services",
    section: "older-adult",
    component: "Services",
    item: "Older Adult card",
    refId: "List"
  }
};

export const seedSystemImages = async (superAdminId) => {
  console.log("🚀 Starting system images seeder...");
  try {
    const keys = Object.keys(SYSTEM_IMAGES_MAPPING);
    
    for (const key of keys) {
      const info = SYSTEM_IMAGES_MAPPING[key];
      const sourcePath = path.join(process.cwd(), "src", "Images", info.source);

      if (!fs.existsSync(sourcePath)) {
        console.warn(`⚠️ Source file not found: ${sourcePath}. Skipping.`);
        continue;
      }

      const usedOnArray = [{
        page: info.page,
        section: info.section,
        component: info.component,
        item: info.item,
        refId: key,
        type: "system"
      }];

      // 1. Check if the system image is already seeded
      const existing = await Gallery.findOne({ systemKey: key });
      const customFilename = "system_" + key.replace(/\./g, "_");
      const folder = "gallery/system";

      if (existing) {
        // Enforce the enriched usedOn mapping metadata and other details
        existing.title = info.title;
        existing.description = info.description;
        existing.category = info.category;
        existing.altText = info.altText;
        existing.usedOn = usedOnArray;
        existing.usageType = "system";
        await existing.save();

        // Verify physical files exist on this server's local filesystem
        const originalFilePath = path.join(process.cwd(), "server", existing.imageUrl);
        const thumbnailFilePath = path.join(process.cwd(), "server", existing.thumbnailUrl);
        const hasStablePath = existing.imageUrl.includes("gallery/system/");
        const filesExist = fs.existsSync(originalFilePath) && fs.existsSync(thumbnailFilePath);

        if (hasStablePath && filesExist) {
          // Stable path and files exist, safe to skip
          continue;
        }

        console.log(`🔧 Physical files missing or path migration needed for ${key}. Re-generating assets...`);
        try {
          const fileBuffer = fs.readFileSync(sourcePath);
          const processed = await processImage(fileBuffer, info.source, folder, customFilename);

          const mediaObj = await Media.findById(existing.mediaRef);
          if (mediaObj) {
            mediaObj.filename = processed.filename;
            mediaObj.url = processed.imageUrl;
            mediaObj.thumbnailUrl = processed.thumbnailUrl;
            mediaObj.size = processed.size;
            await mediaObj.save();
          }

          existing.imageUrl = processed.imageUrl;
          existing.thumbnailUrl = processed.thumbnailUrl;
          await existing.save();

          console.log(`✅ Restored missing physical assets for system image: ${key}`);
        } catch (err) {
          console.error(`❌ Failed to restore assets for ${key}:`, err);
        }
        continue;
      }

      // Read file buffer
      const fileBuffer = fs.readFileSync(sourcePath);

      // Process image using processor (compresses and sizes to WEBP original + thumbnail)
      const processed = await processImage(fileBuffer, info.source, folder, customFilename);

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
        usedOn: usedOnArray,
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
