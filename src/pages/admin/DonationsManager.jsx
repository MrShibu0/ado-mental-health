import { useState, useEffect } from "react";
import { 
  Gift, DollarSign, Calendar, Mail, Loader2, 
  ArrowUpRight, AlertCircle, RefreshCw 
} from "lucide-react";
import toast from "react-hot-toast";

export default function DonationsManager() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      // 1. Fetch completed donations list (paginated)
      const listRes = await fetch(`/api/donations?page=${page}&limit=15`);
      if (listRes.ok) {
        const listData = await listRes.json();
        setDonations(listData.donations);
        setTotalPages(listData.pages);
      }

      // 2. Fetch stats
      const statsRes = await fetch("/api/donations/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load donations history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Donations</h1>
          <p className="text-slate-400 mt-1.5 text-sm">Monitor center donations, Stripe checkout receipts, and monthly metrics.</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 hover:text-white transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Summary widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-[24px] shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Donations</span>
            <h3 className="text-3xl font-black text-white">${(stats?.totalDonations || 0).toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/25 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-[24px] shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giving This Month</span>
            <h3 className="text-3xl font-black text-white">${(stats?.monthlyDonations || 0).toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-600/25 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-[24px] shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Completed Transactions</span>
            <h3 className="text-3xl font-black text-white">{stats?.totalCount || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-600/25 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Gift className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Transactions Table List */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-[28px] p-6 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5 text-emerald-400" /> Completed Transactions
        </h3>

        {donations.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-lg font-bold">No completed donations logged.</p>
            <p className="text-slate-500 text-xs mt-1">Pending payments waiting to execute webhook successfully.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-500 uppercase font-bold border-b border-slate-800/80">
                <tr>
                  <th className="pb-3.5 pl-3">Donor Name</th>
                  <th className="pb-3.5">Email</th>
                  <th className="pb-3.5">Amount</th>
                  <th className="pb-3.5">Transaction ID</th>
                  <th className="pb-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {donations.map((don) => (
                  <tr key={don._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 pl-3 font-semibold text-white">{don.donorName}</td>
                    <td className="py-4 text-slate-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" /> {don.email}
                    </td>
                    <td className="py-4 font-extrabold text-emerald-400">
                      ${don.amount}.00 {don.currency}
                    </td>
                    <td className="py-4 font-mono text-xs text-slate-500">{don.transactionId}</td>
                    <td className="py-4 text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" /> {new Date(don.date).toLocaleDateString()}
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
