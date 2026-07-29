import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Download, Calendar, MapPin, Loader2, RefreshCw 
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";

const CATEGORIES = [
  "All",
  "Community Programs", "Counseling", "Family Therapy", 
  "School Programs", "Training", "Workshops", 
  "Community Outreach", "Events", "Team", 
  "Awareness Campaigns", "Other"
];

export default function Gallery() {
  const { t } = useTranslation("navigation");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Lightbox states
  const [activePhoto, setActivePhoto] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(-1);
  const [zoomScale, setZoomScale] = useState(1);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: 12,
        category: selectedCategory,
        sort: "newest"
      });
      const res = await fetch(`/api/gallery?${query}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotalPages(data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory, page]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activePhoto) return;
      if (e.key === "Escape") handleCloseLightbox();
      if (e.key === "ArrowLeft") handlePrevPhoto();
      if (e.key === "ArrowRight") handleNextPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, photoIndex, items]);

  const handlePhotoClick = async (photo, index) => {
    setPhotoIndex(index);
    setActivePhoto(photo);
    setZoomScale(1);

    // Trigger API call to increment view counter on backend
    try {
      await fetch(`/api/gallery/${photo._id}`);
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  };

  const handleCloseLightbox = () => {
    setActivePhoto(null);
    setPhotoIndex(-1);
    setZoomScale(1);
  };

  const handlePrevPhoto = () => {
    if (photoIndex > 0) {
      const newIndex = photoIndex - 1;
      setPhotoIndex(newIndex);
      setActivePhoto(items[newIndex]);
      setZoomScale(1);
    }
  };

  const handleNextPhoto = () => {
    if (photoIndex < items.length - 1) {
      const newIndex = photoIndex + 1;
      setPhotoIndex(newIndex);
      setActivePhoto(items[newIndex]);
      setZoomScale(1);
    }
  };

  const zoomIn = () => setZoomScale(s => Math.min(s + 0.25, 2.5));
  const zoomOut = () => setZoomScale(s => Math.max(s - 0.25, 0.75));

  return (
    <>
      <Helmet>
        <title>ADO Center - Photo Gallery</title>
        <meta name="description" content="Explore photos of ADO Mental Health Center's community workshops, school events, counseling clinics, and resilience sessions." />
      </Helmet>
      
      <main className="bg-slate-50 min-h-screen pb-24">
        <PageHeader 
          title="Photo Gallery" 
          subtitle="Capturing our impact, community milestones, and clinical initiatives in Haiti."
          breadcrumb="Gallery"
        />

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
          
          {/* Category Tabs (Scrollable on mobile) */}
          <div className="flex overflow-x-auto pb-4 gap-2.5 scrollbar-thin border-b border-slate-200/60 sticky top-[88px] bg-slate-50 z-10 py-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#1E3A8A] text-white shadow-md"
                    : "bg-white text-slate-650 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {cat === "All" ? "All Photos" : cat}
              </button>
            ))}
          </div>

          {/* Gallery Body Grid */}
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 text-slate-500 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
              <p className="text-lg font-bold">No photos uploaded in this category.</p>
              <p className="text-sm mt-1">Please check back later for updates.</p>
            </div>
          ) : (
            /* Premium Responsive Masonry Grid using CSS Columns */
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {items.map((photo, index) => (
                <motion.div
                  key={photo._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handlePhotoClick(photo, index)}
                  className="break-inside-avoid bg-white rounded-3xl overflow-hidden border border-slate-200/50 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group cursor-pointer flex flex-col mb-6"
                >
                  <div className="relative overflow-hidden bg-slate-100">
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.altText || photo.title}
                      loading="lazy"
                      className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                      <span className="text-[10px] font-bold text-white bg-blue-600/90 px-3 py-1 rounded-full uppercase tracking-wider">
                        {photo.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow">
                    <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-[#2563EB] transition-colors leading-snug">
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">{photo.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-450 uppercase tracking-wider mt-4 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(photo.eventDate).toLocaleDateString()}</span>
                      {photo.location && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {photo.location}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition-all shadow-sm"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500 px-4 font-semibold">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Lightbox Modal (Framer Motion Overlay) */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between"
          >
            {/* Header controls */}
            <div className="h-16 px-6 bg-slate-900/60 backdrop-blur-md flex items-center justify-between border-b border-slate-800 z-20">
              <div className="text-sm font-semibold text-slate-300">
                Photo {photoIndex + 1} of {items.length}
              </div>
              
              <div className="flex items-center gap-2.5">
                <button onClick={zoomOut} className="p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl" title="Zoom Out"><ZoomOut className="w-5 h-5" /></button>
                <button onClick={zoomIn} className="p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl" title="Zoom In"><ZoomIn className="w-5 h-5" /></button>
                <a 
                  href={activePhoto.imageUrl} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl" 
                  title="Download File"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button onClick={handleCloseLightbox} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl ml-2" title="Close"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Photo Workspace View */}
            <div className="flex-1 relative flex items-center justify-center p-4">
              
              {/* Prev Button */}
              {photoIndex > 0 && (
                <button 
                  onClick={handlePrevPhoto}
                  className="absolute left-6 z-10 p-3.5 bg-slate-900/70 border border-slate-800 hover:bg-slate-800 rounded-2xl text-white shadow-xl transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Central Image Container */}
              <motion.div 
                layoutId={`gallery-img-${activePhoto._id}`}
                className="max-w-full max-h-[75vh] flex items-center justify-center overflow-hidden"
              >
                <img 
                  src={activePhoto.imageUrl} 
                  alt={activePhoto.title} 
                  style={{ transform: `scale(${zoomScale})` }}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl transition-transform duration-200" 
                />
              </motion.div>

              {/* Next Button */}
              {photoIndex < items.length - 1 && (
                <button 
                  onClick={handleNextPhoto}
                  className="absolute right-6 z-10 p-3.5 bg-slate-900/70 border border-slate-800 hover:bg-slate-800 rounded-2xl text-white shadow-xl transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

            </div>

            {/* Bottom details footer */}
            <div className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800 p-6 z-20 text-left">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-600/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activePhoto.category}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight">{activePhoto.title}</h3>
                  {activePhoto.description && (
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{activePhoto.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4.5 h-4.5 text-slate-600" /> {new Date(activePhoto.eventDate).toLocaleDateString()}</span>
                  {activePhoto.location && (
                    <span className="flex items-center gap-1.5"><MapPin className="w-4.5 h-4.5 text-slate-600" /> {activePhoto.location}</span>
                  )}
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
