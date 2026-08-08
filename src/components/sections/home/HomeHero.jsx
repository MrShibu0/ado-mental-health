import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/Button";
import { ShieldCheck, UserCheck, MapPin, Beaker } from "lucide-react";
import { cn } from "../../../utils/cn";

// Import Slide Images
import imgGroupTherapy from "../../../Images/Group Therapy.png";
import imgCounselingScene from "../../../Images/Mental Health Counseling Scene.png";
import imgCommunityResilience from "../../../Images/Community Resilience.png";

export const HomeHero = () => {
  const { t } = useTranslation("home");
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: imgGroupTherapy,
      badge: "Group Therapy",
    },
    {
      image: imgCounselingScene,
      badge: "Compassionate Counseling",
    },
    {
      image: imgCommunityResilience,
      badge: "Community Resilience",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const floatingCards = [
    { icon: ShieldCheck, key: "confidential", position: "top-[10%] -left-12", delay: 0.8 },
    { icon: UserCheck, key: "licensed", position: "bottom-[25%] -left-8", delay: 1.0 },
    { icon: MapPin, key: "community", position: "top-[40%] -right-10", delay: 1.2 },
    { icon: Beaker, key: "evidence", position: "bottom-[10%] -right-6", delay: 1.4 },
  ];

  return (
    <div className="relative isolate overflow-hidden bg-white pt-32 pb-20 sm:pt-[140px] sm:pb-24 min-h-[85vh] lg:min-h-[90vh] flex items-center">
      {/* Background gradients and shapes */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1E3A8A]/5 via-white to-[#2563EB]/5" />
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] rounded-full bg-[#14B8A6]/5 blur-3xl translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] rounded-full bg-[#2563EB]/5 blur-3xl -translate-x-1/4 translate-y-1/4" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Column - Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-left order-2 lg:order-1"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold text-sm mb-6 border border-[#1E3A8A]/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A] animate-pulse" />
              {t("hero.badge")}
            </span>
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-extrabold tracking-tight text-[#1E293B] mb-6 leading-[1.1]">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-slate-600 mb-10">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="rounded-full shadow-lg bg-[#2563EB] hover:bg-[#3B82F6] hover:shadow-xl transition-all px-8 py-4 text-base font-semibold">
                  {t("hero.buttons.getSupport")}
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" size="lg" className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 transition-all px-8 py-4 text-base font-semibold bg-white">
                  {t("hero.buttons.donateNow")}
                </Button>
              </Link>
              <Link to="/about" className="text-[#2563EB] font-semibold hover:text-[#1E3A8A] transition-colors px-4 py-2 flex items-center gap-1">
                {t("hero.buttons.learnMore")} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </motion.div>
          
          {/* Right Column - Carousel Image Slider with Floating Cards */}
          <div className="relative block w-full max-w-lg mx-auto lg:max-w-none mb-10 lg:mb-0 order-1 lg:order-2 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm z-10 aspect-[4/5] sm:aspect-square lg:h-[600px] w-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].badge}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A8A]/30 to-transparent" />
                  
                  {/* Slide Category Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1E3A8A] text-white text-xs font-bold shadow-md tracking-wide">
                      {slides[currentSlide].badge}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Dot Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                      currentSlide === idx ? "bg-white scale-125" : "bg-white/50"
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Floating Glass Cards */}
            {floatingCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: card.delay }}
                  className={cn(
                    `absolute ${card.position} z-20`,
                    "bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white",
                    "hidden md:flex items-center gap-3 w-48"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span className="font-semibold text-slate-800 leading-tight text-sm">
                    {t(`hero.trustCards.${card.key}`)}
                  </span>
                </motion.div>
              );
            })}
          </div>
          
        </div>
      </div>
    </div>
  );
};
