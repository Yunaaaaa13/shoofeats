"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, UserPlus, Bookmark, ChefHat, Activity } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const syneFont = "font-[family-name:var(--font-syne)]";

const activityIcon = (type: string) => {
  switch (type) {
    case "like": return <Heart className="size-4 text-red-500 fill-red-500" />;
    case "follow": return <UserPlus className="size-4 text-blue-500" />;
    case "save": return <Bookmark className="size-4 text-purple-500 fill-purple-500" />;
    default: return <ChefHat className="size-4 text-[#F05A00]" />;
  }
};

const activityBg = (type: string) => {
  switch (type) {
    case "like": return "bg-red-50";
    case "follow": return "bg-blue-50";
    case "save": return "bg-purple-50";
    default: return "bg-orange-50";
  }
};

const activityText = (notif: any) => {
  const actor = notif.actor?.full_name || notif.actor?.username || "Someone";
  switch (notif.type) {
    case "like": return <><span className="font-bold text-[#2A120A]">{actor}</span> liked your recipe <span className="font-bold text-[#F05A00]">{notif.recipe?.title}</span></>;
    case "follow": return <><span className="font-bold text-[#2A120A]">{actor}</span> started following you</>;
    case "save": return <><span className="font-bold text-[#2A120A]">{actor}</span> saved your recipe <span className="font-bold text-[#F05A00]">{notif.recipe?.title}</span></>;
    default: return <><span className="font-bold text-[#2A120A]">{actor}</span> interacted with your content</>;
  }
};

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return `${Math.floor(diffSeconds / 86400)}d ago`;
}

export default function ActivityPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchActivity = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("notifications")
        .select(`
          *,
          actor:actor_id ( full_name, username, avatar_url ),
          recipe:recipe_id ( title, img )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      setNotifications(data || []);
      setIsLoading(false);

      // Mark all as read
      await supabase.from("notifications").update({ read: true }).eq("user_id", session.user.id).eq("read", false);
    };
    fetchActivity();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] mb-1`}>Activity</h2>
        <p className="text-gray-500 font-medium">Your social interactions and updates.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-white border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${!notif.read ? "border-[#F05A00]/20 bg-[#FFFAF6]" : "border-gray-100"}`}
            >
              {/* Actor avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={notif.actor?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=anon`}
                  alt=""
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover bg-white"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${activityBg(notif.type)}`}>
                  {activityIcon(notif.type)}
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-snug">{activityText(notif)}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">{timeAgo(notif.created_at)}</p>
              </div>

              {/* Recipe thumb */}
              {notif.recipe?.img && (
                <img src={notif.recipe.img} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center">
          <Activity className="size-12 mx-auto mb-4 text-gray-300" />
          <h3 className={`${syneFont} text-xl font-bold text-[#2A120A] mb-2`}>No activity yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            When people follow you, like, or save your recipes — it will show up here.
          </p>
          <Link href="/dashboard/recipes/new" className="inline-flex items-center gap-2 bg-[#F05A00] text-white px-8 py-3 rounded-full font-bold hover:bg-[#d94f00] transition-colors">
            <ChefHat className="size-4" /> Publish a Recipe
          </Link>
        </div>
      )}
    </div>
  );
}
