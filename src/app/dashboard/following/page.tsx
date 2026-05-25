"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, UserCheck, ChefHat, BookOpen, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function FollowingPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [followingProfiles, setFollowingProfiles] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"discover" | "following">("discover");
  const [recipeCounts, setRecipeCounts] = useState<Record<string, number>>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setCurrentUser(session.user);

      // All profiles except current user
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", session.user.id);

      if (profilesData) setProfiles(profilesData);

      // Who current user is following
      const { data: followData } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", session.user.id);

      if (followData) {
        const ids = followData.map(f => f.following_id);
        setFollowingIds(ids);

        // Fetch full profiles of following
        if (ids.length > 0) {
          const { data: followingP } = await supabase
            .from("profiles")
            .select("*")
            .in("id", ids);
          setFollowingProfiles(followingP || []);
        }
      }
    };
    fetchData();
  }, []);

  const handleFollow = async (profileId: string) => {
    if (!currentUser) return;
    if (followingIds.includes(profileId)) {
      await supabase.from("follows").delete().match({ follower_id: currentUser.id, following_id: profileId });
      setFollowingIds(prev => prev.filter(id => id !== profileId));
      setFollowingProfiles(prev => prev.filter(p => p.id !== profileId));
    } else {
      await supabase.from("follows").insert({ follower_id: currentUser.id, following_id: profileId });
      setFollowingIds(prev => [...prev, profileId]);
      const newProfile = profiles.find(p => p.id === profileId);
      if (newProfile) setFollowingProfiles(prev => [...prev, newProfile]);
    }
  };

  const filteredProfiles = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.username?.toLowerCase().includes(search.toLowerCase())
  );

  const CreatorCard = ({ profile }: { profile: any }) => {
    const isFollowing = followingIds.includes(profile.id);
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
      >
        <Link href={`/profile/${profile.username || profile.id}`} className="block">
          <div className="relative mb-4">
            <img src={profile.avatar_url} alt={profile.full_name} className="w-20 h-20 rounded-full border-4 border-[#F8F4EC] object-cover bg-white group-hover:border-[#F05A00]/30 transition-colors" />
            <div className="absolute -bottom-1 -right-1 bg-[#F05A00] rounded-full p-1.5">
              <ChefHat className="size-3 text-white" />
            </div>
          </div>
          <h3 className={`${syneFont} text-lg font-bold text-[#2A120A] mb-1`}>{profile.full_name || profile.username}</h3>
          <p className="text-sm font-semibold text-gray-400 mb-3">@{profile.username}</p>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">{profile.bio || "Passionate food creator 🍳"}</p>
        </Link>
        <button
          onClick={() => handleFollow(profile.id)}
          className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 text-sm ${
            isFollowing
              ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
              : "bg-[#2A120A] text-white hover:bg-[#F05A00] shadow-md"
          }`}
        >
          {isFollowing ? <><UserCheck className="size-4" /> Following</> : <><UserPlus className="size-4" /> Follow</>}
        </button>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] mb-1`}>Social</h2>
          <p className="text-gray-500 font-medium">Discover creators and manage your network.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl">
          <button onClick={() => setActiveTab("discover")} className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "discover" ? "bg-white shadow text-[#2A120A]" : "text-gray-500"}`}>Discover</button>
          <button onClick={() => setActiveTab("following")} className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === "following" ? "bg-white shadow text-[#2A120A]" : "text-gray-500"}`}>
            Following <span className="bg-[#F05A00] text-white text-xs px-2 py-0.5 rounded-full">{followingIds.length}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search creators by name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#F05A00]/30 focus:border-[#F05A00] transition-all font-medium text-[#2A120A] shadow-sm"
        />
      </div>

      {/* Content */}
      {activeTab === "discover" && (
        <div>
          <h3 className={`${syneFont} text-xl font-bold text-[#2A120A] mb-6`}>
            {search ? `Results for "${search}"` : "All Creators"}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(profile => (
              <CreatorCard key={profile.id} profile={profile} />
            ))}
            {filteredProfiles.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400">
                <Users className="size-12 mx-auto mb-4 opacity-30" />
                <p className="font-bold text-lg">No creators found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "following" && (
        <div>
          <h3 className={`${syneFont} text-xl font-bold text-[#2A120A] mb-6`}>
            Creators you follow ({followingIds.length})
          </h3>
          {followingProfiles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followingProfiles.map(profile => (
                <CreatorCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center">
              <UserCheck className="size-12 mx-auto mb-4 text-gray-300" />
              <h4 className={`${syneFont} text-xl font-bold text-[#2A120A] mb-2`}>Not following anyone yet</h4>
              <p className="text-gray-500 mb-6">Discover creators and follow them to see their updates.</p>
              <button onClick={() => setActiveTab("discover")} className="bg-[#F05A00] text-white px-8 py-3 rounded-full font-bold hover:bg-[#d94f00] transition-colors">
                Discover Creators
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
