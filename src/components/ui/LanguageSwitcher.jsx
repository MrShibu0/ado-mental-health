import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

const languages = [
  { code: "en", label: "English", display: "EN", flag: "🇺🇸" },
  { code: "fr", label: "Français", display: "FR", flag: "🇫🇷" },
  { code: "ht", label: "Kreyòl Ayisyen", display: "HT", flag: "🇭🇹" },
];

export const LanguageSwitcher = ({ isMobile = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((lang) => lang.code === i18n.resolvedLanguage) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isMobile) {
    return (
      <div className="bg-white/40 rounded-2xl p-4 border border-white/50 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-primary font-semibold px-2">
          <Globe className="w-5 h-5" />
          <span>Language</span>
        </div>
        <div className="space-y-1.5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200",
                i18n.resolvedLanguage === lang.code
                  ? "bg-white text-primary shadow-[0_2px_8px_rgba(15,23,42,0.06),_inset_0_1px_1px_rgba(255,255,255,1)]"
                  : "text-slate-600 hover:bg-white/80 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {i18n.resolvedLanguage === lang.code && (
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_rgba(30,58,138,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
        className={cn(
          "flex items-center gap-1.5 h-[44px] px-4 rounded-full text-[14px] font-[600] transition-all duration-300",
          "bg-[rgba(255,255,255,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.5)]",
          "shadow-[0_2px_10px_rgba(15,23,42,0.04),_inset_0_1px_1px_rgba(255,255,255,1)]",
          "text-slate-700 hover:text-primary hover:bg-[rgba(255,255,255,0.9)] hover:shadow-[0_4px_12px_rgba(30,58,138,0.08),_0_0_8px_rgba(37,99,235,0.1),_inset_0_1px_1px_rgba(255,255,255,1)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
      >
        <Globe className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        <span className="flex items-center gap-1.5">
          <span>{currentLang.flag}</span>
          <span className="font-semibold tracking-wide">{currentLang.display}</span>
        </span>
        <ChevronDown
          className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-300", isOpen ? "rotate-180 text-primary" : "")}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute right-0 mt-3 w-52 overflow-hidden z-50 origin-top-right",
              "bg-[rgba(255,255,255,0.85)] backdrop-blur-xl border border-[rgba(255,255,255,0.5)]",
              "rounded-2xl shadow-[0_10px_40px_rgba(15,23,42,0.1),_inset_0_1px_1px_rgba(255,255,255,1)]"
            )}
            role="menu"
          >
            <div className="p-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  role="menuitem"
                  onClick={() => changeLanguage(lang.code)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200",
                    i18n.resolvedLanguage === lang.code
                      ? "bg-primary/5 text-primary font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
                      : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  {i18n.resolvedLanguage === lang.code && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_4px_rgba(30,58,138,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
