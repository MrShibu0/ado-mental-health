import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionTitle } from "../components/ui/SectionTitle";
import { CTASection } from "../components/sections/CTASection";
import { useImageCMS } from "../context/ImageCMSContext";
import trainingImage from "../Images/Training & Capacity Building.png";

const Training = () => {
  const { t } = useTranslation('training');
  const { getSystemImage } = useImageCMS();
  const dynamicImage = getSystemImage("training", "hero", trainingImage);
  const trainings = t('trainings', { returnObjects: true }) || [];

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
        
        <div className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionTitle 
              title={t('sectionTitle')} 
              subtitle={t('sectionSubtitle')}
              className="mb-16"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                {Array.isArray(trainings) && trainings.map((training, index) => (
                  <div key={index} className="flex gap-6 p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:shadow-md transition-shadow">
                    <div className="text-teal font-bold text-xl mt-1">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">{training.title}</h3>
                      <p className="text-muted leading-relaxed">{training.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="sticky top-32 rounded-3xl overflow-hidden shadow-xl group">
                <img 
                  src={dynamicImage} 
                  alt={t('imgAlt')} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <CTASection />
      </main>
    </>
  );
};

export default Training;
