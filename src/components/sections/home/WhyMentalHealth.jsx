import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { HeartPulse, Home, GraduationCap, Users, Sunrise, HandHeart } from "lucide-react";

const icons = {
  wellbeing: HeartPulse,
  family: Home,
  education: GraduationCap,
  community: Users,
  hope: Sunrise,
  inclusion: HandHeart
};

const keys = ["wellbeing", "family", "education", "community", "hope", "inclusion"];

export const WhyMentalHealth = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-blue-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("whyMentalHealth.title")} centered className="mb-16" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {keys.map((key, idx) => {
            const Icon = icons[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(15,23,42,0.03)] border border-white hover:border-blue-100 hover:shadow-[0_10px_30px_rgba(30,58,138,0.06)] transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/5 flex items-center justify-center mb-6 group-hover:bg-[#2563EB] transition-colors duration-300">
                  <Icon className="w-8 h-8 text-[#2563EB] group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-lg font-bold text-[#1E293B]">
                  {t(`whyMentalHealth.items.${key}`)}
                </h4>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
