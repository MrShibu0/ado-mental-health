import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import ctaImage from "../../../Images/Community Resilience & Well-being.png";

export const FinalCTA = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 md:py-32 bg-[#1E3A8A] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={ctaImage} 
          alt="Community Together" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#1E3A8A]/80 to-[#1E3A8A]/90 mix-blend-multiply" />
      </div>
      
      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-[1.1]">
            {t("finalCTA.title")}
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-50 mb-12 leading-relaxed">
            {t("finalCTA.text")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full rounded-full shadow-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white text-lg px-10 py-4 border-none">
                {t("finalCTA.buttons.getSupport")}
              </Button>
            </Link>
            <Link to="/donate" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full rounded-full border-2 border-white text-white hover:bg-white hover:text-[#1E3A8A] text-lg px-10 py-4 font-bold transition-colors">
                {t("finalCTA.buttons.donate")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
