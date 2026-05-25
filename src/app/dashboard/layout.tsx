"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  BookOpen, 
  PlusSquare, 
  Bookmark,
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  UserCheck,
  Activity,
  Bell,
  Compass
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Recipes", href: "/dashboard/recipes", icon: BookOpen },
  { name: "Add Recipe", href: "/dashboard/recipes/new", icon: PlusSquare },
  { name: "Saved", href: "/dashboard/favorites", icon: Bookmark },
  { name: "Following", href: "/dashboard/following", icon: UserCheck },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(data);
      // Fetch unread notifications
      const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", session.user.id).eq("read", false);
      setUnreadCount(count || 0);
    };
    fetchProfile();
  }, []);

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

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <>
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
              className="fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 flex flex-col"
            >
              {/* Logo */}
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

              {/* User Info */}
              <div className="px-6 mb-6">
                <Link href="/dashboard/profile" className="flex items-center gap-4 bg-[#F8F4EC] p-4 rounded-2xl border border-[#FFD9B8]/30 hover:bg-[#F0E8D8] transition-colors">
                  <img 
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=fallback`}
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-white"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-[#2A120A] truncate">{profile?.full_name || profile?.username || "Chef"}</p>
                    <p className="text-xs font-semibold text-[#F05A00]">@{profile?.username || "user"}</p>
                  </div>
                </Link>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</p>
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const isNotifications = link.name === "Notifications";
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
                      <span className="flex-1">{link.name}</span>
                      {isNotifications && unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Discover</p>
                  <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold ${pathname === '/explore' ? "bg-[#F05A00] text-white shadow-lg" : "text-[#5D4037] hover:bg-[#F8F4EC] hover:text-[#F05A00]"}`}>
                    <Compass className={`size-5 ${pathname === '/explore' ? "text-white" : "text-gray-400"}`} />
                    Explore
                  </Link>
                  <Link href="/dashboard/notifications" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold ${pathname === '/dashboard/notifications' ? "bg-[#F05A00] text-white shadow-lg" : "text-[#5D4037] hover:bg-[#F8F4EC] hover:text-[#F05A00]"}`}>
                    <Bell className={`size-5 ${pathname === '/dashboard/notifications' ? "text-white" : "text-gray-400"}`} />
                    <span className="flex-1">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>

              {/* Logout */}
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

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between pl-16 pr-4 md:px-8 lg:px-12">
          <div className="hidden md:block">
            <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[#2A120A]">
              Personal Workspace
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-4">
              <Link href="/explore" className="text-sm font-semibold text-gray-500 hidden sm:flex items-center gap-2 hover:text-[#F05A00] transition-colors">
                <Compass className="size-4" /> Explore
              </Link>
              <Link href="/dashboard/recipes/new" className="bg-[#2A120A] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-[#1a0a05] transition-colors flex items-center gap-2">
                <PlusSquare className="size-4" /> New Recipe
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-12 pb-24">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
