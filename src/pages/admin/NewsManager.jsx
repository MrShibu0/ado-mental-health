import { useState, useEffect } from "react";
import { 
  Plus, Search, Edit2, Trash2, Calendar, Eye, 
  Settings, Loader2, Undo2, ArrowLeft, CheckCircle2, History, Image
} from "lucide-react";
import toast from "react-hot-toast";
import { GallerySelector } from "../../components/admin/GallerySelector.jsx";

export default function NewsManager() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Editor mode states
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  
  // Versions history state
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    coverImage: "",
    category: "General",
    published: false,
    featured: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    seoOgImage: "",
    seoCanonicalUrl: ""
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        search
      });
      const res = await fetch(`/api/news?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
        setTotalPages(data.pages);
      } else {
        toast.error("Failed to load news articles.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error retrieving articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page]);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchArticles();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Auto-generate slug from title
    if (name === "title" && isAdding) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generatedSlug
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddClick = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      content: "",
      coverImage: "",
      category: "General",
      published: false,
      featured: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      seoOgImage: "",
      seoCanonicalUrl: ""
    });
    setIsAdding(true);
  };

  const handleEditClick = (article) => {
    setCurrentArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      description: article.description || "",
      content: article.content,
      coverImage: article.coverImage || "",
      category: article.category,
      published: article.published,
      featured: article.featured,
      seoTitle: article.seo?.title || "",
      seoDescription: article.seo?.metaDescription || "",
      seoKeywords: article.seo?.keywords?.join(", ") || "",
      seoOgImage: article.seo?.ogImageUrl || "",
      seoCanonicalUrl: article.seo?.canonicalUrl || ""
    });
    setIsEditing(true);
    fetchVersions(article._id);
  };

  const fetchVersions = async (id) => {
    try {
      const res = await fetch(`/api/news/${id}/versions`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions);
      }
    } catch (err) {
      console.error("Fetch versions error:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      return toast.error("Title, Slug, and Content are required.");
    }

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      content: formData.content,
      coverImage: formData.coverImage,
      category: formData.category,
      published: formData.published,
      featured: formData.featured,
      seo: {
        title: formData.seoTitle,
        metaDescription: formData.seoDescription,
        keywords: formData.seoKeywords ? formData.seoKeywords.split(",").map(x => x.trim()) : [],
        ogImageUrl: formData.seoOgImage,
        canonicalUrl: formData.seoCanonicalUrl
      }
    };

    const actionToast = toast.loading(isAdding ? "Publishing article..." : "Saving article version...");
    try {
      const url = isAdding ? "/api/news" : `/api/news/${currentArticle._id}`;
      const method = isAdding ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: actionToast });
        setIsAdding(false);
        setIsEditing(false);
        setCurrentArticle(null);
        fetchArticles();
      } else {
        toast.error(data.error || "Failed to save article.", { id: actionToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error.", { id: actionToast });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article? This will also wipe its version history!")) return;
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchArticles();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRollback = async (versionNumber) => {
    if (!window.confirm(`Rollback this article to Version ${versionNumber}?`)) return;

    const rollbackToast = toast.loading(`Rolling back to version ${versionNumber}...`);
    try {
      const res = await fetch(`/api/news/${currentArticle._id}/rollback/${versionNumber}`, {
        method: "POST"
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message, { id: rollbackToast });
        handleEditClick(data.article); // Reload fields and version log
        fetchArticles();
      } else {
        toast.error(data.error || "Rollback failed.", { id: rollbackToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Rollback failed.", { id: rollbackToast });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back button or Header */}
      {(isAdding || isEditing) ? (
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setIsAdding(false); setIsEditing(false); setCurrentArticle(null); setShowVersions(false); }}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide">
              {isAdding ? "Create Article" : `Edit Article: ${formData.title}`}
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Fill in content details, translations, and SEO tags.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide">News & Events</h1>
            <p className="text-slate-400 mt-1.5 text-sm">Write articles, document community stories, or announce announcements.</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Article
          </button>
        </div>
      )}

      {/* Editor Screens */}
      {(isAdding || isEditing) ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Fields (col-span-8) */}
          <form onSubmit={handleFormSubmit} className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900/40 p-6 sm:p-8 rounded-[28px] border border-slate-800/80 space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter article title"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="article-url-slug"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Events">Events</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Awareness Campaigns">Awareness Campaigns</option>
                    <option value="Announcements">Announcements</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description / Excerpt</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short summary for list views..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cover Image</label>
                <div className="flex gap-4 items-center bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  {formData.coverImage ? (
                    <img src={formData.coverImage} alt="Cover Preview" className="w-20 h-16 object-cover rounded-lg bg-slate-900 border border-slate-800 shrink-0" />
                  ) : (
                    <div className="w-20 h-16 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center shrink-0 text-slate-500">
                      <Image className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-grow space-y-2">
                    <input
                      type="text"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleInputChange}
                      placeholder="e.g. /uploads/media/... or select from gallery"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMediaSelector(true)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Choose Image
                      </button>
                      {formData.coverImage && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, coverImage: "" }))}
                          className="px-3 py-1.5 bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/20 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Article Body Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={12}
                  placeholder="Write your article markdown or plain text here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                ></textarea>
              </div>

              <div className="flex flex-wrap gap-6 pt-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="published" className="text-sm font-semibold text-slate-300">Publish immediately</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold text-slate-300">Featured Article</label>
                </div>
              </div>

            </div>

            {/* SEO Settings Sub-card */}
            <div className="bg-slate-900/40 p-6 sm:p-8 rounded-[28px] border border-slate-800/80 space-y-5">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" /> Search Engine Optimization (SEO)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SEO Title</label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    placeholder="Optional meta title"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Canonical URL</label>
                  <input
                    type="text"
                    name="seoCanonicalUrl"
                    value={formData.seoCanonicalUrl}
                    onChange={handleInputChange}
                    placeholder="https://adocenter.org/news/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Meta Description</label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Short, keyword-rich SEO summary..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Keywords</label>
                  <input
                    type="text"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleInputChange}
                    placeholder="e.g. mental health, haiti, clinics"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Open Graph Image (OG Image)</label>
                  <input
                    type="text"
                    name="seoOgImage"
                    value={formData.seoOgImage}
                    onChange={handleInputChange}
                    placeholder="e.g. /uploads/media/og_image.webp"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setIsEditing(false); setCurrentArticle(null); setShowVersions(false); }}
                className="flex-grow py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold border border-slate-800 rounded-2xl text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-grow py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-2xl text-sm transition-all"
              >
                Save Article
              </button>
            </div>

          </form>

          {/* Right Column: Version History Sidebar (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            {isEditing && (
              <div className="bg-slate-900/40 rounded-[28px] border border-slate-800/80 p-6 shadow-xl space-y-6">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" /> Version History
                </h3>
                
                {versions.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-sm">No version history logs.</div>
                ) : (
                  <div className="space-y-4">
                    {versions.map((ver) => (
                      <div key={ver._id} className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                          <span>Version {ver.versionNumber}</span>
                          <span className="text-slate-500 font-semibold">{new Date(ver.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Edited by: <span className="font-semibold text-slate-300">{ver.editor?.displayName || ver.editor?.username}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRollback(ver.versionNumber)}
                          className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider"
                        >
                          <Undo2 className="w-3.5 h-3.5" /> Rollback to here
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* List / Table Mode */
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-[28px] p-6 shadow-xl space-y-6">
          {/* Search bar */}
          <div className="relative w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">No articles published. Click 'Add Article' to write your first post.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-500 uppercase font-bold border-b border-slate-800/80">
                  <tr>
                    <th className="pb-3.5 pl-3">Title</th>
                    <th className="pb-3.5">Category</th>
                    <th className="pb-3.5">Views</th>
                    <th className="pb-3.5">Status</th>
                    <th className="pb-3.5">Published Date</th>
                    <th className="pb-3.5 pr-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {articles.map((art) => (
                    <tr key={art._id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 pl-3 font-semibold text-white max-w-sm truncate">{art.title}</td>
                      <td className="py-4 text-slate-400">{art.category}</td>
                      <td className="py-4 text-slate-400 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          art.published 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-slate-800 text-slate-500"
                        }`}>
                          {art.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500">{new Date(art.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 pr-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(art)}
                            className="p-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(art._id)}
                            className="p-2 bg-red-950/20 border border-red-900/35 hover:bg-red-900/40 text-red-400 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
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
        </div>
      )}

      {showMediaSelector && (
        <GallerySelector
          currentUrl={formData.coverImage}
          onSelect={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
          onClose={() => setShowMediaSelector(false)}
        />
      )}
    </div>
  );
}
