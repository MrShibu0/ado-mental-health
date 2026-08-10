import { impactStats } from "../../data/impact";
import { AnimatedCounter } from "../ui/AnimatedCounter";
import { SectionTitle } from "../ui/SectionTitle";
import { useImageCMS } from "../../context/ImageCMSContext";
import bgImage from "../../Images/Impact Dashboard Background.png";
import { useTranslation } from "react-i18next";

export const ImpactDashboard = () => {
  const { t } = useTranslation("common");
  const { getSystemImage } = useImageCMS();
  const dynamicImage = getSystemImage("impact", "dashboard", bgImage);

  return (
    <div className="py-24 bg-primary text-white relative overflow-hidden">
      <img src={dynamicImage} alt="Impact Background" className="absolute inset-0 w-full h-full object-cover opacity-20" loading="lazy" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <SectionTitle 
          title={t('impact.title')} 
          subtitle={t('impact.subtitle')}
          centered
          className="text-white [&>h2]:text-white [&>p]:text-gray-300 mb-16"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {impactStats.map((stat, index) => (
            <div key={stat.id} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl font-bold tracking-tight text-teal mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{stat.label}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
