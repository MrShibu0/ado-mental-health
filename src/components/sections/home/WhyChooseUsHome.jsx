import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { BadgeCheck, LockKeyhole, Heart, Users, Beaker, CircleDollarSign } from "lucide-react";

const featureIcons = {
  licensed: BadgeCheck,
  confidential: LockKeyhole,
  compassionate: Heart,
  outreach: Users,
  evidence: Beaker,
  affordable: CircleDollarSign
};

const featureKeys = ["licensed", "confidential", "compassionate", "outreach", "evidence", "affordable"];

export const WhyChooseUsHome = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-[#1E3A8A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <SectionTitle 
          title={t("whyChooseUs.title")} 
          centered 
          className="mb-16 text-white" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featureKeys.map((key, idx) => {
            const Icon = featureIcons[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">
                  {t(`whyChooseUs.items.${key}.title`)}
                </h4>
                <p className="text-blue-100 leading-relaxed text-sm lg:text-base">
                  {t(`whyChooseUs.items.${key}.desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
