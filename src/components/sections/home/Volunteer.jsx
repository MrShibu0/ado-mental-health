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
          className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={volunteerImage} 
              alt="Volunteer" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/95 via-[#1E3A8A]/90 to-transparent mix-blend-multiply" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-12 lg:p-20 items-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 backdrop-blur-sm border border-white/30">
                <HeartHandshake className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {t("volunteer.title")}
              </h2>
              <p className="text-xl text-blue-50 leading-relaxed mb-10">
                {t("volunteer.desc")}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/contact">
                  <Button variant="primary" size="lg" className="rounded-full shadow-lg bg-white text-[#1E3A8A] hover:bg-slate-50 border-none px-8 py-3.5">
                    {t("volunteer.buttons.become")}
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="rounded-full border-white/50 text-white hover:bg-white/10 px-8 py-3.5">
                    {t("volunteer.buttons.learnMore")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
