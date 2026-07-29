import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SectionTitle } from "../../ui/SectionTitle";
import { Button } from "../../ui/Button";
import { User2 } from "lucide-react";

export const MeetOurTeam = () => {
  const { t } = useTranslation("home");
  const placeholders = Array.from({ length: 6 }, (_, i) => i);
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("team.title")} centered className="mb-16" />
        
        {/* Founder Featured Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(15,23,42,0.05)] border border-slate-100 mb-12 max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shrink-0 ring-4 ring-[#1E3A8A]/10 bg-slate-100 flex items-center justify-center">
              <svg className="w-24 h-24 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">{t("team.founder.name")}</h3>
              <p className="text-[#2563EB] font-semibold text-lg mb-4">{t("team.founder.role")}</p>
              <p className="text-slate-600 text-lg leading-relaxed">
                "{t("team.founder.bio")}"
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Team Placeholders Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {placeholders.map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center aspect-square"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                <User2 className="w-8 h-8" />
              </div>
              <span className="text-sm font-medium text-slate-500 leading-tight">
                {t("team.comingSoon")}
              </span>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/team">
            <Button variant="primary" size="lg" className="rounded-full shadow-md bg-[#1E3A8A] hover:bg-[#1e3a8a]/90">
              {t("team.button")}
            </Button>
          </Link>
        </div>
        
      </div>
    </section>
  );
};
