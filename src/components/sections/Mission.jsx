import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GlassCard } from "../ui/GlassCard";
import { Heart, Shield, Users } from "lucide-react";
import compassionateCareImg from "../../Images/Compassionate Care.png";
import confidentialityImg from "../../Images/Confidentiality & Trust.png";
import resilienceImg from "../../Images/Community Resilience.png";

export const Mission = () => {
  const { t } = useTranslation("home");
  return (
    <div className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-6">{t("mission.title")}</h2>
          <p className="text-xl leading-8 text-muted">
            {t("mission.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[0, 1, 2].map((index) => {
            const icons = [Heart, Shield, Users];
            const Icon = icons[index];
            const images = [compassionateCareImg, confidentialityImg, resilienceImg];
            const Image = images[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="h-full bg-white text-center p-0 flex flex-col">
                  <div className="w-full h-48 relative">
                    <img 
                      src={Image} 
                      alt={t(`mission.cards.${index}.title`)} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-teal z-20">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-8 pt-12 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-primary mb-3">{t(`mission.cards.${index}.title`)}</h3>
                    <p className="text-muted leading-relaxed flex-grow">
                      {t(`mission.cards.${index}.desc`)}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
