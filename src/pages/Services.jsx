import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { services } from "../data/services";
import { ServiceCard } from "../components/ui/ServiceCard";
import { CTASection } from "../components/sections/CTASection";

const Services = () => {
  const { t } = useTranslation('services');

  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
      </Helmet>
      <main>
        <PageHeader 
          title={t('headerTitle')} 
          subtitle={t('headerSubtitle')}
          breadcrumb={t('breadcrumb')}
        />
        
        <div className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        </div>

        <CTASection />
      </main>
    </>
  );
};

export default Services;
