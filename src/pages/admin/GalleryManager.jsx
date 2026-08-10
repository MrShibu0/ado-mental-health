import { useState, useEffect } from "react";
import { 
  Plus, Search, Filter, Trash2, Undo2, Star, 
  Eye, Calendar, MapPin, Loader2, RefreshCw, AlertCircle, RefreshCw as ReplaceIcon, Check, Image
} from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Community Programs", "Counseling", "Family Therapy", 
  "School Programs", "Training", "Workshops", 
  "Community Outreach", "Events", "Team", 
  "Awareness Campaigns", "Other",
  "System Banner", "System Logo", "System Hero", "System Section", "System Partner", "System News", "System Resource"
];

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [recycleBin, setRecycleBin] = useState([]);
  const [showRecycle, setShowRecycle] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [usageTypeFilter, setUsageTypeFilter] = useState("All"); // "All", "System", "Gallery"
  const [isUsedFilter, setIsUsedFilter] = useState("All"); // "All", "Used", "Unused"
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Upload / Edit form states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  // Preview modal & references
  const [previewItem, setPreviewItem] = useState(null);
  const [references, setReferences] = useState([]);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Community Programs",
    location: "",
    eventDate: new Date().toISOString().split("T")[0],
    altText: "",
    featured: false,
    file: null,
    tags: "",
    coordinates: ""
  });

  // Bulk action states
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (showRecycle) {
        const res = await fetch("/api/gallery/recycle-bin");
        if (res.ok) {
          const data = await res.json();
          setRecycleBin(data.items);
        }
      } else {
        const params = {
          page,
          limit: 12,
          category,
          search,
          sort
        };
        if (isUsedFilter === "Used") params.isUsed = "true";
        if (isUsedFilter === "Unused") params.isUsed = "false";
        if (usageTypeFilter === "System") params.usageType = "system";
        if (usageTypeFilter === "Gallery") params.usageType = "gallery";

        const queryParams = new URLSearchParams(params);
        const res = await fetch(`/api/gallery?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items);
          setTotalPages(data.pages);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to retrieve gallery items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    setSelectedIds([]); // clear selection
  }, [showRecycle, page, category, sort, isUsedFilter, usageTypeFilter]);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchItems();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files[0]
      }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.file) {
      return toast.error("Title and image file are required.");
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    payload.append("location", formData.location);
    payload.append("eventDate", formData.eventDate);
    payload.append("altText", formData.altText);
    payload.append("featured", formData.featured);
    payload.append("file", formData.file);

    const uploadToast = toast.loading("Processing and uploading image...");
    try {
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: payload
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: uploadToast });
        setShowUploadModal(false);
        setFormData({
          title: "",
          description: "",
          category: "Community Programs",
          location: "",
          eventDate: new Date().toISOString().split("T")[0],
          altText: "",
          featured: false,
          file: null
        });
        fetchItems();
      } else {
        toast.error(data.error || "Failed to upload image.", { id: uploadToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error. Please try again.", { id: uploadToast });
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category,
      location: item.location || "",
      eventDate: new Date(item.eventDate).toISOString().split("T")[0],
      altText: item.altText || "",
      featured: item.featured,
      file: null
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updateToast = toast.loading("Updating gallery metadata...");
    try {
      const res = await fetch(`/api/gallery/${editItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          eventDate: formData.eventDate,
          altText: formData.altText,
          featured: formData.featured
        })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: updateToast });
        setShowEditModal(false);
        fetchItems();
      } else {
        toast.error(data.error || "Failed to update details.", { id: updateToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Update error.", { id: updateToast });
    }
  };

  const handlePreviewClick = async (item) => {
    setPreviewItem(item);
    setReferences([]);
    setLoadingRefs(true);
    try {
      const res = await fetch(`/api/gallery/${item._id}/references`);
      if (res.ok) {
        const data = await res.json();
        setReferences(data.references || []);
      } else {
        toast.error("Failed to load image usage locations.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred loading usage references.");
    } finally {
      setLoadingRefs(false);
    }
  };

  const handleReplaceFile = async (id, file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      return toast.error("File is too large. Max size is 10MB.");
    }

    const payload = new FormData();
    payload.append("file", file);

    const replaceToast = toast.loading("Replacing image files on server...");
    try {
      const res = await fetch(`/api/gallery/${id}/replace`, {
        method: "PUT",
        body: payload
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, { id: replaceToast });
        setPreviewItem(null); // Close preview
        fetchItems();
      } else {
        toast.error(data.error || "Failed to replace image.", { id: replaceToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during replacement.", { id: replaceToast });
    }
  };

  const handleDelete = async (id, permanent = false) => {
    const confirmMsg = permanent 
      ? "Are you sure you want to permanently delete this image? This will delete the database entry and the files on disk!" 
      : "Move this image to the Recycle Bin?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchItems();
      } else {
        if (data.error === "IMAGE_IN_USE") {
          const refList = (data.references || []).map(r => `• ${r.page} → ${r.section} (${r.type})`).join("\n");
          alert(`This image cannot be permanently deleted because it is currently used on the website in:\n\n${refList}\n\nPlease replace or remove the image reference in these locations first.`);
        } else {
          toast.error(data.error || "Failed to delete item.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete error.");
    }
  };

  const handleRestore = async (id) => {
    try {
      const res = await fetch(`/api/gallery/${id}/restore`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchItems();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Restore error.");
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      const res = await fetch(`/api/gallery/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !item.featured })
      });
      if (res.ok) {
        toast.success(item.featured ? "Removed from Featured" : "Marked as Featured");
        fetchItems();
      } else {
        toast.error("Failed to toggle featured status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk Actions
  const handleCheckboxChange = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (itemList) => {
    if (selectedIds.length === itemList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(itemList.map(x => x._id));
    }
  };

  const handleBulkAction = async (permanent = false) => {
    const confirmMsg = permanent
      ? `Permanently delete all ${selectedIds.length} selected items from database and disk?`
      : `Move all ${selectedIds.length} selected items to the Recycle Bin?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/gallery/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, permanent })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchItems();
        setSelectedIds([]);
      } else {
        if (data.error === "IMAGE_IN_USE" && data.details) {
          const detailList = data.details.map(item => {
            const refList = item.references.map(r => `  - ${r.page} → ${r.section} (${r.type})`).join("\n");
            return `• ${item.title}:\n${refList}`;
          }).join("\n\n");
          alert(`Some selected images cannot be permanently deleted because they are used on the website:\n\n${detailList}\n\nPlease replace them first.`);
        } else {
          toast.error(data.error || "Bulk action failed.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Bulk action failed.");
    }
  };

  const currentList = showRecycle ? recycleBin : items;

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
            {showRecycle ? "Gallery Recycle Bin" : "Gallery Management"}
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            {showRecycle ? "Manage soft-deleted items or permanently remove them." : "Upload new photos, edit details, or toggle featured elements."}
          </p>
        </div>
        
        {/* Buttons Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRecycle(!showRecycle)}
            className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              showRecycle 
                ? "bg-blue-600 border-blue-500 text-white" 
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            {showRecycle ? "Back to Active Gallery" : "View Recycle Bin"}
          </button>
          {!showRecycle && (
            <button
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  category: "Community Programs",
                  location: "",
                  eventDate: new Date().toISOString().split("T")[0],
                  altText: "",
                  featured: false,
                  file: null
                });
                setShowUploadModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-bold shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Photo
            </button>
          )}
        </div>
      </div>

      {/* Filters (Active Gallery Mode Only) */}
      {!showRecycle && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 bg-slate-900/40 p-4 border border-slate-800/80 rounded-[20px]">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Filter className="w-4 h-4" />
            </span>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Usage Type Dropdown */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Filter className="w-4 h-4" />
            </span>
            <select
              value={usageTypeFilter}
              onChange={(e) => { setUsageTypeFilter(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Usage Types</option>
              <option value="gallery">Gallery Images</option>
              <option value="system">System Images</option>
            </select>
          </div>

          {/* Is Used Dropdown */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Filter className="w-4 h-4" />
            </span>
            <select
              value={isUsedFilter}
              onChange={(e) => { setIsUsedFilter(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">Used & Unused</option>
              <option value="Used">Used on Site</option>
              <option value="Unused">Unused on Site</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Filter className="w-4 h-4" />
            </span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              <option value="newest">Newest Upload</option>
              <option value="oldest">Oldest Upload</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
              setUsageTypeFilter("All");
              setIsUsedFilter("All");
              setSort("newest");
              setPage(1);
            }}
            className="flex items-center justify-center gap-2 bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-300 py-2 rounded-xl transition-colors border border-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      )}

      {/* Bulk actions controls */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 bg-blue-950/20 border border-blue-900/40 p-4 rounded-xl text-sm justify-between">
          <span className="font-semibold text-blue-400">{selectedIds.length} items selected</span>
          <div className="flex items-center gap-3">
            {showRecycle ? (
              <>
                <button
                  onClick={() => handleBulkAction(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-400 bg-red-950/25 border border-red-900/40 hover:bg-red-900/45 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Permanent Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => handleBulkAction(false)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-400 bg-red-950/25 border border-red-900/40 hover:bg-red-950/45 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Move to Recycle Bin
              </button>
            )}
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Items Loader */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-slate-900/20 rounded-[28px] border border-slate-800/80 p-16 text-center text-slate-500">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-lg font-bold">No gallery items found.</p>
          <p className="text-sm text-slate-500 mt-1">Try updating your filters or search criteria.</p>
        </div>
      ) : (
        /* Image Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentList.map((item) => {
            const isSelected = selectedIds.includes(item._id);
            return (
              <div 
                key={item._id}
                className={`bg-slate-900/50 rounded-[24px] border overflow-hidden flex flex-col group transition-all duration-300 ${
                  isSelected ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Image Wrap */}
                <div 
                  onClick={() => handlePreviewClick(item)}
                  title="Click to preview details & usage"
                  className="relative aspect-[4/3] bg-slate-800 overflow-hidden cursor-pointer flex items-center justify-center"
                >
                  {imageErrors[item._id] ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-red-500/80 mb-1" />
                      <span className="text-[10px] font-bold text-slate-400">File Not Found</span>
                      <span className="text-[8px] text-slate-550 mt-0.5">Click to replace on server</span>
                    </div>
                  ) : (
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.title} 
                      onError={() => setImageErrors(prev => ({ ...prev, [item._id]: true }))}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  )}
                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-400 border border-white/[0.04] uppercase tracking-wider">
                    {item.category}
                  </span>
                  
                  {/* Select Checkbox (top-right overlay) */}
                  <div className="absolute top-3 right-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(item._id)}
                      className="w-5 h-5 rounded-lg border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>

                  {/* Featured Star Overlay */}
                  {item.featured && !showRecycle && (
                    <div className="absolute bottom-3 right-3 bg-amber-500 p-1.5 rounded-xl text-slate-950 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}
                </div>

                {/* Info Text */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-white leading-snug group-hover:text-blue-400 transition-colors line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(item.eventDate).toLocaleDateString()}</span>
                      {item.location && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                      )}
                    </div>

                    {/* Views & Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Eye className="w-3.5 h-3.5" /> {item.views} views
                      </span>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {showRecycle ? (
                          <>
                            <button
                              onClick={() => handleRestore(item._id)}
                              title="Restore"
                              className="p-2 bg-slate-850 hover:bg-slate-800 text-blue-400 rounded-lg border border-slate-800"
                            >
                              <Undo2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id, true)}
                              title="Delete Permanently"
                              className="p-2 bg-red-950/20 border border-red-900/35 hover:bg-red-900/40 text-red-400 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleToggleFeatured(item)}
                              title={item.featured ? "Unfeature" : "Feature"}
                              className={`p-2 rounded-lg border transition-all ${
                                item.featured 
                                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                                  : "bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(item)}
                              className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id, false)}
                              title="Move to Recycle Bin"
                              className="p-2 bg-slate-850 border border-slate-800 hover:bg-red-950/20 hover:text-red-400 rounded-lg text-slate-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination (Active Grid Mode Only) */}
      {!showRecycle && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-xs font-bold rounded-lg transition-all"
          >
            Prev
          </button>
          <span className="text-xs text-slate-400 px-3">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-xs font-bold rounded-lg transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* Upload/Add Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold text-white mb-6">Upload Image to Gallery</h3>
            
            <form onSubmit={handleUploadSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter photo title"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter brief description"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Haiti Clinic"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Alt Text</label>
                  <input
                    type="text"
                    name="altText"
                    value={formData.altText}
                    onChange={handleInputChange}
                    placeholder="Description for accessibility"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. clinic, staff, community"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Coordinates</label>
                  <input
                    type="text"
                    name="coordinates"
                    value={formData.coordinates}
                    onChange={handleInputChange}
                    placeholder="e.g. 18.8310, -72.8719"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-400 focus:outline-none focus:border-blue-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1.5 font-semibold">Accepted formats: JPG, PNG, WEBP. Max size: 10MB.</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-slate-300 cursor-pointer select-none">Mark as Featured Image</label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl text-sm hover:shadow-[0_4px_15px_rgba(59,130,246,0.2)] transition-all"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold text-white mb-6">Edit Image Details</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter title"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter description"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Alt Text</label>
                  <input
                    type="text"
                    name="altText"
                    value={formData.altText}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. clinic, staff, community"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Coordinates</label>
                  <input
                    type="text"
                    name="coordinates"
                    value={formData.coordinates}
                    onChange={handleInputChange}
                    placeholder="e.g. 18.8310, -72.8719"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="editFeatured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="editFeatured" className="text-sm font-semibold text-slate-300 cursor-pointer select-none">Featured Image</label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl text-sm"
                >
                  Update & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Detailed Image Preview & References Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-6">
            {/* Image Preview Side */}
            <div className="md:w-1/2 flex flex-col justify-center bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-3 relative min-h-[220px] items-center">
              {imageErrors[previewItem._id] ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-550">
                  <AlertCircle className="w-10 h-10 text-red-550 mb-2" />
                  <p className="text-xs font-bold text-slate-350">Physical file missing on server</p>
                  <p className="text-[10px] text-slate-500 mt-1">Due to Render's ephemeral disk restarts, uploads are periodically cleared. Please upload a replacement image file below.</p>
                </div>
              ) : (
                <img
                  src={previewItem.imageUrl}
                  alt={previewItem.title}
                  onError={() => setImageErrors(prev => ({ ...prev, [previewItem._id]: true }))}
                  className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain rounded-xl"
                />
              )}
              <div className="mt-4 flex gap-2 w-full">
                <label className="flex-grow py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-lg shadow-blue-600/10">
                  <ReplaceIcon className="w-3.5 h-3.5" />
                  Replace Image File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleReplaceFile(previewItem._id, e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Info Side */}
            <div className="md:w-1/2 flex flex-col justify-between text-left space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{previewItem.title}</h3>
                {previewItem.description && (
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{previewItem.description}</p>
                )}
                
                {/* Metadata Details */}
                <div className="space-y-2.5 text-xs border-t border-slate-800/60 pt-4">
                  <div className="flex justify-between"><span className="text-slate-500">Category:</span> <span className="text-slate-300 font-semibold">{previewItem.category}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Usage Type:</span> <span className="text-slate-300 capitalize">{previewItem.usageType || "gallery"}</span></div>
                  {previewItem.location && <div className="flex justify-between"><span className="text-slate-500">Location:</span> <span className="text-slate-300">{previewItem.location}</span></div>}
                  {previewItem.coordinates && <div className="flex justify-between"><span className="text-slate-500">Coordinates:</span> <span className="text-slate-300">{previewItem.coordinates}</span></div>}
                  {previewItem.mediaRef && (
                    <>
                      <div className="flex justify-between"><span className="text-slate-500">File Name:</span> <span className="text-slate-300 truncate max-w-[180px] font-mono">{previewItem.mediaRef.filename}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">File Size:</span> <span className="text-slate-300">{(previewItem.mediaRef.size / 1024).toFixed(1)} KB</span></div>
                    </>
                  )}
                  <div className="flex justify-between"><span className="text-slate-500">Created:</span> <span className="text-slate-300">{new Date(previewItem.createdAt).toLocaleString()}</span></div>
                  {previewItem.altText && <div className="flex justify-between"><span className="text-slate-500">Alt Text:</span> <span className="text-slate-300 italic">"{previewItem.altText}"</span></div>}
                </div>

                {/* Tags */}
                {previewItem.tags && previewItem.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/60">
                    <span className="text-xs text-slate-500 block mb-2">Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {previewItem.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Usage Locations */}
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <span className="text-xs font-bold text-slate-400 block mb-2">Active Website References:</span>
                  {loadingRefs ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Scanning references...
                    </div>
                  ) : references.length === 0 ? (
                    <p className="text-xs text-teal-400 font-medium">✓ Safe to delete. Not currently used anywhere on the website.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {references.map((r, rIdx) => (
                        <li key={rIdx} className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="font-semibold text-slate-450 capitalize">{r.page}</span> 
                          <span className="text-slate-650">→</span> 
                          <span>{r.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-550 capitalize">{r.type}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex gap-3 pt-6 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewItem(null);
                    handleEditClick(previewItem);
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Move this image to the Recycle Bin?")) {
                      handleDelete(previewItem._id, false);
                      setPreviewItem(null);
                    }
                  }}
                  className="px-3 py-2.5 bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/20 rounded-xl text-xs transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-450 hover:text-white font-bold rounded-xl text-xs transition-colors border border-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
