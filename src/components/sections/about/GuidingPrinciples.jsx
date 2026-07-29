import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

export const GuidingPrinciples = () => {
  const { t } = useTranslation("about");
  
  const principles = [
    "Respect", "Dignity", "Equity", "Compassion", "Collaboration", "Accountability"
  ];
  
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-[#1E293B]">{t("guidingPrinciples.title")}</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {principles.map((principle, idx) => (
            <motion.div
              key={principle}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl hover:bg-[#1E3A8A]/5 hover:shadow-sm transition-all border border-slate-100"
            >
              <CheckCircle2 className="w-8 h-8 text-[#14B8A6] mb-4" />
              <span className="font-semibold text-slate-700">{t(`guidingPrinciples.items.${principle}`)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
