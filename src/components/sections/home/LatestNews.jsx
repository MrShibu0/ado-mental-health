import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SectionTitle } from "../../ui/SectionTitle";
import { ArrowRight, Calendar } from "lucide-react";

import news1 from "../../../Images/Community Outreach Program.png";
import news2 from "../../../Images/Training & Capacity Building.png";
import news3 from "../../../Images/Psychiatric Consultation.png";

const images = [news1, news2, news3];
const items = [0, 1, 2];

export const LatestNews = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("latestNews.title")} centered className="mb-16" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-lg hover:border-blue-100 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={images[idx]} 
                  alt={t(`latestNews.items.${idx}.title`)} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#2563EB] shadow-sm uppercase tracking-wider">
                  {t(`latestNews.items.${idx}.category`)}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {t(`latestNews.items.${idx}.date`)}
                </div>
                
                <h4 className="text-xl font-bold text-[#1E293B] mb-3 leading-tight group-hover:text-[#2563EB] transition-colors">
                  {t(`latestNews.items.${idx}.title`)}
                </h4>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  {t(`latestNews.items.${idx}.summary`)}
                </p>
                
                <Link to="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:text-[#2563EB] transition-colors mt-auto">
                  {t("latestNews.readMore")} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
