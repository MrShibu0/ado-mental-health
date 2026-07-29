import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionTitle } from "../../ui/SectionTitle";

export const LatestGallery = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox
  const [activePhoto, setActivePhoto] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(-1);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      let url = "/api/gallery?limit=6";
      if (activeTab === "featured") {
        url = "/api/gallery?featured=true&limit=6";
      } else if (activeTab === "community") {
        // Fetch Community Outreach/Programs categories
        url = "/api/gallery?category=Community Programs&limit=6";
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [activeTab]);

  const handlePhotoClick = async (photo, index) => {
    setPhotoIndex(index);
    setActivePhoto(photo);
    try {
      await fetch(`/api/gallery/${photo._id}`); // increment view count
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
      setActivePhoto(photos[photoIndex - 1]);
    }
  };

  const handleNextPhoto = () => {
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
      setActivePhoto(photos[photoIndex + 1]);
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionTitle title="Capturing Our Impact" className="mb-2" />
            <p className="text-slate-650 max-w-xl">Take a visual tour of our programs, clinic updates, and community counseling sessions in Haiti.</p>
          </div>
          
          {/* Tab Controls */}
          <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200/60 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "featured" ? "bg-[#1E3A8A] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab("latest")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "latest" ? "bg-[#1E3A8A] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "community" ? "bg-[#1E3A8A] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Community
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-slate-55 rounded-3xl border border-dashed border-slate-200">
            No photos available in this tab.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo._id}
                layoutId={`latest-gallery-${photo._id}`}
                onClick={() => handlePhotoClick(photo, index)}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200/40 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <img 
                  src={photo.thumbnailUrl} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">{photo.category}</span>
                  <h4 className="text-lg font-bold text-white leading-tight mb-2">{photo.title}</h4>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(photo.eventDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {photo.views} views</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link to="/gallery">
            <button className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>

      {/* Embedded Lightbox */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="h-16 px-6 bg-slate-900/60 backdrop-blur-md flex items-center justify-between border-b border-slate-800 z-20">
              <span className="text-sm font-semibold text-slate-400">Photo Preview</span>
              <button 
                onClick={() => setActivePhoto(null)}
                className="p-2 text-slate-450 hover:text-white bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View */}
            <div className="flex-1 relative flex items-center justify-center p-4">
              {photoIndex > 0 && (
                <button 
                  onClick={handlePrevPhoto}
                  className="absolute left-6 z-10 p-3 bg-slate-900/75 text-white hover:bg-slate-800 rounded-xl border border-slate-800"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img src={activePhoto.imageUrl} alt={activePhoto.title} className="max-w-full max-h-[70vh] object-contain rounded-xl" />

              {photoIndex < photos.length - 1 && (
                <button 
                  onClick={handleNextPhoto}
                  className="absolute right-6 z-10 p-3 bg-slate-900/75 text-white hover:bg-slate-800 rounded-xl border border-slate-800"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 border-t border-slate-800 text-left">
              <div className="max-w-4xl mx-auto space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{activePhoto.category}</span>
                <h3 className="text-lg font-bold text-white">{activePhoto.title}</h3>
                {activePhoto.description && (
                  <p className="text-slate-450 text-xs mt-1.5 leading-relaxed">{activePhoto.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
