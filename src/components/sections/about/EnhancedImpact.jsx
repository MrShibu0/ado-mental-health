import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AnimatedCounter } from "../../ui/AnimatedCounter";
import { Users, Lock, Award, Megaphone } from "lucide-react";

const impactIcons = {
  Served: Users,
  Confidential: Lock,
  Professionals: Award,
  Programs: Megaphone
};

const impactKeys = ["Served", "Confidential", "Professionals", "Programs"];

export const EnhancedImpact = () => {
  const { t } = useTranslation("about");
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1E293B]">{t("impact.title")}</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactKeys.map((key, idx) => {
            const Icon = impactIcons[key];
            const endVal = parseInt(t(`impact.items.${key}.number`), 10);
            const suffix = t(`impact.items.${key}.suffix`);
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-8 h-8 text-[#2563EB]" />
                </div>
                
                <div className="flex items-center justify-center text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] mb-4">
                  <AnimatedCounter end={endVal} duration={2.5} />
                  <span>{suffix}</span>
                </div>
                
                <h4 className="text-lg font-bold text-[#1E293B] mb-3">
                  {t(`impact.items.${key}.title`)}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t(`impact.items.${key}.desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
