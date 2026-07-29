import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export const Newsletter = () => {
  const { t } = useTranslation("home");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    
    // Mock API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }, 1000);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] rounded-[2.5rem] p-10 md:p-16 text-center shadow-[0_20px_50px_rgba(37,99,235,0.2)] relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#14B8A6]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("newsletter.title")}
            </h2>
            
            <p className="text-blue-100 text-lg mb-10 max-w-lg mx-auto">
              {t("newsletter.text")}
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  required
                  disabled={status !== "idle"}
                  className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className="px-8 py-4 rounded-full bg-white text-[#1E3A8A] font-bold hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                  {status === "loading" ? (
                    <div className="w-5 h-5 border-2 border-[#1E3A8A] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    t("newsletter.button")
                  )}
                </button>
              </div>
              
              {/* Success Message Animation */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-2 text-[#14B8A6] font-medium"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {t("newsletter.success")}
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
