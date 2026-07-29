import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import CommunityPrograms from "../pages/CommunityPrograms";
import Training from "../pages/Training";
import Team from "../pages/Team";
import Impact from "../pages/Impact";
import FAQ from "../pages/FAQ";
import Partners from "../pages/Partners";
import Donate from "../pages/Donate";
import DonateSuccess from "../pages/DonateSuccess";
import DonateCancel from "../pages/DonateCancel";
import News from "../pages/News";
import Contact from "../pages/Contact";
import Gallery from "../pages/Gallery";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DashboardHome from "../pages/admin/DashboardHome";
import GalleryManager from "../pages/admin/GalleryManager";
import NewsManager from "../pages/admin/NewsManager";
import PartnersManager from "../pages/admin/PartnersManager";
import DonationsManager from "../pages/admin/DonationsManager";
import MessagesManager from "../pages/admin/MessagesManager";
import LogsManager from "../pages/admin/LogsManager";
import SettingsManager from "../pages/admin/SettingsManager";
import ProfileManager from "../pages/admin/ProfileManager";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/community" element={<CommunityPrograms />} />
      <Route path="/training" element={<Training />} />
      <Route path="/team" element={<Team />} />
      <Route path="/impact" element={<Impact />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/donate/success" element={<DonateSuccess />} />
      <Route path="/donate/cancel" element={<DonateCancel />} />
      <Route path="/news" element={<News />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin Panel Layout & Sub-routes */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="news" element={<NewsManager />} />
        <Route path="partners" element={<PartnersManager />} />
        <Route path="donations" element={<DonationsManager />} />
        <Route path="messages" element={<MessagesManager />} />
        <Route path="logs" element={<LogsManager />} />
        <Route path="settings" element={<SettingsManager />} />
        <Route path="profile" element={<ProfileManager />} />
      </Route>
    </Routes>
  );
};
