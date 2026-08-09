import React, { useState, useEffect } from "react";
import { Search, Image, Upload, X, Check } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "All",
  "Community Programs", "Counseling", "Family Therapy", 
  "School Programs", "Training", "Workshops", 
  "Community Outreach", "Events", "Team", 
  "Awareness Campaigns", "Other",
  "System Banner", "System Logo", "System Hero", "System Section", "System Partner", "System News", "System Resource"
];

export const GallerySelector = ({ onSelect, currentUrl, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const url = `/api/gallery?category=${category}&search=${search}&page=${page}&limit=8`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setTotalPages(data.pages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load media gallery items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      return toast.error("File is too large. Max size is 10MB.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", `Uploaded cover: ${file.name}`);
    formData.append("category", "System News");
    formData.append("eventDate", new Date().toISOString().split("T")[0]);
    formData.append("usageType", "system");

    setUploading(true);
    try {
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Image uploaded successfully!");
        onSelect(data.item.imageUrl);
        if (onClose) onClose();
      } else {
        toast.error(data.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl p-6 sm:p-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Select Image from Media Library</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by title, location, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-sm font-semibold transition-colors">
              Search
            </button>
          </form>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* Direct File Upload */}
          <label className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] text-white text-sm font-bold rounded-xl cursor-pointer transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload New"}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto min-h-[300px] mb-6 custom-scrollbar pr-2">
          {loading ? (
            <div className="h-full flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-slate-500">
              <Image className="w-12 h-12 mb-3 stroke-[1.5]" />
              <p className="text-sm">No images found matching filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {items.map(item => {
                const isSelected = currentUrl === item.imageUrl;
                return (
                  <div
                    key={item._id}
                    onClick={() => onSelect(item.imageUrl)}
                    className={`relative aspect-[4/3] bg-slate-950 rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-300 ${
                      isSelected ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.2)]" : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <img
                      src={item.thumbnailUrl || item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Checkmark overlay for selection */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-blue-500 p-1 rounded-lg text-white shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Image details overlay on hover */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                      <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                      <p className="text-[9px] text-slate-400 capitalize">{item.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-800">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-850 disabled:opacity-40 border border-slate-800 text-xs font-bold rounded-lg text-white transition-all"
            >
              Prev
            </button>
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-850 disabled:opacity-40 border border-slate-800 text-xs font-bold rounded-lg text-white transition-all"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
