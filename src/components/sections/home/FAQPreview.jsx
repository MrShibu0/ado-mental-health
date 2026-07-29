import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SectionTitle } from "../../ui/SectionTitle";
import { ChevronDown } from "lucide-react";

export const FAQPreview = () => {
  const { t } = useTranslation("home");
  const questions = [0, 1, 2, 3];
  
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <SectionTitle title={t("faqPreview.title")} centered className="mb-12" />
        
        <div className="space-y-4 mb-10">
          {questions.map((idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`border ${isOpen ? 'border-[#2563EB] shadow-md' : 'border-slate-200'} rounded-2xl overflow-hidden transition-all duration-300`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className={`w-full flex items-center justify-between p-6 text-left focus:outline-none transition-colors ${isOpen ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'}`}
                >
                  <span className={`font-semibold text-lg ${isOpen ? 'text-[#1E3A8A]' : 'text-[#1E293B]'}`}>
                    {t(`faqPreview.questions.${idx}.q`)}
                  </span>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#2563EB]' : 'text-slate-400'}`} />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-slate-600 bg-blue-50">
                    {t(`faqPreview.questions.${idx}.a`)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Link to="/faq">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-50 text-slate-700 font-semibold border border-slate-200 hover:bg-white hover:shadow-md hover:border-[#2563EB] hover:text-[#2563EB] transition-all duration-300">
              {t("faqPreview.button")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
