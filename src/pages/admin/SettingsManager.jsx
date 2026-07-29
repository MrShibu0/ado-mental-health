import { useState, useEffect } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { 
  Settings as SettingsIcon, Database, Upload, Download, 
  Loader2, Globe, ShieldAlert, Heart, Building, CheckCircle2 
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsManager() {
  const { admin } = useAdminAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Backup restore states
  const [restoreFile, setRestoreFile] = useState(null);
  const [restoring, setRestoring] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    logo: "",
    address: "",
    phone: "",
    email: "",
    googleMapUrl: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    mission: "",
    vision: "",
    footerText: ""
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setFormData({
          organizationName: data.settings.organizationName || "",
          logo: data.settings.logo || "",
          address: data.settings.address || "",
          phone: data.settings.phone || "",
          email: data.settings.email || "",
          googleMapUrl: data.settings.googleMapUrl || "",
          facebook: data.settings.socialLinks?.facebook || "",
          instagram: data.settings.socialLinks?.instagram || "",
          linkedin: data.settings.socialLinks?.linkedin || "",
          youtube: data.settings.socialLinks?.youtube || "",
          mission: data.settings.mission || "",
          vision: data.settings.vision || "",
          footerText: data.settings.footerText || ""
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    if (admin.role !== "super-admin") {
      return toast.error("Only Super Administrators can update organization settings.");
    }

    setSaving(true);
    const saveToast = toast.loading("Saving settings configurations...");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: saveToast });
        setSettings(data.settings);
      } else {
        toast.error(data.error || "Failed to save settings.", { id: saveToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Save error. Please try again.", { id: saveToast });
    } finally {
      setSaving(false);
    }
  };

  const handleBackupDownload = () => {
    if (admin.role !== "super-admin") {
      return toast.error("Only Super Administrators can trigger backup exports.");
    }
    
    // Redirect to download endpoint directly (triggers browser download dialog)
    window.location.href = "/api/backup/export";
    toast.success("System backup packaging started...");
  };

  const handleRestoreFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setRestoreFile(e.target.files[0]);
    }
  };

  const handleRestoreSubmit = async (e) => {
    e.preventDefault();
    if (!restoreFile) return toast.error("Please choose a backup ZIP file first.");
    if (admin.role !== "super-admin") {
      return toast.error("Only Super Administrators can restore system database state.");
    }

    if (!window.confirm("WARNING: This will completely overwrite all MongoDB collections and uploads folders! Proceed?")) return;

    setRestoring(true);
    const restoreToast = toast.loading("Restoring system uploads and database state...");
    const payload = new FormData();
    payload.append("file", restoreFile);

    try {
      const res = await fetch("/api/backup/restore", {
        method: "POST",
        body: payload
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: restoreToast });
        setRestoreFile(null);
        fetchSettings(); // Refresh settings state
      } else {
        toast.error(data.error || "Failed to restore backup.", { id: restoreToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Restore error. Please verify ZIP integrity.", { id: restoreToast });
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const isSuperAdmin = admin.role === "super-admin";

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
          Portal Settings
        </h1>
        <p className="text-slate-400 mt-1.5 text-sm">Configure organization details, social links, and perform complete system backups.</p>
      </div>

      {/* Main Grid: Form Left, Tools Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Settings Form (col-span-8) */}
        <form onSubmit={handleSettingsSubmit} className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/40 p-6 sm:p-8 border border-slate-800/80 rounded-[28px] shadow-xl space-y-5">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Building className="w-5 h-5 text-blue-400" /> Center Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                  disabled={!isSuperAdmin}
                  className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Logo Path / URL</label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  disabled={!isSuperAdmin}
                  placeholder="/uploads/media/logo.webp"
                  className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isSuperAdmin}
                  className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isSuperAdmin}
                  className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Physical Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isSuperAdmin}
                className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Google Map URL</label>
              <input
                type="text"
                name="googleMapUrl"
                value={formData.googleMapUrl}
                onChange={handleInputChange}
                disabled={!isSuperAdmin}
                placeholder="Google Map iframe embed source URL"
                className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>

          </div>

          {/* Socials & Missions */}
          <div className="bg-slate-900/40 p-6 sm:p-8 border border-slate-800/80 rounded-[28px] shadow-xl space-y-5">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Heart className="w-5 h-5 text-teal-400" /> Mission, Vision & Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Facebook</label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  disabled={!isSuperAdmin}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  disabled={!isSuperAdmin}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  disabled={!isSuperAdmin}
                  placeholder="https://linkedin.com/..."
                  className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">YouTube</label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleInputChange}
                  disabled={!isSuperAdmin}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mission Statement</label>
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleInputChange}
                disabled={!isSuperAdmin}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vision Statement</label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                disabled={!isSuperAdmin}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Footer Copyright Text</label>
              <input
                type="text"
                name="footerText"
                value={formData.footerText}
                onChange={handleInputChange}
                disabled={!isSuperAdmin}
                className="w-full bg-slate-950 border border-slate-800 disabled:opacity-50 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>

          </div>

          {/* Submit Settings */}
          {isSuperAdmin && (
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold tracking-wide hover:shadow-[0_8px_25px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Settings Configuration"}
            </button>
          )}
        </form>

        {/* Backup / Restore Panel (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 rounded-[28px] border border-slate-800/80 p-6 shadow-xl space-y-6">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Database className="w-5 h-5 text-purple-400" /> Backup & Recovery
            </h3>

            {isSuperAdmin ? (
              <div className="space-y-6 text-left">
                {/* Export ZIP */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-200">Export Backup Archive</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Downloads a compressed `.zip` containing all Mongoose database models and raw uploads directory assets.
                  </p>
                  <button
                    type="button"
                    onClick={handleBackupDownload}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-950 hover:bg-slate-850 text-purple-400 font-bold border border-purple-500/20 rounded-xl text-sm transition-all"
                  >
                    <Download className="w-4 h-4" /> Download Backup ZIP
                  </button>
                </div>

                <hr className="border-slate-800/80" />

                {/* Import ZIP */}
                <form onSubmit={handleRestoreSubmit} className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-200">Import/Restore Backup</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload an exported ADO Center `.zip` file to overwrite the site data. WARNING: Wipes current data!
                  </p>
                  
                  <div className="relative border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center cursor-pointer">
                    <input
                      type="file"
                      accept=".zip"
                      onChange={handleRestoreFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-xs text-slate-400 truncate block">
                      {restoreFile ? restoreFile.name : "Choose ZIP file"}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={restoring || !restoreFile}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/20 hover:bg-red-950/40 text-red-400 font-bold border border-red-900/35 hover:border-red-800/50 rounded-xl text-sm transition-all disabled:opacity-40"
                  >
                    {restoring ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Restoring...</>
                    ) : (
                      <>Restore ZIP Archive</>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex gap-3 bg-red-950/20 border border-red-900/35 p-4 rounded-2xl text-xs text-red-400 leading-relaxed items-start">
                <ShieldAlert className="w-8 h-8 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-1">Access Restrained</h4>
                  <p>Database backup and restore tools are restricted to **Super Administrators** only.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
