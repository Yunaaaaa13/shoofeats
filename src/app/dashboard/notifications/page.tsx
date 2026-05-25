"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Heart, UserPlus, Bookmark, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const syneFont = "font-[family-name:var(--font-syne)]";

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return `${Math.floor(diffSeconds / 86400)}d ago`;
}

const notifIcon = (type: string) => {
  switch (type) {
    case "like": return <Heart className="size-5 text-red-500 fill-red-500" />;
    case "follow": return <UserPlus className="size-5 text-blue-500" />;
    case "save": return <Bookmark className="size-5 text-purple-500 fill-purple-500" />;
    default: return <Bell className="size-5 text-orange-500" />;
  }
};

const notifLabel = (notif: any) => {
  const actor = notif.actor?.full_name || notif.actor?.username || "Someone";
  switch (notif.type) {
    case "like": return `${actor} liked your recipe "${notif.recipe?.title || ""}"`;
    case "follow": return `${actor} started following you`;
    case "save": return `${actor} saved your recipe "${notif.recipe?.title || ""}"`;
    default: return `New notification`;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotifs = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("notifications")
        .select(`*, actor:actor_id ( full_name, username, avatar_url ), recipe:recipe_id ( title, img )`)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      setNotifications(data || []);
      setIsLoading(false);

      // Mark all as read
      await supabase.from("notifications").update({ read: true }).eq("user_id", session.user.id);
    };
    fetchNotifs();
  }, []);

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] mb-1`}>Notifications</h2>
          <p className="text-gray-500 font-medium">Stay updated on your social activity.</p>
        </div>
        {unread.length > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {unread.length} new
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center">
          <Bell className="size-12 mx-auto mb-4 text-gray-300" />
          <h3 className={`${syneFont} text-xl font-bold text-[#2A120A] mb-2`}>No notifications yet</h3>
          <p className="text-gray-500">When someone follows you or interacts with your recipes, you'll see it here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${!notif.read ? "bg-[#FFFAF6] border-[#F05A00]/20" : "bg-white border-gray-100"}`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={notif.actor?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=x`}
                  className="w-12 h-12 rounded-full object-cover bg-white border-2 border-white shadow-sm"
                  alt=""
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  {notifIcon(notif.type)}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium">{notifLabel(notif)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notif.created_at)}</p>
              </div>
              {notif.recipe?.img && (
                <img src={notif.recipe.img} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" alt="" />
              )}
              {notif.read && <Check className="size-4 text-green-400 flex-shrink-0" />}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
