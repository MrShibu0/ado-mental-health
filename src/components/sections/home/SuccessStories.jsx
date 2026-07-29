import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SectionTitle } from "../../ui/SectionTitle";
import { ArrowRight } from "lucide-react";

import story1 from "../../../Images/Family Therapy Service.png";
import story2 from "../../../Images/Mental Health Counseling Scene.png";
import story3 from "../../../Images/Community Outreach Program.png";

const images = [story1, story2, story3];
const items = [0, 1, 2];

export const SuccessStories = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("successStories.title")} centered className="mb-16" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {items.map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col group hover:shadow-[0_20px_40px_rgba(30,58,138,0.08)] transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={images[idx]} 
                  alt={t(`successStories.items.${idx}.title`)} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h4 className="text-xl font-bold text-[#1E293B] mb-3">
                  {t(`successStories.items.${idx}.title`)}
                </h4>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  {t(`successStories.items.${idx}.summary`)}
                </p>
                <Link to="/about" className="inline-flex items-center gap-2 text-[#2563EB] font-semibold hover:text-[#1E3A8A] transition-colors mt-auto">
                  {t("successStories.readMore")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
