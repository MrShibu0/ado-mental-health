import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { HomeHero } from "../components/sections/home/HomeHero";
import { TrustIndicators } from "../components/sections/home/TrustIndicators";
import { AnimatedImpact } from "../components/sections/home/AnimatedImpact";
import { WelcomeSection } from "../components/sections/home/WelcomeSection";
import { WhyMentalHealth } from "../components/sections/home/WhyMentalHealth";
import { EnhancedServices } from "../components/sections/home/EnhancedServices";
import { HowWeHelp } from "../components/sections/home/HowWeHelp";
import { WhyChooseUsHome } from "../components/sections/home/WhyChooseUsHome";
import { CommunityOutreach } from "../components/sections/home/CommunityOutreach";
import { MeetOurTeam } from "../components/sections/home/MeetOurTeam";
import { SuccessStories } from "../components/sections/home/SuccessStories";
import { EnhancedTestimonials } from "../components/sections/home/EnhancedTestimonials";
import { OurPartners } from "../components/sections/home/OurPartners";
import { Volunteer } from "../components/sections/home/Volunteer";
import { SupportMission } from "../components/sections/home/SupportMission";
import { FAQPreview } from "../components/sections/home/FAQPreview";
import { LatestNews } from "../components/sections/home/LatestNews";
import { LatestGallery } from "../components/sections/home/LatestGallery";
import { Newsletter } from "../components/sections/home/Newsletter";
import { ContactPreview } from "../components/sections/home/ContactPreview";
import { FinalCTA } from "../components/sections/home/FinalCTA";

const Home = () => {
  const { t } = useTranslation("home");
  return (
    <>
      <Helmet>
        <title>{t("seo.title")}</title>
        <meta name="description" content={t("seo.description")} />
      </Helmet>
      <main>
        <HomeHero />
        <TrustIndicators />
        <AnimatedImpact />
        <WelcomeSection />
        <WhyMentalHealth />
        <EnhancedServices />
        <HowWeHelp />
        <WhyChooseUsHome />
        <CommunityOutreach />
        <MeetOurTeam />
        <SuccessStories />
        <EnhancedTestimonials />
        <OurPartners />
        <Volunteer />
        <SupportMission />
        <FAQPreview />
        <LatestGallery />
        <LatestNews />
        <Newsletter />
        <ContactPreview />
        <FinalCTA />
      </main>
    </>
  );
};

export default Home;
