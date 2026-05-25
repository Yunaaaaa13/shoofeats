"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  BookOpen, 
  Heart, 
  Eye, 
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function DashboardOverview() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recipeCount, setRecipeCount] = useState(0);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setUserProfile(profile);

      // Fetch recipe stats
      const { count } = await supabase.from('recipes').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);
      setRecipeCount(count || 0);

      // Fetch recent recipes
      const { data: recipes } = await supabase.from('recipes').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(3);
      setRecentRecipes(recipes || []);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Recipes Created", value: recipeCount.toString(), icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Saved Recipes", value: "0", icon: Heart, color: "text-red-500", bg: "bg-red-50" }, // Mocked until favorites table
    { label: "Most Cooked", value: "-", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Views", value: "0", icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const activities = [
    { day: "Today", events: [{ text: "Logged in", time: new Date().toLocaleTimeString() }] },
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* Section A: Welcome Hero */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2A120A] rounded-[2.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F05A00] blur-[120px] rounded-full opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className={`${syneFont} text-4xl lg:text-5xl font-bold mb-4`}>
            Good Evening, {userProfile?.full_name || userProfile?.username || 'Chef'} 👋
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed font-medium">
            You've created <span className="text-white font-bold">{recipeCount} recipes</span>.<br/>
            Keep building your personal cookbook.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/recipes/new" className="bg-[#F05A00] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-[#F05A00]/30 hover:bg-[#d94f00] transition-colors">
              Add Recipe
            </Link>
            <Link href="/dashboard/community" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/20 transition-colors">
              Explore Community
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Section B: Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`size-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 mb-1">{stat.label}</p>
              <p className={`${syneFont} text-2xl font-bold text-[#2A120A]`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Section C: Recently Added Recipes */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A]`}>Recent Recipes</h3>
              <Link href="/dashboard/recipes" className="text-sm font-bold text-[#F05A00] hover:underline flex items-center gap-1">
                View All <ArrowRight className="size-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentRecipes.map((recipe, i) => (
                <motion.div 
                  key={recipe.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="bg-white p-4 rounded-3xl flex items-center justify-between gap-4 shadow-sm border border-gray-100 group hover:border-[#F05A00]/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img src={recipe.img} alt={recipe.title} className="w-16 h-16 rounded-2xl object-cover" />
                    <div>
                      <h4 className={`${syneFont} font-bold text-[#2A120A] text-lg`}>{recipe.title}</h4>
                      <p className="text-sm text-gray-500 font-medium">
                        {new Date(recipe.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/dashboard/recipes/${recipe.id}`} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-[#2A120A] bg-gray-50 rounded-lg">View</Link>
                  </div>
                  <button className="sm:hidden text-gray-400">
                    <MoreVertical className="size-5" />
                  </button>
                </motion.div>
              ))}
              {recentRecipes.length === 0 && (
                <p className="text-gray-500 py-4 font-medium">No recipes created yet.</p>
              )}
            </div>
          </section>

          {/* Section D: Favorites Preview */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A]`}>Saved Recipes</h3>
              <Link href="/dashboard/favorites" className="text-sm font-bold text-[#F05A00] hover:underline flex items-center gap-1">
                See All <ArrowRight className="size-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "Healthy Salad", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80" },
                { title: "Espresso", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=300&q=80" }
              ].map((recipe, i) => (
                <motion.div 
                  key={recipe.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden relative mb-3 shadow-md">
                    <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm text-red-500">
                      <Heart className="size-4 fill-red-500" />
                    </div>
                  </div>
                  <h4 className="font-bold text-[#2A120A]">{recipe.title}</h4>
                </motion.div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column (Narrow) */}
        <div>
          {/* Section E: Activity Timeline */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28">
            <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-8`}>Recent Activity</h3>
            
            <div className="space-y-8">
              {activities.map((block, i) => (
                <div key={block.day}>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{block.day}</p>
                  <div className="space-y-6">
                    {block.events.map((event, j) => (
                      <div key={j} className="flex gap-4">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center relative z-10 border-2 border-white">
                            <CheckCircle2 className="size-4 text-green-500" />
                          </div>
                          {/* Line connector */}
                          {j !== block.events.length - 1 && (
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-100"></div>
                          )}
                        </div>
                        <div className="pt-1.5">
                          <p className="font-semibold text-[#2A120A]">{event.text}</p>
                          <p className="text-sm font-medium text-gray-400 mt-1">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
