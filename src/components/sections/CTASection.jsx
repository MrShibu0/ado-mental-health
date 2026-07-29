import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";

export const CTASection = () => {
  const { t } = useTranslation("common");
  return (
    <div className="bg-teal py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
          {t('cta.title')}
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-white/90 mb-10">
          {t('cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/contact">
            <Button variant="primary" size="lg" className="w-full sm:w-auto bg-white text-teal hover:bg-gray-50 shadow-white/20">
              {t('cta.getSupport')}
            </Button>
          </Link>
          <Link to="/donate">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
              {t('cta.donateNow')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
