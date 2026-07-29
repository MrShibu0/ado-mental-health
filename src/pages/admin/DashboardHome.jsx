import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, Eye, Image, FileText, Gift, Mail, 
  Database, RefreshCw, ChevronRight, Inbox, Clock
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/analytics/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        toast.error("Failed to load dashboard statistics.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not retrieve statistics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Visitors Today",
      value: stats?.visitorsToday || 0,
      icon: Users,
      color: "from-blue-600/20 to-blue-500/5",
      iconColor: "text-blue-400"
    },
    {
      title: "Gallery Views",
      value: stats?.galleryViews || 0,
      icon: Eye,
      color: "from-teal-600/20 to-teal-500/5",
      iconColor: "text-teal-400"
    },
    {
      title: "News Views",
      value: stats?.newsViews || 0,
      icon: FileText,
      color: "from-purple-600/20 to-purple-500/5",
      iconColor: "text-purple-400"
    },
    {
      title: "Donations",
      value: `$${(stats?.totalDonations || 0).toLocaleString()}`,
      icon: Gift,
      color: "from-emerald-600/20 to-emerald-500/5",
      iconColor: "text-emerald-400"
    },
    {
      title: "Pending Replies",
      value: stats?.pendingReplies || 0,
      icon: Inbox,
      color: "from-amber-600/20 to-amber-500/5",
      iconColor: "text-amber-400"
    },
    {
      title: "Storage Space",
      value: `${stats?.storageMB || "0.00"} MB`,
      icon: Database,
      color: "from-slate-600/20 to-slate-500/5",
      iconColor: "text-slate-400"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1.5 text-sm">Real-time statistics and overview of center activities.</p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 hover:text-white hover:border-slate-700 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div 
            key={idx} 
            className={`p-6 rounded-[24px] bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/60 transition-all flex items-center justify-between group shadow-lg`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.title}</span>
              <h3 className="text-3xl font-black text-white">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center border border-white/[0.03]`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Messages & Donations */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recent Messages */}
          <div className="bg-slate-900/40 rounded-[28px] border border-slate-800/80 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" /> Recent Contact Messages
              </h3>
              <Link to="/admin/messages" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            
            {stats?.recentMessages?.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">No recent messages.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-500 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Subject</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stats?.recentMessages?.map((msg) => (
                      <tr key={msg._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3.5 font-medium text-white">{msg.name}</td>
                        <td className="py-3.5 max-w-xs truncate">{msg.subject || "No Subject"}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            msg.status === "unread" 
                              ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                              : msg.status === "read" 
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" 
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {msg.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Donations */}
          <div className="bg-slate-900/40 rounded-[28px] border border-slate-800/80 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-400" /> Recent Donations
              </h3>
              <Link to="/admin/donations" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {stats?.recentDonations?.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">No recent transactions.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-500 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="pb-3 font-semibold">Donor</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stats?.recentDonations?.map((don) => (
                      <tr key={don._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3.5 font-medium text-white">{don.donorName}</td>
                        <td className="py-3.5 text-slate-400">{don.email}</td>
                        <td className="py-3.5 font-extrabold text-emerald-400">${don.amount}.00</td>
                        <td className="py-3.5 text-slate-500">{new Date(don.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Storage Visual & Recent Uploads */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Recent Uploads Grid */}
          <div className="bg-slate-900/40 rounded-[28px] border border-slate-800/80 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Image className="w-5 h-5 text-teal-400" /> Recent Uploads
              </h3>
              <Link to="/admin/gallery" className="text-xs text-teal-400 hover:underline flex items-center gap-1">
                Gallery <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {stats?.recentUploads?.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">No uploads yet.</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {stats?.recentUploads?.map((item) => (
                  <div key={item._id} className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-800 border border-slate-700/60">
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-teal-400 uppercase">{item.category}</span>
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Storage Visualizer */}
          <div className="bg-slate-900/40 rounded-[28px] border border-slate-800/80 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Database className="w-5 h-5 text-slate-400" /> Storage Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Disk space consumed:</span>
                <span className="font-bold text-white">{stats?.storageMB || "0.00"} MB</span>
              </div>
              
              {/* Visual Progress Bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                {/* Assume 500MB max local storage dummy limit for visual */}
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full" 
                  style={{ width: `${Math.min((parseFloat(stats?.storageMB || 0) / 500) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <span>0 MB</span>
                <span>Visual limit: 500 MB</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
