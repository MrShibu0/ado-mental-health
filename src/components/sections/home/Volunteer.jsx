import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import { HeartHandshake } from "lucide-react";
import volunteerImage from "../../../Images/Mental Health Counseling Scene.png";

export const Volunteer = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-br from-[#14B8A6] to-[#1E3A8A] grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Image Column - Top on Mobile, Right on Desktop */}
          <div className="lg:col-span-6 w-full h-[220px] sm:h-[300px] lg:h-full relative overflow-hidden min-h-[220px] lg:min-h-0 order-1 lg:order-2 select-none">
            <img 
              src={volunteerImage} 
              alt="Volunteer" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Dark overlay for contrast on image */}
            <div className="absolute inset-0 bg-slate-900/10 lg:bg-gradient-to-r lg:from-slate-950/20 lg:to-transparent" />
          </div>

          {/* Text Content Column - Bottom on Mobile, Left on Desktop */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start text-left order-2 lg:order-1 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              {t("volunteer.title")}
            </h2>
            
            <p className="text-base sm:text-lg text-blue-50 leading-relaxed mb-8">
              {t("volunteer.desc")}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full rounded-full shadow-lg bg-white text-[#1E3A8A] hover:bg-slate-50 border-none px-8 py-3.5 text-sm font-bold">
                  {t("volunteer.buttons.become")}
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full rounded-full border-white/50 text-white hover:bg-white/10 px-8 py-3.5 text-sm font-bold">
                  {t("volunteer.buttons.learnMore")}
                </Button>
              </Link>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};
