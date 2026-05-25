"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  BookOpen, 
  PlusSquare, 
  Heart, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Recipes", href: "/dashboard/recipes", icon: BookOpen },
  { name: "Add Recipe", href: "/dashboard/recipes/new", icon: PlusSquare },
  { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-full shadow-lg border border-gray-100"
      >
        <Menu className="size-5 text-[#2A120A]" />
      </button>

      {/* Sidebar (Desktop & Mobile) */}
      <AnimatePresence>
        {(isMobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <>
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
              />
            )}

            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 flex flex-col`}
            >
              <div className="p-8 flex items-center justify-between">
                <Link href="/" className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[#F05A00]">
                  ShoofEats.
                </Link>
                {isMobileMenuOpen && (
                  <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden">
                    <X className="size-6 text-gray-500" />
                  </button>
                )}
              </div>

              <div className="px-6 mb-8">
                <div className="flex items-center gap-4 bg-[#F8F4EC] p-4 rounded-2xl border border-[#FFD9B8]/30">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#2A120A]">Luthfi Rafif</p>
                    <p className="text-xs font-semibold text-[#F05A00]">Pro Chef</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</p>
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold ${
                        isActive 
                        ? "bg-[#F05A00] text-white shadow-lg shadow-[#F05A00]/20" 
                        : "text-[#5D4037] hover:bg-[#F8F4EC] hover:text-[#F05A00]"
                      }`}
                    >
                      <link.icon className={`size-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="size-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-8 lg:px-12">
          <div className="hidden md:block">
            <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[#2A120A]">
              Personal Workspace
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            {/* Quick Actions or Notifications can go here */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-500 hidden sm:block">Ready to cook?</span>
              <Link href="/dashboard/recipes/new" className="bg-[#2A120A] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-[#1a0a05] transition-colors flex items-center gap-2">
                <PlusSquare className="size-4" /> New Recipe
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
