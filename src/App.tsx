import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import News from "./pages/News";
import EventNews from "./pages/EventNews";
import Announcements from "./pages/Announcements";
import DownloadPage from "./pages/Download";
import Technical from "./pages/Technical";
import Contact from "./pages/Contact";
import BusinessPartner from "./pages/BusinessPartner";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Account from "./pages/Account";
import GlobalLocations from "./pages/GlobalLocations";
import QualityService from "./pages/QualityService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Only show Navbar on non-admin routes
const AppLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/global" element={<GlobalLocations />} />
        <Route path="/about/service" element={<QualityService />} />
        <Route path="/products" element={<Products />} />
        {/* <Route path="/news" element={<News />} /> */}
        <Route path="/news/event" element={<EventNews />} />
        <Route path="/news/announcements" element={<Announcements />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/technical" element={<Technical />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/business-partner" element={<BusinessPartner />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

