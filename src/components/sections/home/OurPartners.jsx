import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";

const groups = ["healthcare", "education", "community", "government", "ngos"];

export const OurPartners = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-white relative border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <SectionTitle title={t("partners.title")} centered className="mb-16" />
        
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 max-w-5xl mx-auto">
          {groups.map((group, idx) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-6 lg:p-8 w-40 sm:w-48 flex flex-col items-center justify-center group hover:bg-white hover:shadow-lg transition-all duration-300 grayscale hover:grayscale-0"
            >
              <div className="w-16 h-16 rounded-full bg-slate-200 mb-4 flex items-center justify-center opacity-50 group-hover:bg-blue-100 group-hover:opacity-100 transition-all">
                <svg className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors text-center">
                {t(`partners.groups.${group}`)}<br/>
                {t("partners.placeholder")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
