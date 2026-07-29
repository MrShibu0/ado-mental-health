import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { 
  Baby, 
  GraduationCap, 
  Briefcase, 
  PersonStanding, 
  Home, 
  Baby as Pregnant, 
  HeartHandshake, 
  Brain, 
  Activity, 
  School 
} from "lucide-react";

// Map to assign an icon to each group
const icons = [
  Baby, GraduationCap, Briefcase, PersonStanding, Home, Pregnant, HeartHandshake, Brain, Activity, School
];

export const WhoWeServe = () => {
  const { t } = useTranslation("about");
  
  // Create an array of 10 items based on the translation array length
  const items = Array.from({ length: 10 }, (_, i) => i);
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("whoWeServe.title")} centered className="mb-16" />
        
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6 max-w-5xl mx-auto">
          {items.map((idx) => {
            const Icon = icons[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-[0_4px_12px_rgba(15,23,42,0.04)] border border-slate-100 hover:border-blue-100 hover:shadow-[0_8px_20px_rgba(30,58,138,0.08)] transition-all cursor-default"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB]">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-700 text-[15px]">
                  {t(`whoWeServe.items.${idx}`)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
