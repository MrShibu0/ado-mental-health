import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import storyImage from "../../../Images/Community Outreach Program.png";

export const OurStory = () => {
  const { t } = useTranslation("about");
  
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
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src={storyImage} 
                alt="Community Outreach in La Gonâve" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SectionTitle title={t("story.title")} className="mb-8" />
            
            <div className="space-y-5 text-lg text-slate-600 leading-relaxed border-l-4 border-[#2563EB]/20 pl-6">
              <p>{t("story.p1")}</p>
              <p>{t("story.p2")}</p>
              <p>{t("story.p3")}</p>
              <p className="font-medium text-[#1E3A8A] pt-2">{t("story.p4")}</p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
