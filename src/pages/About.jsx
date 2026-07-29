import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { AboutHero } from "../components/sections/about/AboutHero";
import { AboutIntro } from "../components/sections/about/AboutIntro";
import { OurStory } from "../components/sections/about/OurStory";
import { MissionVision } from "../components/sections/about/MissionVision";
import { CoreValues } from "../components/sections/about/CoreValues";
import { Founder } from "../components/sections/about/Founder";
import { WhyMentalHealthMatters } from "../components/sections/about/WhyMentalHealthMatters";
import { WhoWeServe } from "../components/sections/about/WhoWeServe";
import { CommunityCommitment } from "../components/sections/about/CommunityCommitment";
import { OurApproach } from "../components/sections/about/OurApproach";
import { WhyChooseUs } from "../components/sections/about/WhyChooseUs";
import { LongTermVision } from "../components/sections/about/LongTermVision";
import { EnhancedImpact } from "../components/sections/about/EnhancedImpact";
import { GuidingPrinciples } from "../components/sections/about/GuidingPrinciples";
import { AboutCTA } from "../components/sections/about/AboutCTA";

const About = () => {
  const { t } = useTranslation('about');

  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
      </Helmet>
      
      <main>
        {/* 1. Custom Hero Section */}
        <AboutHero />
        
        {/* 2. Introduction */}
        <AboutIntro />
        
        {/* 3. Our Story */}
        <OurStory />
        
        {/* 4. Founder Section */}
        <Founder />
        
        {/* 5. Mission & Vision */}
        <MissionVision />
        
        {/* 6. Core Values */}
        <CoreValues />
        
        {/* 7. Guiding Principles */}
        <GuidingPrinciples />
        
        {/* 8. Why Mental Health Matters */}
        <WhyMentalHealthMatters />
        
        {/* 9. Who We Serve */}
        <WhoWeServe />
        
        {/* 10. Our Approach */}
        <OurApproach />
        
        {/* 11. Why Choose ADO Center */}
        <WhyChooseUs />
        
        {/* 12. Community Commitment */}
        <CommunityCommitment />
        
        {/* 13. Long-Term Vision */}
        <LongTermVision />
        
        {/* 14. Impact Highlights */}
        <EnhancedImpact />
        
        {/* 15. Call to Action */}
        <AboutCTA />
      </main>
    </>
  );
};

export default About;
