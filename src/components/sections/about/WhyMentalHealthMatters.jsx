import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HeartPulse } from "lucide-react";
import mattersImage from "../../../Images/Family Therapy Service.png";

export const WhyMentalHealthMatters = () => {
  const { t } = useTranslation("about");
  
  return (
    <section className="py-24 bg-[#1E3A8A] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-[#14B8A6]/10 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <HeartPulse className="w-5 h-5 text-blue-200" />
              <span className="text-blue-100 font-medium text-sm tracking-wide uppercase">
                {t("whyMatters.title")}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              {t("whyMatters.title")}
            </h2>
            
            <div className="space-y-6 text-xl text-blue-50 leading-relaxed">
              <p>{t("whyMatters.p1")}</p>
              <p className="font-semibold text-white">{t("whyMatters.p2")}</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/10">
              <img 
                src={mattersImage} 
                alt="Family Therapy and Wellbeing" 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/60 to-transparent mix-blend-multiply" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
