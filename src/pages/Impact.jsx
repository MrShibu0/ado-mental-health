import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { ImpactDashboard } from "../components/sections/ImpactDashboard";
import { SectionTitle } from "../components/ui/SectionTitle";
import { CheckCircle2 } from "lucide-react";
import { CTASection } from "../components/sections/CTASection";

const Impact = () => {
  const { t } = useTranslation('impact');
  const outcomes = t('outcomes', { returnObjects: true }) || [];

  return (
    <>
      <Helmet>
        <title>{t('metaTitle')}</title>
        <meta name="description" content={t('metaDescription')} />
      </Helmet>
      <main>
        <PageHeader 
          title={t('pageTitle')} 
          subtitle={t('pageSubtitle')}
          breadcrumb={t('breadcrumb')}
        />
        
        <ImpactDashboard />

        <div className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionTitle 
              title={t('sectionTitle')} 
              subtitle={t('sectionSubtitle')}
              centered
              className="mb-16"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(outcomes) && outcomes.map((outcome, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <CheckCircle2 className="w-8 h-8 text-teal mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">{outcome.title}</h3>
                  <p className="text-muted leading-relaxed">{outcome.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-20 text-center max-w-3xl mx-auto">
              <p className="text-xl leading-relaxed text-primary font-medium italic">
                {t('quote')}
              </p>
            </div>
          </div>
        </div>

        <CTASection />
      </main>
    </>
  );
};

export default Impact;
