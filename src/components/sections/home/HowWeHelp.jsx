import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { MessageCircleHeart, ClipboardList, Stethoscope, Sunrise } from "lucide-react";

const icons = [MessageCircleHeart, ClipboardList, Stethoscope, Sunrise];
const stepKeys = ["reachOut", "assessment", "care", "recovery"];

export const HowWeHelp = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("howWeHelp.title")} centered className="mb-20" />
        
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#2563EB]/30 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
            {stepKeys.map((key, idx) => {
              const Icon = icons[idx];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative text-center group"
                >
                  <div className="relative z-10 w-24 h-24 mx-auto bg-white rounded-full border-4 border-[#F8FAFC] shadow-[0_10px_30px_rgba(30,58,138,0.06)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-50">
                    <Icon className="w-10 h-10 text-[#2563EB]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#14B8A6] text-white font-bold flex items-center justify-center text-sm shadow-md">
                      {idx + 1}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-[#1E293B] mb-3">
                    {t(`howWeHelp.steps.${key}.title`)}
                  </h4>
                  <p className="text-slate-600 text-sm md:text-base px-2">
                    {t(`howWeHelp.steps.${key}.desc`)}
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
