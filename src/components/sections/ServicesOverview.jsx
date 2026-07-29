import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { services } from "../../data/services";
import { ServiceCard } from "../ui/ServiceCard";
import { SectionTitle } from "../ui/SectionTitle";
import { Button } from "../ui/Button";

export const ServicesOverview = () => {
  const { t } = useTranslation("home");
  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionTitle 
            title={t("servicesOverview.title")} 
            subtitle={t("servicesOverview.subtitle")}
          />
          <Link to="/services">
            <Button variant="outline">{t("servicesOverview.viewAll")}</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 8).map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
