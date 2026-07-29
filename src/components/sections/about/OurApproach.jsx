import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { ClipboardList, Stethoscope, Users, Sunrise } from "lucide-react";

const icons = [ClipboardList, Stethoscope, Users, Sunrise];
const stepKeys = ["Assessment", "PersonalizedCare", "CommunitySupport", "LongTermRecovery"];

export const OurApproach = () => {
  const { t } = useTranslation("about");
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("ourApproach.title")} centered className="mb-20" />
        
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-100" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
            {stepKeys.map((key, idx) => {
              const Icon = icons[idx];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 w-24 h-24 mx-auto bg-white rounded-full border-4 border-[#F8FAFC] shadow-[0_10px_30px_rgba(30,58,138,0.08)] flex items-center justify-center mb-6">
                    <Icon className="w-10 h-10 text-[#2563EB]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1E3A8A] text-white font-bold flex items-center justify-center text-sm shadow-md">
                      {idx + 1}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-[#1E293B] mb-3">
                    {t(`ourApproach.steps.${key}.title`)}
                  </h4>
                  <p className="text-slate-600">
                    {t(`ourApproach.steps.${key}.desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
