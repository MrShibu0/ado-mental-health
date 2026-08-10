import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { useImageCMS } from "../../context/ImageCMSContext";
import heroImage from "../../Images/Hero Section Image.png";

export const Hero = () => {
  const { t } = useTranslation("home");
  const { getSystemImage } = useImageCMS();
  const dynamicImage = getSystemImage("common", "hero", heroImage);
  
  return (
    <div className="relative isolate overflow-hidden bg-white pt-32 pb-24 sm:pt-[140px] sm:pb-32 min-h-[90vh] flex items-center">
      <img
        src={dynamicImage}
        alt="Mental Health Support Center in La Gonâve"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/90 to-primary/30 mix-blend-multiply" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-[700px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[38px] md:text-[52px] lg:text-[64px] font-bold tracking-tight text-white mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 mb-10">
              {t("hero.subtitle")}
            </p>
            <div className="flex items-center gap-x-6">
              <Link to="/contact">
                <Button variant="primary" size="lg">{t("hero.buttons.get_support")}</Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  {t("hero.buttons.donate")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
