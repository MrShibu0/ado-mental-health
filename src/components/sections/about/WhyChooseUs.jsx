import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { BadgeCheck, LockKeyhole, MapPin, Beaker, Layers, CircleDollarSign } from "lucide-react";

const featureIcons = {
  Licensed: BadgeCheck,
  Confidential: LockKeyhole,
  Community: MapPin,
  Evidence: Beaker,
  Holistic: Layers,
  Affordable: CircleDollarSign
};

const featureKeys = ["Licensed", "Confidential", "Community", "Evidence", "Holistic", "Affordable"];

export const WhyChooseUs = () => {
  const { t } = useTranslation("about");
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("whyChooseUs.title")} centered className="mb-16" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featureKeys.map((key, idx) => {
            const Icon = featureIcons[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h4 className="text-xl font-bold text-[#1E293B] mb-3">
                  {t(`whyChooseUs.items.${key}.title`)}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {t(`whyChooseUs.items.${key}.desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
