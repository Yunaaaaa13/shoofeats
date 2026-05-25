"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Users, ChefHat } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function CommunityPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setCurrentUser(session.user);

      // Fetch all profiles except current user
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", session.user.id);
      
      if (profilesData) setProfiles(profilesData);

      // Fetch whom the current user is following
      const { data: followData } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", session.user.id);

      if (followData) {
        setFollowing(followData.map(f => f.following_id));
      }
    };
    fetchData();
  }, []);

  const handleFollow = async (profileId: string) => {
    if (following.includes(profileId)) {
      // Unfollow
      const { error } = await supabase
        .from("follows")
        .delete()
        .match({ follower_id: currentUser.id, following_id: profileId });
      if (!error) setFollowing(following.filter(id => id !== profileId));
    } else {
      // Follow
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: currentUser.id, following_id: profileId });
      if (!error) setFollowing([...following, profileId]);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] mb-2`}>Community</h2>
          <p className="text-gray-500 font-medium">Find friends and discover amazing chefs.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or username..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#F05A00]/50 transition-all font-medium text-[#2A120A]"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => {
          const isFollowing = following.includes(profile.id);
          return (
            <motion.div 
              key={profile.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <img src={profile.avatar_url} alt={profile.full_name} className="w-24 h-24 rounded-full mb-4 border-4 border-gray-50 object-cover" />
              <h3 className={`${syneFont} text-xl font-bold text-[#2A120A]`}>{profile.full_name || profile.username}</h3>
              <p className="text-sm font-semibold text-gray-500 mb-4">@{profile.username}</p>
              
              <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[40px]">
                {profile.bio || "No bio available yet."}
              </p>
              
              <button 
                onClick={() => handleFollow(profile.id)}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                  isFollowing 
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                  : "bg-[#2A120A] text-white shadow-lg hover:bg-[#1a0a05]"
                }`}
              >
                {isFollowing ? (
                  <>Following</>
                ) : (
                  <><UserPlus className="size-4" /> Follow</>
                )}
              </button>
            </motion.div>
          )
        })}
        {filteredProfiles.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium">
            <Users className="size-12 mx-auto mb-4 opacity-50" />
            No chefs found.
          </div>
        )}
      </div>
    </div>
  );
}
