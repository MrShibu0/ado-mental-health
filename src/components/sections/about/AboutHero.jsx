import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/Button";
import heroImage from "../../../Images/Mental Health Counseling Scene.png";
import { useImageCMS } from "../../../context/ImageCMSContext.jsx";

export const AboutHero = () => {
  const { t } = useTranslation("about");
  const { getSystemImage } = useImageCMS();
  
  const dynamicImage = getSystemImage("about", "hero", heroImage);
  
  return (
    <div className="relative isolate overflow-hidden bg-white pt-32 pb-20 sm:pt-[140px] sm:pb-24 min-h-[65vh] lg:min-h-[75vh] flex items-center">
      {/* Soft blue gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1E3A8A]/5 via-white to-[#2563EB]/5" />
      
      {/* Decorative glassmorphism accent shapes */}
      <div className="absolute top-1/4 right-1/4 -z-10 w-96 h-96 rounded-full bg-[#2563EB]/10 blur-3xl opacity-60" />
      <div className="absolute bottom-1/4 left-1/4 -z-10 w-72 h-72 rounded-full bg-[#14B8A6]/10 blur-3xl opacity-50" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold text-sm mb-6 border border-[#1E3A8A]/20 shadow-sm">
              {t("hero.badge")}
            </span>
            <h1 className="text-[38px] md:text-[52px] lg:text-[60px] font-bold tracking-tight text-[#1E293B] mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 mb-10">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="rounded-full shadow-md hover:shadow-lg transition-all">
                  {t("hero.buttons.contactUs")}
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 transition-all">
                  {t("hero.buttons.learnMore")}
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-full flex items-center justify-center"
          >
            <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.1)] border border-white/50">
              <img
                src={dynamicImage}
                alt="Mental Health Counseling Session"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating accent card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="font-bold text-[#1E3A8A] text-xl">100%</div>
              </div>
              <p className="text-xs text-slate-600 font-medium">Confidential & Compassionate Care</p>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};
