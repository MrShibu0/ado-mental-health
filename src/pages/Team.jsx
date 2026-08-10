import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { team } from "../data/team";
import { TeamCard } from "../components/ui/TeamCard";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useImageCMS } from "../context/ImageCMSContext";
import teamImage from "../Images/Team Section.png";

const Team = () => {
  const { t } = useTranslation('team');
  const { getSystemImage } = useImageCMS();
  const dynamicImage = getSystemImage("team", "hero", teamImage);
  const departments = ["Leadership", "Clinical Team", "Community Team", "Administration", "Support Staff"];

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
        
        <div className="w-full h-64 md:h-96 relative overflow-hidden">
          <img 
            src={dynamicImage} 
            alt={t('imgAlt')} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-24">
            
            {departments.map(dept => {
              const members = team.filter(m => m.department === dept);
              if (members.length === 0) return null;
              
              return (
                <section key={dept}>
                  <SectionTitle title={t(`departments.${dept}`)} className="mb-10 border-b border-gray-200 pb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {members.map(member => (
                      <TeamCard key={member.id} member={member} />
                    ))}
                  </div>
                </section>
              );
            })}

            <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto text-center">
              <p className="text-gray-700 italic text-lg leading-relaxed">
                "{t('note')}"
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default Team;
