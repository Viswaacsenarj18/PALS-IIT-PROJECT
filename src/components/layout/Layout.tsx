import { ReactNode } from "react";
import Navbar from "./Navbar";
import FloatingChat from "@/components/FloatingChat";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
  <div className="min-h-screen bg-background pt-0 sm:pt-2 md:pt-4 relative">


      {/* NAVBAR — renders ONCE here. Never import <Navbar /> inside any page component */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="animate-fade-in">
        {children}
      </main>

      {/* ONLY ONE CHATBOT */}
      <FloatingChat />

    </div>
  );
};

export default Layout;