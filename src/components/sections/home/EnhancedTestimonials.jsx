import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { Star, Quote } from "lucide-react";

export const EnhancedTestimonials = () => {
  const { t } = useTranslation("home");
  const items = [0, 1, 2];
  
  return (
    <section className="py-24 bg-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-60 -translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <SectionTitle title={t("testimonials.title")} centered className="mb-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white/80 backdrop-blur-lg p-8 lg:p-10 rounded-[2rem] shadow-sm border border-white relative group hover:shadow-[0_20px_40px_rgba(30,58,138,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <Quote className="w-5 h-5 text-[#2563EB]" />
              </div>
              
              <div className="flex items-center gap-1 mb-6 text-amber-400">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              
              <p className="text-lg text-slate-700 italic leading-relaxed mb-8 flex-grow">
                "{t(`testimonials.items.${idx}.quote`)}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                  <svg className="w-8 h-8 text-slate-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-[#1E293B] text-sm">
                    {t(`testimonials.items.${idx}.name`)}
                  </h5>
                  <span className="text-xs text-slate-500 font-medium">
                    {t(`testimonials.items.${idx}.location`)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
