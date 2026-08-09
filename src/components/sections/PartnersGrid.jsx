import { useState, useEffect } from "react";
import { partners as staticPartners } from "../../data/partners";
import { SectionTitle } from "../ui/SectionTitle";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

export const PartnersGrid = () => {
  const { t } = useTranslation("common");
  const [dbPartners, setDbPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/partners");
        if (res.ok) {
          const data = await res.json();
          if (data.partners && data.partners.length > 0) {
            setDbPartners(data.partners);
          }
        }
      } catch (err) {
        console.error("Failed to fetch partners dynamically:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const displayList = dbPartners.length > 0
    ? dbPartners.map((p) => ({ id: p._id, name: p.name, logo: p.logo, website: p.website }))
    : staticPartners;

  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle 
          title={t('partners.title')} 
          subtitle={t('partners.subtitle')}
          centered
          className="mb-16"
        />
        
        {loading && dbPartners.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
            {displayList.map((partner) => (
              <div 
                key={partner.id} 
                className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200/40 rounded-2xl hover:bg-slate-100 hover:scale-[1.02] hover:shadow-md transition-all duration-300 h-32 cursor-pointer group"
                onClick={() => {
                  if (partner.website) {
                    window.open(partner.website, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                {partner.logo ? (
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                  />
                ) : (
                  <span className="font-extrabold text-slate-800 text-center leading-tight tracking-wide">{partner.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
