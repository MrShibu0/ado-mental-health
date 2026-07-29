import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/Button";
import heroImage from "../../../Images/Mental Health Counseling Scene.png";

export const HomeHero = () => {
  const { t } = useTranslation("home");

  return (
    <div className="relative isolate overflow-hidden pt-36 pb-24 sm:pt-[150px] sm:pb-32 min-h-[90vh] flex items-center bg-slate-950">
      
      {/* Full Background Image */}
      <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden select-none">
        <img
          src={heroImage}
          alt="Counseling Scene Background"
          className="w-full h-full object-cover object-center scale-[1.02]"
        />
        {/* Dark horizontal gradient overlay to ensure text contrast without floating box borders */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-2xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left space-y-6"
          >
            {/* Live Indicator Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.07] text-[#38BDF8] font-bold text-xs uppercase tracking-wider border border-white/[0.05]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
              {t("hero.badge")}
            </span>

            {/* Headline */}
            <h1 className="text-[38px] md:text-[50px] lg:text-[56px] font-black tracking-tight text-white leading-[1.15] drop-shadow-sm">
              {t("hero.title")}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-medium max-w-xl">
              {t("hero.subtitle")}
            </p>

            {/* CTA Controls */}
            <div className="flex flex-wrap items-center gap-4 pt-4 w-full">
              <Link to="/contact" className="flex-grow sm:flex-grow-0">
                <Button variant="primary" size="lg" className="w-full rounded-full shadow-lg bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/10 transition-all px-8 py-4 text-sm font-bold tracking-wide">
                  {t("hero.buttons.getSupport")}
                </Button>
              </Link>
              <Link to="/donate" className="flex-grow sm:flex-grow-0">
                <Button variant="outline" size="lg" className="w-full rounded-full border-white/20 text-white hover:bg-white/10 transition-all px-8 py-4 text-sm font-bold tracking-wide bg-white/5 backdrop-blur-sm">
                  {t("hero.buttons.donateNow")}
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto text-center sm:text-left text-sky-400 font-bold hover:text-sky-300 transition-colors px-4 py-2 flex items-center justify-center sm:justify-start gap-1">
                {t("hero.buttons.learnMore")} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

          </motion.div>
          
        </div>
      </div>
      
    </div>
  );
};
