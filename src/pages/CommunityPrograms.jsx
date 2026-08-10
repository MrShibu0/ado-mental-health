import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { CTASection } from "../components/sections/CTASection";
import { Radio, GraduationCap, Users, HeartHandshake } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { useImageCMS } from "../context/ImageCMSContext";
import outreachImage from "../Images/Community Outreach Program.png";
import schoolImage from "../Images/School Mental Health Program.png";

import radioImage from "../Images/Community Radio Programs.png";
import supportImage from "../Images/Support Programs.png";

const programs = [
  {
    icon: Users,
    titleKey: "programAwarenessTitle",
    descKey: "programAwarenessDesc"
  },
  {
    icon: GraduationCap,
    titleKey: "programSchoolTitle",
    descKey: "programSchoolDesc"
  },
  {
    icon: Radio,
    titleKey: "programRadioTitle",
    descKey: "programRadioDesc"
  },
  {
    icon: HeartHandshake,
    titleKey: "programSupportTitle",
    descKey: "programSupportDesc"
  }
];

const CommunityPrograms = () => {
  const { t } = useTranslation('community');
  const { getSystemImage } = useImageCMS();

  const dynamicOutreach = getSystemImage("programs", "outreach", outreachImage);
  const dynamicSchool = getSystemImage("programs", "school", schoolImage);
  const dynamicRadio = getSystemImage("programs", "radio", radioImage);
  const dynamicSupport = getSystemImage("programs", "support", supportImage);

  const dynamicImages = [dynamicOutreach, dynamicSchool, dynamicRadio, dynamicSupport];

  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
      </Helmet>
      <main>
        <PageHeader 
          title={t('headerTitle')} 
          subtitle={t('headerSubtitle')}
          breadcrumb={t('breadcrumb')}
        />
        
        <div className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 rounded-3xl overflow-hidden shadow-xl h-64 md:h-96 relative group">
              <img 
                src={dynamicOutreach} 
                alt="Community Outreach Program" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <h3 className="text-white text-3xl font-bold p-8">{t('bannerTitle')}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programs.map((program, index) => {
                const Icon = program.icon;
                const currentImg = dynamicImages[index];
                return (
                  <GlassCard key={index} className="bg-white hover:border-teal/30 transition-colors group/card overflow-hidden flex flex-col p-0">
                    {currentImg && (
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={currentImg} 
                          alt={t(program.titleKey)} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-primary mb-3">{t(program.titleKey)}</h3>
                          <p className="text-muted leading-relaxed">
                            {t(program.descKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>

        <CTASection />
      </main>
    </>
  );
};

export default CommunityPrograms;
