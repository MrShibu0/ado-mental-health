import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import bgImage from "../../Images/Contact Page Banner.png";

export const DonationHero = () => {
  const { t } = useTranslation("donate");
  return (
    <div className="relative isolate overflow-hidden bg-primary pt-24 pb-16 sm:pt-32 sm:pb-24">
      <img
        src={bgImage}
        alt="Donate to support mental health"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/90 to-primary/60 mix-blend-multiply" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-sm font-medium mb-6 border border-white/20 backdrop-blur-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            {t("hero.secure_badge")}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            {t("hero.title")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-300 max-w-xl"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </div>
    </div>
  );
};
