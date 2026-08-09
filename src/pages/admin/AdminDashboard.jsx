import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { 
  LayoutDashboard, FileText, Image, Users, Gift, Mail, 
  Database, ShieldAlert, Settings, LogOut, Search, 
  Menu, X, Sun, Moon, FolderOpen, BarChart3, User, ChevronDown
} from "lucide-react";

export default function AdminDashboard() {
  const { admin, loading, logout, verifyAuth } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({
    content: false,
    operations: false,
    analytics: false,
    administration: false
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, loading, navigate]);

  const toggleGroup = (group) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Redirect to search results subpage or pass it to settings/general search
    navigate(`/admin/settings?search=${encodeURIComponent(searchQuery)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!admin) return null;

  const isActive = (path) => location.pathname === path;

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      group: "main"
    },
    {
      title: "Content",
      group: "content",
      children: [
        { title: "News & Events", icon: FileText, path: "/admin/news" },
        { title: "Gallery", icon: Image, path: "/admin/gallery" },
        { title: "Partners & Donors", icon: Users, path: "/admin/partners" }
      ]
    },
    {
      title: "Operations",
      group: "operations",
      children: [
        { title: "Donations", icon: Gift, path: "/admin/donations" },
        { title: "Contact Messages", icon: Mail, path: "/admin/messages" }
      ]
    },
    {
      title: "Analytics",
      group: "analytics",
      children: [
        { title: "Dashboard Stats", icon: BarChart3, path: "/admin/dashboard" },
        { title: "Activity Logs", icon: ShieldAlert, path: "/admin/logs" }
      ]
    },
    {
      title: "Administration",
      group: "administration",
      children: [
        { title: "Profile", icon: User, path: "/admin/profile" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Header Banner */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 h-16 px-4 flex items-center justify-between z-20">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="font-bold text-lg text-white">ADO Admin</span>
        </Link>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed md:sticky top-0 left-0 bottom-0 z-30 w-72 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 transform md:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-20 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center font-bold text-white">A</div>
            <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ADO Portal</span>
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sidebar */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-5 custom-scrollbar">
          {sidebarLinks.map((group, idx) => {
            if (group.group === "main") {
              return (
                <Link
                  key={idx}
                  to={group.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive(group.path) 
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <group.icon className="w-5 h-5" />
                  {group.title}
                </Link>
              );
            }

            const isCollapsed = collapsedGroups[group.group];

            return (
              <div key={idx} className="space-y-1.5">
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-wider text-left"
                >
                  <span>{group.title}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} />
                </button>

                {!isCollapsed && (
                  <div className="space-y-1 pl-2">
                    {group.children.map((child, cIdx) => {
                      const active = isActive(child.path) || (child.path.includes("#") && location.pathname + location.hash === child.path);
                      return (
                        <Link
                          key={cIdx}
                          to={child.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                            active
                              ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                              : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                          }`}
                        >
                          <child.icon className="w-4 h-4" />
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Sidebar (Profile Info & Logout) */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3 px-2 py-3 rounded-2xl mb-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
              {admin.profilePhoto ? (
                <img src={admin.profilePhoto} alt={admin.displayName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate text-slate-200">{admin.displayName}</h4>
              <p className="text-[11px] text-slate-500 uppercase font-bold truncate">{admin.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/35 hover:border-red-800/50 text-red-400 text-sm font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Desktop */}
        <header className="hidden md:flex h-20 border-b border-slate-800/80 px-8 items-center justify-between bg-slate-950/50 sticky top-0 z-20 backdrop-blur-md">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search across CMS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </form>

          {/* Quick Controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-400 font-bold uppercase tracking-wider">
              {admin.role}
            </span>
            <div className="h-8 w-[1px] bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700">
                {admin.profilePhoto ? (
                  <img src={admin.profilePhoto} alt={admin.displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <span className="text-sm font-semibold text-slate-300">{admin.displayName}</span>
            </div>
          </div>
        </header>

        {/* Content View Workspace */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
