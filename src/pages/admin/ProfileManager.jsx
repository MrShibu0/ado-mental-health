import { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { User, Lock, Languages, Palette, Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfileManager() {
  const { admin, updateAdminState } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    displayName: admin?.displayName || "",
    username: admin?.username || "",
    password: "",
    confirmPassword: "",
    preferredLanguage: admin?.preferredLanguage || "en",
    theme: admin?.theme || "light",
    profilePhoto: admin?.profilePhoto || ""
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setSubmitting(true);
    const saveToast = toast.loading("Updating profile details...");

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: formData.displayName,
          username: formData.username,
          password: formData.password || undefined,
          preferredLanguage: formData.preferredLanguage,
          theme: formData.theme,
          profilePhoto: formData.profilePhoto
        })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: saveToast });
        // Update global auth context state
        updateAdminState(data.admin);
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        toast.error(data.error || "Failed to update profile.", { id: saveToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Profile update error.", { id: saveToast });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-wide">My Profile</h1>
        <p className="text-slate-400 mt-1.5 text-sm">Update your display settings, security credentials, and preferred UI language.</p>
      </div>

      {/* Main Profile Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Form (col-span-8) */}
        <form onSubmit={handleProfileSubmit} className="lg:col-span-8 bg-slate-900/40 p-6 sm:p-8 border border-slate-800/80 rounded-[28px] shadow-xl space-y-6">
          
          {/* Display & Login details */}
          <div className="space-y-5">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <User className="w-5 h-5 text-blue-400" /> Display Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter display name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter login username"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Profile Photo Path / URL</label>
              <input
                type="text"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleInputChange}
                placeholder="e.g. /uploads/media/profile.webp"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1 font-semibold">Copy path directly from your Media Library settings.</p>
            </div>
          </div>

          {/* Password Settings */}
          <div className="space-y-5 pt-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Lock className="w-5 h-5 text-amber-400" /> Security Credentials
            </h3>
            <p className="text-xs text-slate-500">Leave password fields blank if you do not wish to change your current login password.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-5 pt-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Palette className="w-5 h-5 text-purple-400" /> Language & Interface
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preferred Language</label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="ht">Haitian Creole</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interface Theme</label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white cursor-pointer"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold tracking-wide hover:shadow-[0_8px_25px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {submitting ? "Saving Changes..." : "Save Profile Details"}
          </button>

        </form>

        {/* Profile Card Preview (col-span-4) */}
        <div className="lg:col-span-4 bg-slate-900/40 rounded-[28px] border border-slate-800/80 p-6 shadow-xl flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-blue-500 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/10">
            {formData.profilePhoto ? (
              <img src={formData.profilePhoto} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-slate-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{formData.displayName || "Admin User"}</h3>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">{admin?.role}</p>
          </div>
          <div className="w-full border-t border-slate-800/80 pt-4 flex flex-col space-y-2 text-left text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Username:</span>
              <span className="font-semibold text-slate-200">{formData.username}</span>
            </div>
            <div className="flex justify-between">
              <span>System Role:</span>
              <span className="font-bold text-blue-400 capitalize">{admin?.role}</span>
            </div>
            <div className="flex justify-between">
              <span>UI Language:</span>
              <span className="font-semibold text-slate-200 capitalize">{formData.preferredLanguage === 'en' ? 'English' : formData.preferredLanguage === 'fr' ? 'French' : 'Haitian'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
