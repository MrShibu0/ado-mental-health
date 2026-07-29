import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";

// Images from the provided Images folder
import outreach1 from "../../../Images/School Mental Health Program.png";
import outreach2 from "../../../Images/Family Therapy Service.png";
import outreach3 from "../../../Images/Group Therapy.png";
import outreach4 from "../../../Images/Training & Capacity Building.png";
import outreach5 from "../../../Images/Community Outreach Program.png";

const keys = ["schools", "families", "counseling", "workshops", "youth"];
const images = [outreach1, outreach2, outreach3, outreach4, outreach5];

export const CommunityOutreach = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("outreach.title")} centered className="mb-16" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          {keys.map((key, idx) => {
            // Make the first item span 2 columns and 2 rows on large screens for a masonry feel
            const isLarge = idx === 0;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative group rounded-3xl overflow-hidden cursor-pointer ${
                  isLarge ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img 
                  src={images[idx]} 
                  alt={t(`outreach.items.${key}`)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Caption */}
                <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className={`font-bold text-white ${isLarge ? 'text-3xl' : 'text-xl'}`}>
                    {t(`outreach.items.${key}`)}
                  </h4>
                  <div className="w-10 h-1 bg-[#14B8A6] rounded-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                </div>
              </motion.div>
            );
          })}
          
          {/* Add the 6th item (Events) as a solid color card instead of an image for visual variety */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative bg-[#2563EB] rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:bg-[#1E3A8A] transition-colors duration-300 shadow-lg"
          >
            <h4 className="font-bold text-white text-2xl mb-4">
              {t(`outreach.items.events`)}
            </h4>
            <div className="w-12 h-1 bg-white/50 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
