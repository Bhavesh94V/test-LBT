import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // agar route /admin se start ho raha hai
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}

      <main className={`flex-1 ${!isAdminRoute ? "pt-24 md:pt-28" : ""}`}>
        {children}
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default Layout;
