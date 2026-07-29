import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { ArrowRight } from "lucide-react";

export const LongTermVision = () => {
  const { t } = useTranslation("about");
  
  // 5 items in the list based on translations
  const items = Array.from({ length: 5 }, (_, i) => i);
  
  return (
    <section className="py-24 bg-[#1E3A8A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t("longTermVision.title")}
              </h2>
              <div className="w-20 h-1.5 bg-[#14B8A6] rounded-full mb-8" />
              <p className="text-blue-100 text-lg leading-relaxed">
                ADO Center is dedicated to creating lasting, sustainable change in the mental health landscape of La Gonâve and beyond.
              </p>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {items.map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-start gap-4 hover:bg-white/15 transition-colors"
                >
                  <div className="mt-1 w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-white font-medium text-lg pt-1">
                    {t(`longTermVision.items.${idx}`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
