import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/Button";
import welcomeImage from "../../../Images/Community Resilience & Well-being.png";

export const WelcomeSection = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E293B] mb-6 leading-tight">
              {t("welcome.title")}
            </h2>
            <div className="w-20 h-1.5 bg-[#14B8A6] rounded-full mb-8" />
            
            <h3 className="text-xl font-semibold text-[#2563EB] mb-6">
              {t("welcome.subtitle")}
            </h3>
            
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-10">
              <p>{t("welcome.p1")}</p>
              <p>{t("welcome.p2")}</p>
            </div>
            
            <Link to="/about">
              <Button variant="outline" size="lg" className="rounded-full border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all px-8">
                {t("welcome.button")}
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={welcomeImage} 
                alt="Community Resilience" 
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[url('/grid-pattern.svg')] opacity-20 -z-10" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-50 rounded-full -z-10" />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
