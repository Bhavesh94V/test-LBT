import React from "react"
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ShortlistProvider } from "@/contexts/ShortlistContext";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import HowItWorks from "@/pages/HowItWorks";
import AboutUs from "@/pages/AboutUs";
import ContactUs from "@/pages/ContactUs";
import FAQs from "@/pages/FAQs";
import Blogs from "@/pages/Blogs";
import CorporateBuying from "@/pages/CorporateBuying";
import YourGroups from "@/pages/YourGroups";
import YourPayments from "@/pages/YourPayments";
import Dashboard from "@/pages/Dashboard";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Sitemap from "@/pages/Sitemap";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "./ScrollToTop";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProperties from "@/pages/admin/AdminProperties";
import AdminGroups from "@/pages/admin/AdminGroups";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminAdminUsers from "@/pages/admin/AdminAdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminPayments from "@/pages/admin/AdminPayments";

const queryClient = new QueryClient();

// Wrapper component for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ShortlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes with Layout */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/properties" element={<Layout><Properties /></Layout>} />
              <Route path="/properties/:id" element={<Layout><PropertyDetail /></Layout>} />
              <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
              <Route path="/about" element={<Layout><AboutUs /></Layout>} />
              <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
              <Route path="/faqs" element={<Layout><FAQs /></Layout>} />
              <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
              <Route path="/corporate-buying" element={<Layout><CorporateBuying /></Layout>} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/your-groups" element={<Layout><YourGroups /></Layout>} />
              <Route path="/your-payments" element={<Layout><YourPayments /></Layout>} />
              <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
              <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
              <Route path="/sitemap" element={<Layout><Sitemap /></Layout>} />

              {/* Admin Routes with AdminLayout (includes auth gate) */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/properties" element={<AdminRoute><AdminProperties /></AdminRoute>} />
              <Route path="/admin/groups" element={<AdminRoute><AdminGroups /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />
              <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
              <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
              <Route path="/admin/admin-users" element={<AdminRoute><AdminAdminUsers /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ShortlistProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
