import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Card, CardBody } from "../components/ui/Card";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const newsImages = [
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1593113565637-ee54dfdd23bd?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=600&h=400"
];

const News = () => {
  const { t } = useTranslation('news');
  const fallbackItems = t('items', { returnObjects: true }) || [];
  
  const [dbNews, setDbNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news?limit=12");
        if (res.ok) {
          const data = await res.json();
          // Filter to only display published items
          const published = (data.articles || []).filter(x => x.published);
          if (published.length > 0) {
            setDbNews(published);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic news articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const newsList = dbNews.length > 0 
    ? dbNews.map((item, idx) => ({
        title: item.title,
        excerpt: item.description || (item.content ? item.content.slice(0, 120) + "..." : ""),
        category: item.category,
        date: new Date(item.createdAt).toLocaleDateString(),
        image: item.coverImage || newsImages[idx % newsImages.length]
      }))
    : fallbackItems.map((item, idx) => ({
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        date: item.date,
        image: newsImages[idx % newsImages.length]
      }));

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>
      <main className="bg-slate-50 min-h-screen">
        <PageHeader 
          title={t('page.title')} 
          subtitle={t('page.subtitle')}
          breadcrumb={t('page.breadcrumb')}
        />
        
        <div className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionTitle title={t('sections.latestNews')} className="mb-12" />
            
            {loading && dbNews.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsList.map((item, index) => (
                  <Card key={index} className="flex flex-col h-full bg-white border border-slate-200/50 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                    <div className="h-48 overflow-hidden bg-slate-100">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                    <CardBody className="flex flex-col flex-1 p-6">
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium">{item.category}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{item.title}</h3>
                      <p className="text-slate-650 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{item.excerpt}</p>
                      <Link to="#" className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit text-sm">
                        {t('actions.readMore')} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default News;
