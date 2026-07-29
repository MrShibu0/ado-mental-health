import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Handshake } from "lucide-react";
import { SectionTitle } from "../../ui/SectionTitle";

export const CommunityCommitment = () => {
  const { t } = useTranslation("about");
  
  const items = Array.from({ length: 5 }, (_, i) => i);
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(15,23,42,0.05)] border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#14B8A6]/10 flex items-center justify-center mb-8">
                <Handshake className="w-8 h-8 text-[#14B8A6]" />
              </div>
              <SectionTitle title={t("communityCommitment.title")} className="mb-6" />
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                {t("communityCommitment.subtitle")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-[#1E3A8A]/5 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  <span className="font-semibold text-slate-700 text-lg">
                    {t(`communityCommitment.items.${idx}`)}
                  </span>
                </motion.div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
