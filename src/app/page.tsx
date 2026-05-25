"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Compass, BookOpen, Coffee, Heart, ArrowRight, CheckCircle2, PlayCircle, Star, Clock, ChefHat, Bookmark, Plus, TrendingUp, Users, ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function ShoofEatsLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [trendingRecipes, setTrendingRecipes] = useState<any[]>([]);
  const [chefOfWeek, setChefOfWeek] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // Fetch trending recipes
      const { data: recipes, error: trendingError } = await supabase
        .from('recipes')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recipes && recipes.length > 0) {
        // Fetch profiles for these recipes manually
        const userIds = [...new Set(recipes.map(r => r.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', userIds);
          
        const profilesMap = (profilesData || []).reduce((acc: any, p: any) => {
          acc[p.id] = p;
          return acc;
        }, {});
        
        const recipesWithProfiles = recipes.map(r => ({
          ...r,
          profiles: profilesMap[r.user_id] || null
        }));
        
        setTrendingRecipes(recipesWithProfiles);

        // Chef of the week is the author of the latest published recipe
        const topRecipe = recipes[0];
        const topProfile = profilesMap[topRecipe.user_id];
        
        if (topProfile) {
          const { count } = await supabase
            .from('recipes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', topRecipe.user_id)
            .eq('status', 'Published');
            
          setChefOfWeek({
             ...topProfile,
             recipeCount: count || 1
          });
        }
      } else {
        console.error("Trending Error or No Recipes:", trendingError);
      }
    };
    fetchData();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const syneFont = "font-[family-name:var(--font-syne)]";

  // Motion variants
  const fadeIn: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="min-h-screen selection:bg-[#F05A00] selection:text-white" suppressHydrationWarning>
      {/* 1. Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed w-full z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen ? 'py-4 bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-sm' : 'py-6 bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className={`${syneFont} text-2xl font-bold tracking-tight text-[#F05A00] relative z-50`}>
              ShoofEats.
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#2A120A]">
              {['Explore', 'Categories', 'Recipes', 'Drinks'].map((item) => (
                <a key={item} href="#" className="relative group overflow-hidden">
                  <span className="group-hover:text-[#F05A00] transition-colors duration-300">{item}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F05A00] transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <Link href="/dashboard" className="bg-[#2A120A] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#1a0a05] transition-colors shadow-lg hover:shadow-xl">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="font-bold text-[#2A120A] hover:text-[#F05A00] transition-colors">Log In</Link>
                <Link href="/register" className="bg-[#2A120A] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#1a0a05] transition-colors shadow-lg hover:shadow-xl">
                  Get Started
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative z-50 p-2 text-[#2A120A]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl px-6 py-8 flex flex-col gap-6"
          >
            {['Explore', 'Categories', 'Recipes', 'Drinks'].map((item) => (
              <a key={item} href="#" className="text-xl font-bold text-[#2A120A]">{item}</a>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            {user ? (
              <Link href="/dashboard" className="bg-[#F05A00] text-white text-center py-4 rounded-2xl font-bold shadow-lg">
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-4">
                <Link href="/login" className="text-center font-bold text-[#2A120A] py-3">Log In</Link>
                <Link href="/register" className="bg-[#2A120A] text-white text-center py-4 rounded-2xl font-bold shadow-lg">
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </motion.nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden bg-[#F8F4EC]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 text-center lg:text-left"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD9B8]/50 text-[#F05A00] text-xs font-bold tracking-wider mb-6 md:mb-8 border border-[#FFD9B8]">
              <Star className="size-3 fill-[#F05A00]" />
              Your Personal Cookbook
            </motion.div>

            <motion.h1 variants={fadeIn} className={`${syneFont} text-5xl md:text-[5.5rem] lg:text-[6rem] font-black leading-[1.1] md:leading-[0.9] tracking-[-0.04em] mb-6 md:mb-8 text-[#2A120A]`}>
              Discover<br />
              Delicious Recipes<br />
              <span className="text-[#F05A00]">For Every Mood</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-base md:text-lg text-[#5D4037] mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Find, save, and cook amazing food and drink recipes in one place. Explore a world of flavors tailored just for you.
            </motion.p>

            {/* Smart AI Search Bar */}
            <motion.div variants={fadeIn} className="relative max-w-xl mx-auto lg:mx-0 mb-6 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                suppressHydrationWarning
                type="text"
                className="block w-full pl-12 pr-14 py-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-sm text-[#2A120A] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#FFD9B8]/50 focus:border-[#F05A00] focus:bg-white transition-all shadow-sm text-sm md:text-base"
                placeholder="Search recipes, drinks..."
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button suppressHydrationWarning className="bg-[#F05A00] p-2.5 rounded-xl text-white hover:bg-[#d94f00] transition-colors">
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex gap-2 flex-wrap justify-center lg:justify-start">
              {['egg', 'coffee', 'healthy', 'quick meal'].map(chip => (
                <button key={chip} suppressHydrationWarning className="px-3 py-1.5 rounded-lg bg-white/60 border border-white text-xs font-semibold text-[#5D4037] hover:bg-white hover:text-[#F05A00] transition-colors shadow-sm">
                  {chip}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative h-[400px] md:h-[600px] flex items-center justify-center lg:justify-end mt-10 lg:mt-0"
          >
            <div className="relative w-full max-w-[320px] md:max-w-[500px] aspect-[4/5]">
              {/* Main Hero Image */}
              <div className="absolute right-0 top-0 w-[85%] h-[90%] rounded-[2.5rem] overflow-hidden drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-[8px] border-white z-20 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80" alt="Main dish" className="w-full h-full object-cover" />
              </div>

              {/* Overlap Image 2 */}
              <div className="absolute left-0 bottom-10 w-[55%] h-[45%] rounded-[2rem] overflow-hidden drop-shadow-2xl border-[6px] border-white z-30 -rotate-6 hover:rotate-0 transition-transform duration-500 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80" alt="Dessert" className="w-full h-full object-cover" />
              </div>

              {/* Floating Stat Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 -left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-40 border border-white flex items-center gap-4"
              >
                <div className="bg-[#FFD9B8] p-3 rounded-full text-[#F05A00]">
                  <Star className="size-5 fill-[#F05A00]" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#2A120A]">4.9 Rating</p>
                  <p className="text-xs font-bold text-gray-500">10K+ Recipes Shared</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-24 -right-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl z-40 border border-white flex items-center gap-3"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <p className="text-xs font-bold text-[#2A120A]">2,340 people cooking</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Trending Recipes */}
      <section className="py-24 bg-[#110704] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F05A00]/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`${syneFont} text-4xl font-bold text-white mb-3`}
          >
            Trending Today
          </motion.h2>
          <p className="text-gray-400 text-lg">Top picks hand-curated by our culinary experts.</p>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto px-6 pb-12 max-w-[1400px] mx-auto scrollbar-hide snap-x -mx-6 md:mx-auto">
          {trendingRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              whileHover={{ scale: 1.02 }}
              className="w-[85vw] md:w-auto md:min-w-[600px] lg:min-w-[700px] h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group cursor-pointer snap-center shadow-xl md:shadow-2xl flex-shrink-0"
            >
              <img src={recipe.img || "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80"} alt={recipe.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#110704] via-[#110704]/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-10 w-full">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#F05A00] px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">{recipe.category || "Featured"}</span>
                  <div className="flex items-center gap-2">
                    <img src={recipe.profiles?.avatar_url || "https://api.dicebear.com/7.x/notionists/svg?seed=fallback"} className="w-6 h-6 rounded-full border border-white" />
                    <span className="text-white/80 text-sm font-semibold">{recipe.profiles?.full_name || recipe.profiles?.username || "Anonymous"}</span>
                  </div>
                </div>
                <h3 className={`${syneFont} text-5xl font-bold text-white mb-4`}>{recipe.title}</h3>
                <p className="text-gray-300 max-w-md text-lg mb-8 line-clamp-2">{recipe.description || "A delicious creation by our community."}</p>

                <div className="flex gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button suppressHydrationWarning className="bg-white text-[#2A120A] px-8 py-3 rounded-full font-bold hover:bg-[#F05A00] hover:text-white transition-colors flex items-center gap-2">
                    <PlayCircle className="size-5" /> View Recipe
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {trendingRecipes.length === 0 && (
            <div className="w-full text-center py-20 text-gray-500 font-bold">
              No public recipes yet. Be the first to publish one!
            </div>
          )}

        </div>
      </section>

      {/* 5. Why ShoofEats (Bento Grid) */}
      <section className="py-32 bg-[#F8F4EC]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`${syneFont} text-5xl font-bold text-[#2A120A] mb-4`}>Why Choose Us</h2>
            <p className="text-[#5D4037] text-lg max-w-2xl mx-auto">Everything you need to master your kitchen, designed with simplicity and elegance in mind.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[250px]">

            {/* Bento 1: Big Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ translateY: -5 }}
              className="md:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 flex flex-col justify-between shadow-sm border border-gray-100 relative overflow-hidden group min-h-[250px]"
            >
              <div className="relative z-10 w-2/3">
                <div className="w-12 h-12 bg-[#FFD9B8] rounded-xl flex items-center justify-center mb-6">
                  <Search className="size-6 text-[#F05A00]" />
                </div>
                <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-3`}>Smart AI Ingredient Search</h3>
                <p className="text-[#5D4037] font-medium leading-relaxed">Tell us what's in your fridge, and our AI will generate the perfect recipe for you instantly.</p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-l from-[#FFD9B8] to-transparent"></div>
            </motion.div>

            {/* Bento 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ translateY: -5 }}
              className="bg-[#2A120A] rounded-[2rem] p-10 flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center mb-6">
                  <Bookmark className="size-6 text-white" />
                </div>
                <h3 className={`${syneFont} text-2xl font-bold text-white mb-3`}>Save Favorites</h3>
                <p className="text-gray-400 font-medium">Build your personal digital cookbook.</p>
              </div>
            </motion.div>

            {/* Bento 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ translateY: -5 }}
              className="bg-white rounded-[2rem] p-10 flex flex-col justify-between shadow-sm border border-gray-100"
            >
              <div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Users className="size-6 text-blue-500" />
                </div>
                <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-3`}>Share Recipes</h3>
                <p className="text-[#5D4037] font-medium">Upload and share with the world.</p>
              </div>
            </motion.div>

            {/* Bento 4: Wide Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ translateY: -5 }}
              className="md:col-span-2 bg-gradient-to-br from-[#F05A00] to-[#E65100] rounded-[2rem] p-10 flex flex-col justify-between shadow-lg relative overflow-hidden text-white"
            >
              <div className="relative z-10 w-2/3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-6">
                  <ChefHat className="size-6 text-white" />
                </div>
                <h3 className={`${syneFont} text-2xl font-bold text-white mb-3`}>Personalized For You</h3>
                <p className="text-white/80 font-medium">Your feed adapts to your taste preferences, dietary restrictions, and favorite cuisines over time.</p>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-30 text-white">
                <TrendingUp className="w-64 h-64" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Mockup Dashboard removed since user wants it gone or replaced, 
          but keeping the transition clean */}

      {/* 7. Featured Creator */}
      <section className="py-16 md:py-24 bg-[#F8F4EC]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className={`${syneFont} text-3xl md:text-4xl font-bold text-[#2A120A] mb-8 md:mb-12`}>Chef of the Week</h2>

          {chefOfWeek && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="max-w-2xl mx-auto bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left relative overflow-hidden"
            >
              <img src={chefOfWeek.avatar_url || "https://api.dicebear.com/7.x/notionists/svg?seed=fallback"} alt="Chef" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 border-white mx-auto md:mx-0" />
              <div className="w-full">
                <h3 className={`${syneFont} text-2xl md:text-3xl font-bold text-[#2A120A] mb-2`}>
                  {chefOfWeek.full_name || chefOfWeek.username || "Anonymous Chef"}
                </h3>
                <p className="text-[#F05A00] font-bold text-sm mb-4">
                  Culinary Creator • {chefOfWeek.recipeCount} Recipes
                </p>
                <p className="text-[#5D4037] font-medium mb-6 italic">
                  "{chefOfWeek.bio || 'Cooking is love made visible. I enjoy sharing my favorite creations with the world.'}"
                </p>
                <Link href={`/profile/${chefOfWeek.username}`}>
                  <button suppressHydrationWarning className="text-sm font-bold bg-[#F8F4EC] text-[#2A120A] px-6 py-2 rounded-full hover:bg-[#FFD9B8] transition-colors">
                    View Profile
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-32 relative overflow-hidden bg-[#2A120A]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${syneFont} text-5xl md:text-7xl font-black text-white mb-8 tracking-tight`}
          >
            Cook smarter.<br />
            Eat better.<br />
            <span className="text-[#F05A00]">Discover flavors you’ll love.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 mb-12 font-medium"
          >
            Your next favorite recipe is waiting inside ShoofEats. Join our community today.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#F05A00] text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:shadow-[0_0_40px_rgba(240,90,0,0.4)] transition-all"
          >
            Get Started For Free
          </motion.button>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-white py-12 md:py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          <div className="md:col-span-1">
            <a href="#" className={`${syneFont} text-3xl font-bold tracking-tight text-[#F05A00] block mb-6`}>
              ShoofEats.
            </a>
            <p className="text-gray-500 font-medium mb-8">The modern platform for food discovery and personalized cooking experiences.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#2A120A] hover:bg-[#F05A00] hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#2A120A] hover:bg-[#F05A00] hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#2A120A] hover:bg-[#F05A00] hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#2A120A] mb-6">Explore</h4>
            <ul className="space-y-4 font-medium text-gray-500">
              <li><a href="#" className="hover:text-[#F05A00] transition-colors">Recipes</a></li>
              <li><a href="#" className="hover:text-[#F05A00] transition-colors">Drinks</a></li>
              <li><a href="#" className="hover:text-[#F05A00] transition-colors">Trending</a></li>
              <li><a href="#" className="hover:text-[#F05A00] transition-colors">Chef of the Week</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#2A120A] mb-6">Company</h4>
            <ul className="space-y-4 font-medium text-gray-500">
              <li><a href="#" className="hover:text-[#F05A00] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#F05A00] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#F05A00] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#F05A00] transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#2A120A] mb-6">Get Weekly Recipes</h4>
            <p className="text-gray-500 font-medium mb-4">Join 50,000+ subscribers cooking better meals.</p>
            <div className="flex gap-2">
              <input suppressHydrationWarning type="email" placeholder="Email address" className="bg-gray-100 px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#F05A00]" />
              <button suppressHydrationWarning className="bg-[#2A120A] text-white p-3 rounded-xl hover:bg-[#F05A00] transition-colors"><ArrowUpRight className="size-5" /></button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-100 text-center text-sm font-medium text-gray-400">
          © {new Date().getFullYear()} ShoofEats. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
