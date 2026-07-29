import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function usePageCMS(pageName) {
  const { i18n } = useTranslation();
  const [cmsData, setCmsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await fetch(`/api/pages/${pageName}`);
        if (res.ok) {
          const data = await res.json();
          const mapped = {};
          const currentLocale = i18n.language || "en";

          (data.content || []).forEach(doc => {
            if (doc.locale === currentLocale) {
              mapped[doc.section] = doc.content;
            }
          });
          setCmsData(mapped);
        }
      } catch (err) {
        console.error(`Error loading page CMS for ${pageName}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchCMS();
  }, [pageName, i18n.language]);

  return { cmsData, loading };
}
