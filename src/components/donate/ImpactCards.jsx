import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Heart, Users, Brain, GraduationCap } from "lucide-react";

const impacts = [
  { amount: "25", icon: Heart },
  { amount: "50", icon: Users },
  { amount: "100", icon: GraduationCap },
  { amount: "250", icon: Brain },
];

export const ImpactCards = () => {
  const { t } = useTranslation("donate");

  return (
    <div className="space-y-4">
      {impacts.map((impact, index) => {
        const Icon = impact.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="w-14 h-14 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 text-teal">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-xl text-primary">${impact.amount}</div>
              <div className="text-sm text-slate-600">{t(`impact.cards.${impact.amount}`)}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
