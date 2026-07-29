import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import * as Icons from "lucide-react";
import { cn } from "../../utils/cn";

export const ServiceCard = ({ service, index }) => {
  const { t } = useTranslation("services");
  const Icon = Icons[service.icon] || Icons.HeartPulse;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-teal/30 group overflow-hidden flex flex-col"
      )}
    >
      {service.image && (
        <div className="w-full h-48 overflow-hidden relative">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        </div>
      )}
      <div className="p-8 flex flex-col flex-grow">
        <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mb-6 group-hover:bg-teal group-hover:text-white transition-colors duration-300 text-teal">
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-3">{t(`list.${service.id}.title`, { defaultValue: service.title })}</h3>
        <p className="text-muted leading-relaxed">
          {t(`list.${service.id}.description`, { defaultValue: service.description })}
        </p>
      </div>
    </motion.div>
  );
};
