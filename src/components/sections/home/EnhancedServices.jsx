import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "../../ui/SectionTitle";
import { User, Users, Home, Activity, Stethoscope, Megaphone, ArrowRight } from "lucide-react";

import imgCounseling from "../../../Images/Mental Health Counseling Scene.png";
import imgGroup from "../../../Images/Group Therapy.png";
import imgFamily from "../../../Images/Family Therapy Service.png";
import imgCrisis from "../../../Images/Crisis Intervention.png";
import imgPsychiatric from "../../../Images/Psychiatric Consultation.png";
import imgCommunity from "../../../Images/Community Outreach Program.png";

const icons = {
  counseling: User,
  group: Users,
  family: Home,
  crisis: Activity,
  psychiatric: Stethoscope,
  community: Megaphone
};

const serviceImages = {
  counseling: imgCounseling,
  group: imgGroup,
  family: imgFamily,
  crisis: imgCrisis,
  psychiatric: imgPsychiatric,
  community: imgCommunity
};

import { useImageCMS } from "../../../context/ImageCMSContext.jsx";

const serviceKeys = ["counseling", "group", "family", "crisis", "psychiatric", "community"];

export const EnhancedServices = () => {
  const { t } = useTranslation("home");
  const { getSystemImage } = useImageCMS();

  const dynamicImages = {
    counseling: getSystemImage("home", "service-counseling", imgCounseling),
    group: getSystemImage("home", "service-group", imgGroup),
    family: getSystemImage("home", "service-family", imgFamily),
    crisis: getSystemImage("home", "service-crisis", imgCrisis),
    psychiatric: getSystemImage("home", "service-psychiatric", imgPsychiatric),
    community: getSystemImage("home", "service-community", imgCommunity)
  };
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionTitle title={t("services.title")} centered className="mb-6" />
          <p className="text-lg text-slate-600">
            {t("services.subtitle")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-12">
          {serviceKeys.map((key, idx) => {
            const Icon = icons[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-white rounded-3xl shadow-[0_4px_20px_rgba(15,23,42,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(30,58,138,0.08)] hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100">
                  <img 
                    src={dynamicImages[key]} 
                    alt={t(`services.items.${key}.title`)} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Text Section */}
                <div className="p-6 lg:p-8 flex-grow flex flex-col relative bg-white">
                  {/* Overlapping icon */}
                  <div className="absolute -top-8 left-6 lg:left-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] flex items-center justify-center shadow-lg text-white border-4 border-white z-10 group-hover:-translate-y-1 transition-transform duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#1E293B] mb-4 mt-8 group-hover:text-[#2563EB] transition-colors">
                    {t(`services.items.${key}.title`)}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                    {t(`services.items.${key}.desc`)}
                  </p>
                  
                  <Link to="/services" className="inline-flex items-center gap-2 text-[#2563EB] font-semibold hover:text-[#1E3A8A] transition-colors mt-auto w-fit">
                    {t("services.learnMore")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/services">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-50 text-slate-700 font-semibold border border-slate-200 hover:bg-white hover:shadow-md hover:border-[#2563EB] hover:text-[#2563EB] transition-all duration-300">
              {t("services.viewAll")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
