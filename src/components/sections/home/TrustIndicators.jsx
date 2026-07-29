import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck, UserCheck, Users, Beaker, MapPin, CircleDollarSign } from "lucide-react";

const icons = [ShieldCheck, UserCheck, Users, Beaker, MapPin, CircleDollarSign];

export const TrustIndicators = () => {
  const { t } = useTranslation("home");
  const items = Array.from({ length: 6 }, (_, i) => i);
  
  return (
    <section className="py-8 bg-white border-b border-slate-100 hidden md:block">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-6">
          {items.map((idx) => {
            const Icon = icons[idx];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#14B8A6]" />
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  {t(`trustIndicators.items.${idx}`)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
