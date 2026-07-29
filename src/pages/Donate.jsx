import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { DonationHero } from "../components/donate/DonationHero";
import { ImpactCards } from "../components/donate/ImpactCards";
import { MultiStepDonationForm } from "../components/donate/MultiStepDonationForm";

const Donate = () => {
  const { t } = useTranslation("donate");
  return (
    <>
      <Helmet>
        <title>{t("seo.title")}</title>
        <meta name="description" content={t("seo.description")} />
      </Helmet>
      <main className="bg-slate-50 min-h-screen">
        <DonationHero />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column - Impact Messaging */}
            <div className="lg:col-span-5 flex flex-col justify-start pt-4">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-6">
                {t("impact.title")}
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                {t("impact.description")}
              </p>
              <ImpactCards />
            </div>

            {/* Right Column - Donation Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <MultiStepDonationForm />
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
};

export default Donate;
