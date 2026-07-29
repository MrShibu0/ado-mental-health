import { BrowserRouter, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Router } from "./routes/Router";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { FloatingControls } from "./components/ui/FloatingControls";
import { AdminAuthProvider } from "./context/AdminAuthContext";

function AppContent() {
  const location = useLocation();
  // Check if we are inside the admin portal pages
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar />}
      <div className="flex-grow">
        <Router />
      </div>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <FloatingControls />}
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();

  return (
    <HelmetProvider>
      <Helmet htmlAttributes={{ lang: i18n.language || 'en' }} />
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-center" />
          <AppContent />
        </BrowserRouter>
      </AdminAuthProvider>
    </HelmetProvider>
  );
}

export default App;
