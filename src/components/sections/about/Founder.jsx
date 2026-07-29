import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const Founder = () => {
  const { t } = useTranslation("about");
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(15,23,42,0.05)] border border-slate-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6 ring-4 ring-[#1E3A8A]/10 bg-slate-100 flex items-center justify-center">
                {/* Fallback avatar since no specific image was provided for the founder */}
                <svg className="w-24 h-24 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-2">{t("founder.name")}</h3>
              <p className="text-[#2563EB] font-semibold">{t("founder.role")}</p>
            </div>
            
            <div className="lg:col-span-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold text-sm mb-6">
                {t("founder.title")}
              </div>
              <div className="space-y-5 text-lg text-slate-600 leading-relaxed">
                <p>{t("founder.bio1")}</p>
                <p>{t("founder.bio2")}</p>
                <p>{t("founder.bio3")}</p>
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
};
