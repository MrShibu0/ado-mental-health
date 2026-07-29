import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { Heart, ShieldCheck, Lock, Users, Award, Sprout } from "lucide-react";

const valueIcons = {
  Compassion: Heart,
  Integrity: ShieldCheck,
  Confidentiality: Lock,
  Inclusion: Users,
  Excellence: Award,
  CommunityEmpowerment: Sprout
};

export const CoreValues = () => {
  const { t } = useTranslation("about");
  
  const values = [
    { key: "Compassion" },
    { key: "Integrity" },
    { key: "Confidentiality" },
    { key: "Inclusion" },
    { key: "Excellence" },
    { key: "CommunityEmpowerment" }
  ];
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <SectionTitle title={t("coreValues.title")} centered className="mb-16" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((val, idx) => {
            const Icon = valueIcons[val.key];
            return (
              <motion.div
                key={val.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white hover:shadow-xl hover:border-blue-50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A]/5 flex items-center justify-center mb-6 text-[#2563EB]">
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-[#1E293B] mb-3">
                  {t(`coreValues.items.${val.key}.title`)}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {t(`coreValues.items.${val.key}.desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
