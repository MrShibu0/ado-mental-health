import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { PartnersGrid } from "../components/sections/PartnersGrid";
import { CTASection } from "../components/sections/CTASection";

const Partners = () => {
  const { t } = useTranslation('partners');

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>
      <main>
        <PageHeader 
          title={t('page.title')} 
          subtitle={t('page.subtitle')}
          breadcrumb={t('page.breadcrumb')}
        />
        
        <PartnersGrid />
        
        <div className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-6">{t('becomePartner.title')}</h2>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-muted mb-10">
              {t('becomePartner.description')}
            </p>
            <a href="mailto:contact@adocenter.org" className="inline-flex items-center justify-center rounded-full bg-teal px-8 py-3.5 text-lg font-semibold text-white shadow-lg transition-all hover:bg-teal/90 hover:scale-105">
              {t('becomePartner.contactUs')}
            </a>
          </div>
        </div>

        <CTASection />
      </main>
    </>
  );
};

export default Partners;
