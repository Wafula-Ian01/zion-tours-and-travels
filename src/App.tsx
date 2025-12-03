import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WhatsAppFAB } from "./components/WhatsAppFAB";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import SafariCategory from "./pages/SafariCategory";
import PackageDetail from "./pages/PackageDetail";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import CMS from "./pages/CMS";
import ManagePackages from "./pages/cms/ManagePackages";
import ManageCategories from "./pages/cms/ManageCategories";
import ManageArticles from "./pages/cms/ManageArticles";
import ManageGallery from "./pages/cms/ManageGallery";
import ManageFAQs from "./pages/cms/ManageFAQs";
import ManagePartners from "./pages/cms/ManagePartners";
import ManageCreditations from "./pages/cms/ManageCreditations";
import ManageAbout from "./pages/cms/ManageAbout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/safaris/:category" element={<SafariCategory />} />
          <Route path="/package/:id" element={<PackageDetail />} />
          <Route path="/blog/articles" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/blog/gallery" element={<Gallery />} />
          <Route path="/blog/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cms" element={<ProtectedRoute><CMS /></ProtectedRoute>} />
          <Route path="/cms/packages" element={<ProtectedRoute><ManagePackages /></ProtectedRoute>} />
          <Route path="/cms/categories" element={<ProtectedRoute><ManageCategories /></ProtectedRoute>} />
          <Route path="/cms/articles" element={<ProtectedRoute><ManageArticles /></ProtectedRoute>} />
          <Route path="/cms/gallery" element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
          <Route path="/cms/faqs" element={<ProtectedRoute><ManageFAQs /></ProtectedRoute>} />
          <Route path="/cms/partners" element={<ProtectedRoute><ManagePartners /></ProtectedRoute>} />
          <Route path="/cms/creditations" element={<ProtectedRoute><ManageCreditations /></ProtectedRoute>} />
          <Route path="/cms/about" element={<ProtectedRoute><ManageAbout /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <WhatsAppFAB />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
