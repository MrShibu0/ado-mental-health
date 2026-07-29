import { useState, useEffect } from "react";
import { 
  Plus, Search, Edit2, Trash2, Globe, Star, Loader2, AlertCircle 
} from "lucide-react";
import toast from "react-hot-toast";

export default function PartnersManager() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
    category: "Partner",
    description: "",
    featured: false
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/partners");
      if (res.ok) {
        const data = await res.json();
        setPartners(data.partners);
      } else {
        toast.error("Failed to load partners.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddClick = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      logo: "",
      website: "",
      category: "Partner",
      description: "",
      featured: false
    });
    setShowModal(true);
  };

  const handleEditClick = (partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logo: partner.logo,
      website: partner.website || "",
      category: partner.category,
      description: partner.description || "",
      featured: partner.featured
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.logo) {
      return toast.error("Name and Logo path are required.");
    }

    const actionToast = toast.loading(editingPartner ? "Saving updates..." : "Creating partner record...");
    try {
      const url = editingPartner ? `/api/partners/${editingPartner._id}` : "/api/partners";
      const method = editingPartner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: actionToast });
        setShowModal(false);
        fetchPartners();
      } else {
        toast.error(data.error || "Failed to save partner record.", { id: actionToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error.", { id: actionToast });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete partner organization "${name}"?`)) return;
    try {
      const res = await fetch(`/api/partners/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchPartners();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (partner) => {
    try {
      const res = await fetch(`/api/partners/${partner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !partner.featured })
      });
      if (res.ok) {
        toast.success(partner.featured ? "Removed from Featured" : "Marked as Featured");
        fetchPartners();
      } else {
        toast.error("Failed to toggle featured status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Partners & Donors</h1>
          <p className="text-slate-400 mt-1.5 text-sm">Manage organizations that sponsor or partner with the mental health center.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {/* Main Table List */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-[28px] p-6 shadow-xl space-y-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-lg font-bold">No partners configured.</p>
            <p className="text-slate-500 text-xs mt-1">Click 'Add Partner' to add sponsors or supporters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-500 uppercase font-bold border-b border-slate-800/80">
                <tr>
                  <th className="pb-3.5 pl-3">Logo</th>
                  <th className="pb-3.5">Name</th>
                  <th className="pb-3.5">Category</th>
                  <th className="pb-3.5">Featured</th>
                  <th className="pb-3.5">Website</th>
                  <th className="pb-3.5 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {partners.map((partner) => (
                  <tr key={partner._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 pl-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 p-1.5 flex items-center justify-center overflow-hidden">
                        <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-white">{partner.name}</td>
                    <td className="py-4 text-slate-400">
                      <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300">
                        {partner.category}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleToggleFeatured(partner)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          partner.featured 
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                            : "bg-slate-850 border-slate-800 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-4 text-slate-400">
                      {partner.website ? (
                        <a 
                          href={partner.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 text-blue-400 hover:underline text-xs"
                        >
                          <Globe className="w-3.5 h-3.5" /> Visit site
                        </a>
                      ) : (
                        <span className="text-slate-650">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(partner)}
                          className="p-2 bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white rounded-lg border border-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(partner._id, partner.name)}
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
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingPartner ? "Edit Partner Details" : "Create Partner Record"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Partner Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Hope Foundation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Logo Path / URL</label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. /uploads/media/2026/July/logo.webp"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://partner-website.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white cursor-pointer"
                  >
                    <option value="Sponsor">Sponsor</option>
                    <option value="Partner">Partner</option>
                    <option value="Supporter">Supporter</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end pb-1.5">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="feat"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="feat" className="text-sm font-semibold text-slate-300 cursor-pointer select-none">Featured</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Enter a brief note about relationship..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-grow py-3.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl text-sm"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
