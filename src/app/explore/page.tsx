"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Users, ChefHat, Heart, Clock, ArrowRight, Compass } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch trending recipes (most liked)
      const { data: recipeData } = await supabase
        .from("recipes")
        .select(`*, profiles:user_id ( full_name, username, avatar_url )`)
        .eq("status", "Published")
        .order("like_count", { ascending: false })
        .limit(12);
      setRecipes(recipeData || []);

      // Fetch top creators (by follower count via join — use profiles with recipe count)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .limit(8);
      setCreators(profileData || []);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredRecipes = search
    ? recipes.filter(r => r.title?.toLowerCase().includes(search.toLowerCase()) || r.category?.toLowerCase().includes(search.toLowerCase()))
    : recipes;
  const filteredCreators = search
    ? creators.filter(c => c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.username?.toLowerCase().includes(search.toLowerCase()))
    : creators;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 h-16 flex items-center justify-between px-6 lg:px-12">
        <Link href="/" className={`${syneFont} text-2xl font-bold text-[#F05A00]`}>ShoofEats.</Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-[#F05A00] transition-colors">Login</Link>
          <Link href="/register" className="bg-[#2A120A] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#F05A00] transition-colors">Sign Up</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center gap-2 bg-[#F8F4EC] text-[#F05A00] px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Compass className="size-4" /> Explore ShoofEats
          </div>
          <h1 className={`${syneFont} text-5xl lg:text-7xl font-black text-[#2A120A] mb-6 leading-tight`}>
            Discover Amazing<br /><span className="text-[#F05A00]">Recipes & Creators</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto mb-8 font-medium">Find your next favorite meal and the chef who makes it.</p>
          
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes, creators, categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#F05A00]/30 focus:border-[#F05A00] transition-all font-medium text-[#2A120A] shadow-lg text-lg"
            />
          </div>
        </motion.div>

        {/* Trending Creators */}
        {!search && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] flex items-center gap-3`}>
                <Users className="size-7 text-[#F05A00]" /> Top Creators
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {creators.map((creator, i) => (
                <motion.div key={creator.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/profile/${creator.username || creator.id}`} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-md hover:border-[#F05A00]/30 transition-all block group">
                    <img src={creator.avatar_url} alt={creator.full_name} className="w-16 h-16 rounded-full border-2 border-[#F8F4EC] mb-3 object-cover bg-white group-hover:border-[#F05A00] transition-colors" />
                    <p className="font-bold text-[#2A120A] text-sm truncate w-full">{creator.full_name || creator.username}</p>
                    <p className="text-xs text-gray-400 font-semibold">@{creator.username}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Recipes */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] flex items-center gap-3`}>
              <TrendingUp className="size-7 text-[#F05A00]" />
              {search ? `Results for "${search}"` : "Trending Recipes"}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRecipes.length > 0 ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe, i) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#F05A00]/20 transition-all group cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={recipe.img || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-red-500">
                      <Heart className="size-3 fill-red-500" /> {recipe.like_count || 0}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-[#2A120A] mb-1 truncate">{recipe.title}</p>
                    <div className="flex items-center gap-2">
                      <img src={recipe.profiles?.avatar_url} className="w-5 h-5 rounded-full bg-gray-100" alt="" />
                      <p className="text-xs text-gray-500 font-semibold">{recipe.profiles?.full_name || recipe.profiles?.username}</p>
                    </div>
                    {recipe.category && (
                      <span className="inline-block mt-2 bg-[#F8F4EC] text-[#F05A00] text-xs font-bold px-2 py-0.5 rounded-full">{recipe.category}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">
              <ChefHat className="size-12 mx-auto mb-4 opacity-30" />
              <p className="font-bold text-lg">No recipes found.</p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="bg-[#2A120A] rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F05A00]/20 blur-[100px] rounded-full pointer-events-none" />
          <h2 className={`${syneFont} text-4xl font-bold mb-4`}>Ready to share your recipes?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">Join thousands of food creators on ShoofEats and build your culinary community.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-[#F05A00] text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-[#F05A00]/30 hover:bg-[#d94f00] hover:scale-105 transition-all text-lg">
            Get Started — Free <ArrowRight className="size-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
