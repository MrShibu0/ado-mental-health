import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import logoImg from "../../Images/logo.png";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

const navigationLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "community", href: "/community" },
  { key: "training", href: "/training" },
  { key: "team", href: "/team" },
  { key: "impact", href: "/impact" },
  { key: "gallery", href: "/gallery" },
  { key: "faq", href: "/faq", className: "hidden 2xl:inline-block" },
  { key: "partners", href: "/partners", className: "hidden 2xl:inline-block" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
];

export const Navbar = () => {
  const { t } = useTranslation("navigation");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 transition-all duration-300 pointer-events-none">
      <nav 
        className={cn(
          "mx-auto flex max-w-[1400px] items-center justify-between pointer-events-auto transition-all duration-300 ease-out",
          "bg-[rgba(255,255,255,0.78)] border border-[rgba(255,255,255,0.35)]",
          "rounded-[24px] shadow-[0_4px_12px_rgba(15,23,42,0.06),_0_10px_35px_rgba(15,23,42,0.08),_inset_0_1px_1px_rgba(255,255,255,1)]",
          isScrolled ? "h-[72px] backdrop-blur-[24px] px-4 2xl:px-8 shadow-[0_8px_16px_rgba(15,23,42,0.08),_0_16px_40px_rgba(15,23,42,0.1)]" : "h-[88px] backdrop-blur-[18px] px-4 2xl:px-8"
        )}
        aria-label="Global"
      >
        
        {/* Logo Left */}
        <div className="flex shrink-0 w-auto mr-4">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-white/40 p-1.5 rounded-[18px] shadow-[0_2px_8px_rgba(15,23,42,0.05),_inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:shadow-[0_4px_12px_rgba(15,23,42,0.08),_inset_0_1px_0_rgba(255,255,255,1)]"
            >
              <img src={logoImg} alt="ADO Center Logo" className="h-[3.5rem] w-auto object-contain drop-shadow-sm" />
            </motion.div>
            <span className="font-bold text-[22px] text-[#1E3A8A] hidden sm:block whitespace-nowrap tracking-wide">ADO Center</span>
          </Link>
        </div>
        
        {/* Mobile Hamburger */}
        <div className="flex xl:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-700 bg-white/50 hover:bg-white hover:text-primary transition-colors shadow-sm"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">{t("mobile.open_menu")}</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Navigation Center */}
        <div className="hidden xl:flex xl:gap-x-1 items-center flex-1 justify-center">
          {navigationLinks.map((item) => {
            const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== "/");
            return (
              <Link
                key={item.key}
                to={item.href}
                className={cn(
                  "relative text-[12px] font-[500] transition-all duration-250 hover:-translate-y-[2px] hover:text-[#2563EB] py-1.5 px-2 rounded-full group whitespace-nowrap",
                  isActive ? "text-[#1E3A8A] bg-[#1E3A8A]/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,1)]" : "text-[#1E293B]",
                  item.className
                )}
              >
                {t(`links.${item.key}`)}
                
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator-desktop"
                    className="absolute -bottom-1 left-[15%] right-[15%] h-[2px] bg-[#2563EB] rounded-full shadow-[0_1px_4px_rgba(37,99,235,0.4)]"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                
                {/* Hover Underline */}
                {!isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#2563EB]/40 rounded-full transition-all duration-250 group-hover:w-[70%]"></span>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Donate Button Right */}
        <div className="hidden xl:flex shrink-0 w-auto gap-2 justify-end items-center ml-2">
          <LanguageSwitcher />
          
          <motion.div 
            whileHover={{ scale: 1.04, y: -3 }} 
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Link 
              to="/donate" 
              className={cn(
                "relative flex items-center justify-center rounded-full px-5 2xl:px-7 py-2.5 2xl:py-3 text-[14px] 2xl:text-[15px] font-[600] text-white whitespace-nowrap overflow-hidden group",
                "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB]",
                "shadow-[0_4px_12px_rgba(30,58,138,0.3),_inset_0_1px_1px_rgba(255,255,255,0.3)]",
                "hover:shadow-[0_8px_20px_rgba(30,58,138,0.4),_0_0_15px_rgba(37,99,235,0.4),_inset_0_1px_1px_rgba(255,255,255,0.4)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] transition-all duration-300"
              )}
            >
              {/* Soft inner glow effect */}
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-full"></span>
              <span className="relative z-10">{t("buttons.donate")}</span>
            </Link>
          </motion.div>
        </div>
      </nav>
      
      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-3 right-3 bottom-3 z-[70] w-[calc(100%-24px)] max-w-sm overflow-y-auto bg-[rgba(255,255,255,0.92)] backdrop-blur-3xl border border-white/50 shadow-2xl rounded-[32px] px-6 py-6 xl:hidden flex flex-col pointer-events-auto"
            >
              <div className="flex items-center justify-between h-12">
                <Link to="/" className="flex items-center gap-3 bg-white/50 p-2 rounded-2xl" onClick={() => setMobileMenuOpen(false)}>
                  <img src={logoImg} alt="ADO Center Logo" className="h-10 w-auto object-contain drop-shadow-sm" />
                  <span className="font-bold text-xl text-[#1E3A8A]">ADO Center</span>
                </Link>
                <button
                  type="button"
                  className="rounded-xl p-2.5 text-slate-500 bg-white/60 hover:bg-white hover:text-primary transition-all shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">{t("mobile.close_menu")}</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="mt-8 flex-1 flex flex-col justify-between">
                <div className="space-y-1 py-4">
                  {navigationLinks.map((item) => {
                    const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== "/");
                    return (
                      <Link
                        key={item.key}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block rounded-2xl px-4 py-3.5 text-[16px] font-[500] transition-all duration-200",
                          isActive 
                            ? "text-[#1E3A8A] bg-[#1E3A8A]/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" 
                            : "text-[#1E293B] hover:bg-white/80 hover:text-[#2563EB] hover:shadow-sm"
                        )}
                      >
                        {t(`links.${item.key}`)}
                      </Link>
                    );
                  })}
                </div>
                
                <div className="mt-auto pt-6 space-y-6">
                  <LanguageSwitcher isMobile={true} />
                  <Link to="/donate" onClick={() => setMobileMenuOpen(false)} className="block">
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="w-full rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-6 py-4 text-center text-[16px] font-[600] text-white shadow-[0_8px_16px_rgba(30,58,138,0.25)] hover:shadow-[0_12px_24px_rgba(30,58,138,0.35)] transition-all"
                    >
                      {t("buttons.donate")}
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
