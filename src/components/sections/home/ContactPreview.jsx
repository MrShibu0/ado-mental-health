import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SectionTitle } from "../../ui/SectionTitle";

export const ContactPreview = () => {
  const { t } = useTranslation("home");
  
  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title={t("contactPreview.title")} centered className="mb-16" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] transition-colors duration-300">
                <MapPin className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E293B] mb-1">{t("contactPreview.address")}</h4>
                <p className="text-slate-600 leading-relaxed">
                  123 Rue Principale<br />
                  Anse-à-Galets, La Gonâve<br />
                  Haïti
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] transition-colors duration-300">
                <Phone className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E293B] mb-1">{t("contactPreview.phone")} / {t("contactPreview.whatsapp")}</h4>
                <p className="text-slate-600 font-medium">
                  +509 3000-0000
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] transition-colors duration-300">
                <Mail className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E293B] mb-1">{t("contactPreview.email")}</h4>
                <p className="text-slate-600 font-medium">
                  info@adocenter.org
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] transition-colors duration-300">
                <Clock className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1E293B] mb-1">{t("contactPreview.hours")}</h4>
                <p className="text-slate-600">
                  Mon-Fri: 8:00 AM - 5:00 PM<br />
                  Weekend: Emergencies only
                </p>
              </div>
            </div>
            
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white h-[400px] bg-slate-200 relative"
          >
            {/* Embedded Google Map */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15124.939226522338!2d-72.87192341997384!3d18.831034426577843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ebd4f9f257bfbb7%3A0xc665e8aebcfbe9a4!2sAnse-a-Galets%2C%20Haiti!5e0!3m2!1sen!2sus!4v1717000000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="ADO Center Map Location"
              className="absolute inset-0 grayscale contrast-125 opacity-90 hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
