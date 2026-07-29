import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import { SectionTitle } from "../../ui/SectionTitle";
import { Gift } from "lucide-react";

export const SupportMission = () => {
  const { t } = useTranslation("home");
  const amounts = ["25", "100", "250", "500"];
  
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionTitle title={t("supportMission.title")} centered className="mb-4" />
          <p className="text-lg text-slate-600">
            {t("supportMission.subtitle")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {amounts.map((amount, idx) => (
            <motion.div
              key={amount}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100 hover:border-[#14B8A6] hover:shadow-lg transition-all duration-300 relative group"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-[#14B8A6] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-t-3xl" />
              
              <div className="text-4xl font-extrabold text-[#1E3A8A] mb-4">
                {t(`supportMission.items.${amount}.amount`)}
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {t(`supportMission.items.${amount}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/donate">
            <Button variant="primary" size="lg" className="rounded-full shadow-xl bg-[#2563EB] hover:bg-[#3B82F6] hover:-translate-y-1 transition-all px-10 py-4 text-lg">
              <Gift className="w-5 h-5 mr-2 inline-block" />
              {t("supportMission.cta")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
