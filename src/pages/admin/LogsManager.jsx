import { useState, useEffect } from "react";
import { ShieldAlert, Calendar, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function LogsManager() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(`/api/admin/activities?page=${page}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.activities);
        setTotalPages(data.pages);
      } else {
        toast.error("Failed to load audit logs.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const getActionColor = (action) => {
    switch (action) {
      case "Login Success":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Login Failure":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "Logout":
        return "bg-slate-800 text-slate-400";
      case "Password Change":
      case "Password Reset":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Image Upload":
      case "News Publish":
      case "Partner Create":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Image Delete":
      case "News Delete":
      case "Partner Delete":
        return "bg-red-950/20 border border-red-900/30 text-red-400";
      case "Backup Database":
      case "Restore Database":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
            System Audit Logs
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">Detailed tracking of all administrator activities, edits, backups, and security sessions.</p>
        </div>
        <button
          onClick={() => fetchLogs(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 hover:text-white transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Logs Table Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-[28px] p-6 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-400" /> Activity History
        </h3>

        {logs.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-lg font-bold">No activity logs recorded.</p>
            <p className="text-slate-500 text-xs mt-1">Actions performed by admins will begin showing up here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-500 uppercase font-bold border-b border-slate-800/80">
                <tr>
                  <th className="pb-3.5 pl-3">Admin</th>
                  <th className="pb-3.5">Action</th>
                  <th className="pb-3.5">Details</th>
                  <th className="pb-3.5">IP Address</th>
                  <th className="pb-3.5 pr-3">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 pl-3 font-semibold text-white">
                      {log.admin ? (log.admin.displayName || log.admin.username) : "Anonymous/System"}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 text-slate-300 max-w-sm truncate">{log.details}</td>
                    <td className="py-4 font-mono text-xs text-slate-500">{log.ipAddress || "Unknown"}</td>
                    <td className="py-4 pr-3 text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" /> {new Date(log.createdAt).toLocaleString()}
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

    </div>
  );
}
