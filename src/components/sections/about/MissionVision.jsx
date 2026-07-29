import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Target, Lightbulb } from "lucide-react";

export const MissionVision = () => {
  const { t } = useTranslation("about");
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative bg-white rounded-[2rem] p-10 lg:p-12 shadow-[0_10px_40px_rgba(15,23,42,0.06)] border border-slate-100 hover:shadow-[0_20px_50px_rgba(30,58,138,0.08)] transition-all duration-500"
          >
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Target className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-6">{t("mission.title")}</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t("mission.text")}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative bg-[#1E3A8A] rounded-[2rem] p-10 lg:p-12 shadow-[0_10px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_rgba(30,58,138,0.2)] transition-all duration-500"
          >
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">{t("vision.title")}</h3>
              <p className="text-lg text-blue-100 leading-relaxed">
                {t("vision.text")}
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
