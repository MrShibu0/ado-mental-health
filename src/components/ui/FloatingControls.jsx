import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Phone, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FloatingControls = () => {
  const { t } = useTranslation("common"); // Or just hardcode since it's small
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));

      // Show back to top button after scrolling down 300px
      if (totalScroll > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {/* Scroll Progress Bar at the very top of the window */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#14B8A6] to-[#2563EB]"
          style={{ scaleX: scrollProgress, transformOrigin: "0%" }}
        />
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Back To Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-white text-[#1E3A8A] shadow-lg border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Emergency Contact */}
        <a 
          href="tel:+50930000000" 
          className="w-12 h-12 rounded-full bg-rose-500 text-white shadow-lg flex items-center justify-center hover:bg-rose-600 transition-transform hover:scale-110"
          aria-label="Emergency Contact"
          title="Emergency Contact"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/50930000000" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:bg-[#20bd5a] transition-transform hover:scale-110"
          aria-label="WhatsApp Us"
          title="WhatsApp Us"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>
    </>
  );
};
