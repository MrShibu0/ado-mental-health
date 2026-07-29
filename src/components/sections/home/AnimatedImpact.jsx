import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AnimatedCounter } from "../../ui/AnimatedCounter";
import { Users, Award, MapPin, Lock } from "lucide-react";

const impactIcons = {
  supported: Users,
  professionals: Award,
  outreach: MapPin,
  confidential: Lock
};

const impactKeys = ["supported", "professionals", "outreach", "confidential"];

export const AnimatedImpact = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactKeys.map((key, idx) => {
            const Icon = impactIcons[key];
            const endVal = parseInt(t(`animatedImpact.items.${key}.number`), 10);
            const suffix = t(`animatedImpact.items.${key}.suffix`);
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(30,58,138,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-[#2563EB]" />
                </div>
                
                <div className="flex items-center justify-center text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] mb-3">
                  <AnimatedCounter end={endVal} duration={2.5} />
                  <span>{suffix}</span>
                </div>
                
                <h4 className="text-lg font-bold text-[#1E293B] mb-2">
                  {t(`animatedImpact.items.${key}.title`)}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t(`animatedImpact.items.${key}.desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
