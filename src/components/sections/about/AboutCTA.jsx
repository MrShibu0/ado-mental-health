import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import { useImageCMS } from "../../../context/ImageCMSContext";
import ctaImage from "../../../Images/Community Resilience.png";

export const AboutCTA = () => {
  const { t } = useTranslation("about");
  const { getSystemImage } = useImageCMS();
  const dynamicImage = getSystemImage("about", "cta", ctaImage);
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={dynamicImage} 
              alt="Community Resilience" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/95 via-[#1E3A8A]/80 to-transparent mix-blend-multiply" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-12 lg:p-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {t("cta.title")}
              </h2>
              <p className="text-xl text-blue-50 leading-relaxed mb-10">
                {t("cta.text")}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/contact">
                  <Button variant="primary" size="lg" className="rounded-full shadow-lg bg-[#2563EB] hover:bg-[#3B82F6] border-none text-white px-8 py-3.5">
                    {t("cta.buttons.contact")}
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button variant="outline" size="lg" className="rounded-full border-white/50 text-white hover:bg-white/10 px-8 py-3.5">
                    {t("cta.buttons.learnMore")}
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Optional right side empty space to let image show through, or a decorative element */}
            <div className="hidden lg:block relative h-full">
              {/* Decorative elements can go here if needed */}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
