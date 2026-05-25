"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, UserCheck, BookOpen, Heart, Share2, ChefHat, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [stats, setStats] = useState({ recipes: 0, followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);

      // Fetch profile by username
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", params.username)
        .single();

      if (!prof) { setIsLoading(false); return; }
      setProfile(prof);

      // Fetch recipes
      const { data: recipeData } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", prof.id)
        .eq("status", "Published")
        .order("created_at", { ascending: false });
      setRecipes(recipeData || []);

      // Stats
      const { count: recipeCount } = await supabase.from("recipes").select("*", { count: "exact", head: true }).eq("user_id", prof.id);
      const { count: followersCount } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", prof.id);
      const { count: followingCount } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", prof.id);
      setStats({ recipes: recipeCount || 0, followers: followersCount || 0, following: followingCount || 0 });

      // Is current user following?
      if (session?.user) {
        const { data: followCheck } = await supabase
          .from("follows")
          .select("follower_id")
          .match({ follower_id: session.user.id, following_id: prof.id })
          .single();
        setIsFollowing(!!followCheck);
      }

      setIsLoading(false);
    };
    fetchData();
  }, [params.username]);

  const handleFollow = async () => {
    if (!currentUser || !profile) return;
    if (isFollowing) {
      await supabase.from("follows").delete().match({ follower_id: currentUser.id, following_id: profile.id });
      setIsFollowing(false);
      setStats(s => ({ ...s, followers: s.followers - 1 }));
    } else {
      await supabase.from("follows").insert({ follower_id: currentUser.id, following_id: profile.id });
      setIsFollowing(true);
      setStats(s => ({ ...s, followers: s.followers + 1 }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="size-12 text-[#F05A00] mx-auto mb-4 animate-bounce" />
          <p className="text-gray-500 font-bold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className={`${syneFont} text-3xl font-bold text-[#2A120A] mb-4`}>Creator not found</p>
          <Link href="/" className="text-[#F05A00] font-bold hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 h-16 flex items-center px-6 gap-4">
        <Link href="/" className="text-gray-500 hover:text-[#2A120A] transition-colors">
          <ArrowLeft className="size-5" />
        </Link>
        <Link href="/" className={`${syneFont} text-xl font-bold text-[#F05A00]`}>ShoofEats.</Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-32 h-32 rounded-full border-4 border-[#F8F4EC] object-cover bg-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#F05A00] rounded-full p-2">
                <ChefHat className="size-4 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className={`${syneFont} text-4xl font-bold text-[#2A120A] mb-1`}>{profile.full_name || profile.username}</h1>
              <p className="text-[#F05A00] font-bold text-lg mb-4">@{profile.username}</p>
              <p className="text-gray-600 mb-6 max-w-lg leading-relaxed">{profile.bio || "Passionate food creator exploring the world one recipe at a time. 🍳"}</p>

              {/* Stats */}
              <div className="flex gap-8 mb-6 justify-center sm:justify-start">
                <div className="text-center">
                  <p className={`${syneFont} text-2xl font-black text-[#2A120A]`}>{stats.recipes}</p>
                  <p className="text-sm text-gray-500 font-medium">Recipes</p>
                </div>
                <div className="text-center">
                  <p className={`${syneFont} text-2xl font-black text-[#2A120A]`}>{stats.followers}</p>
                  <p className="text-sm text-gray-500 font-medium">Followers</p>
                </div>
                <div className="text-center">
                  <p className={`${syneFont} text-2xl font-black text-[#2A120A]`}>{stats.following}</p>
                  <p className="text-sm text-gray-500 font-medium">Following</p>
                </div>
              </div>

              {/* Action Buttons */}
              {currentUser && currentUser.id !== profile.id && (
                <div className="flex gap-3 justify-center sm:justify-start">
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${
                      isFollowing
                        ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500"
                        : "bg-[#2A120A] text-white shadow-lg hover:bg-[#F05A00]"
                    }`}
                  >
                    {isFollowing ? <><UserCheck className="size-4" /> Following</> : <><UserPlus className="size-4" /> Follow</>}
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                    <Share2 className="size-4" /> Share
                  </button>
                </div>
              )}
              {!currentUser && (
                <Link href="/login" className="inline-flex items-center gap-2 bg-[#F05A00] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#d94f00] transition-colors">
                  <UserPlus className="size-4" /> Login to Follow
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recipes Grid */}
        <div>
          <h2 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-6`}>Recipes by {profile.full_name || profile.username}</h2>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recipes.map((recipe, i) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden relative shadow-sm">
                    <img
                      src={recipe.img || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        <p className="text-white font-bold">{recipe.title}</p>
                        <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                          <span className="flex items-center gap-1"><Heart className="size-3" /> {recipe.like_count || 0}</span>
                          <span className="flex items-center gap-1"><BookOpen className="size-3" /> {recipe.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center">
              <BookOpen className="size-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">No published recipes yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
