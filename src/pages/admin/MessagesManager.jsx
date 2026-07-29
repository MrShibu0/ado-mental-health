import { useState, useEffect } from "react";
import { 
  Mail, MailOpen, Trash2, Reply, Send, Loader2, 
  Inbox, CheckCircle2, User, Phone, Calendar, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // Reply form states
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/api/contact/messages?status=${statusFilter}` : "/api/contact/messages";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setUnreadCount(data.unreadCount);
        
        // Retain selection if still in list, or clear
        if (selectedMsg) {
          const stillExists = data.messages.find(m => m._id === selectedMsg._id);
          if (stillExists) setSelectedMsg(stillExists);
          else setSelectedMsg(null);
        }
      } else {
        toast.error("Failed to load messages.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleMessageSelect = async (msg) => {
    setSelectedMsg(msg);
    setReplyText("");
    
    // Auto-mark as read if unread
    if (msg.status === "unread") {
      try {
        const res = await fetch(`/api/contact/messages/${msg._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" })
        });
        if (res.ok) {
          // Update local unread counter and status
          setUnreadCount(prev => Math.max(prev - 1, 0));
          setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, status: "read" } : m));
          setSelectedMsg(prev => ({ ...prev, status: "read" }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (msg, targetStatus) => {
    try {
      const res = await fetch(`/api/contact/messages/${msg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) {
        toast.success(`Message marked as ${targetStatus}.`);
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    try {
      const res = await fetch(`/api/contact/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted successfully.");
        setSelectedMsg(null);
        fetchMessages();
      } else {
        toast.error("Failed to delete message.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    const replyToast = toast.loading("Recording and sending reply...");
    try {
      const res = await fetch(`/api/contact/messages/${selectedMsg._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: replyToast });
        setReplyText("");
        fetchMessages();
      } else {
        toast.error(data.error || "Failed to record reply.", { id: replyToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Reply error.", { id: replyToast });
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
            Messages Inbox {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">{unreadCount} unread</span>}
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">Review center inquiries, emergency reports, or follow-up feedback.</p>
        </div>
        
        {/* Inbox status filter */}
        <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl">
          <button 
            onClick={() => setStatusFilter("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === "" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            All
          </button>
          <button 
            onClick={() => setStatusFilter("unread")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === "unread" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Unread
          </button>
          <button 
            onClick={() => setStatusFilter("read")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === "read" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Read
          </button>
          <button 
            onClick={() => setStatusFilter("replied")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === "replied" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Replied
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[500px]">
        
        {/* Left Column: Messages List (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-900/40 rounded-[28px] border border-slate-800/80 overflow-hidden flex flex-col max-h-[600px] shadow-xl">
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 font-bold text-xs uppercase tracking-wider text-slate-500 flex justify-between">
            <span>Inbox Inquiries</span>
            <span>{messages.length} messages</span>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm">No messages match selected status.</div>
          ) : (
            <div className="overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
              {messages.map((msg) => {
                const isSelected = selectedMsg?._id === msg._id;
                return (
                  <div
                    key={msg._id}
                    onClick={() => handleMessageSelect(msg)}
                    className={`p-4 text-left cursor-pointer transition-all flex gap-3.5 relative ${
                      isSelected 
                        ? "bg-blue-600/10 border-l-4 border-blue-500" 
                        : "hover:bg-slate-800/20 border-l-4 border-transparent"
                    }`}
                  >
                    {/* Unread dot indicator */}
                    {msg.status === "unread" && (
                      <span className="absolute top-5 left-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white truncate">{msg.name}</h4>
                        <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h5 className={`text-xs truncate ${msg.status === 'unread' ? 'text-slate-200 font-semibold' : 'text-slate-400'}`}>
                        {msg.subject || "No Subject"}
                      </h5>
                      <p className="text-xs text-slate-500 line-clamp-1 truncate">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Message Details Viewer (col-span-7) */}
        <div className="lg:col-span-7 bg-slate-900/40 rounded-[28px] border border-slate-800/80 p-6 sm:p-8 shadow-xl min-h-[500px] flex flex-col justify-between">
          
          {selectedMsg ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Info Header */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700/60">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{selectedMsg.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{selectedMsg.email}</p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(selectedMsg, selectedMsg.status === "read" ? "unread" : "read")}
                      className="flex items-center gap-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300"
                    >
                      {selectedMsg.status === "unread" ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                      Mark {selectedMsg.status === "unread" ? "Read" : "Unread"}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMsg._id)}
                      className="p-2 bg-red-950/20 border border-red-900/35 hover:bg-red-900/40 text-red-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub & Message Body */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {selectedMsg.phone && (
                      <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-600" /> {selectedMsg.phone}</span>
                    )}
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-600" /> {new Date(selectedMsg.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="p-4 bg-slate-950/30 border border-slate-800 rounded-2xl">
                    <h4 className="font-bold text-white text-md mb-2">{selectedMsg.subject || "No Subject"}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedMsg.message}</p>
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              <div className="mt-8 border-t border-slate-800/80 pt-6">
                {selectedMsg.status === "replied" ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" /> Reply has already been recorded for this message
                  </div>
                ) : (
                  <form onSubmit={handleReplySubmit} className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Reply className="w-4 h-4 text-blue-400" /> Write Reply Details
                    </label>
                    <div className="relative">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type reply email details here..."
                        required
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500"
                      ></textarea>
                      <button
                        type="submit"
                        disabled={submittingReply || !replyText.trim()}
                        className="absolute bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg disabled:opacity-50"
                      >
                        <Send className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-center items-center text-slate-500 text-center">
              <Inbox className="w-16 h-16 text-slate-700 mb-3" />
              <p className="text-lg font-bold">No message selected.</p>
              <p className="text-xs text-slate-500 mt-1">Select a contact message from the inbox list to read details.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
