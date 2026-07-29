import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";

export const AboutIntro = () => {
  const { t } = useTranslation("about");
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle title={t("intro.title")} centered className="mb-6" />
            <h2 className="text-2xl md:text-3xl font-medium text-[#1E293B] mb-10 leading-relaxed">
              {t("intro.subtitle")}
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-lg text-slate-600 leading-relaxed"
          >
            <p>{t("intro.p1")}</p>
            <p>{t("intro.p2")}</p>
            <p>{t("intro.p3")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
