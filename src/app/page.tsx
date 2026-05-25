"use client";

import React, { useState, useEffect } from "react";
import { Search, Compass, BookOpen, Coffee, Heart, ArrowRight, CheckCircle2, PlayCircle, Star, Clock, ChefHat, Bookmark, Plus } from "lucide-react";

export default function ShoofyLanding() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const syneFont = "font-[family-name:var(--font-syne)]";
  const interFont = "font-[family-name:var(--font-inter)]";

  return (
    <div className={`min-h-screen bg-[#FDFBF7] text-[#3E2723] ${interFont} selection:bg-orange-200`}>

      {/* ─── 1. Navbar ─── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#FDFBF7]/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className={`${syneFont} text-2xl font-bold tracking-tight text-[#E65100]`}>
              ShoofEats.
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5D4037]">
              <a href="#" className="hover:text-[#E65100] transition-colors">Explore</a>
              <a href="#" className="hover:text-[#E65100] transition-colors">Categories</a>
              <a href="#" className="hover:text-[#E65100] transition-colors">Recipes</a>
              <a href="#" className="hover:text-[#E65100] transition-colors">Drinks</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-semibold text-[#5D4037] hover:text-[#E65100] transition-colors">
              Login
            </button>
            <button className="bg-[#E65100] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-[0_4px_14px_0_rgba(230,81,0,0.3)] hover:shadow-[0_6px_20px_rgba(230,81,0,0.2)] hover:scale-105 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ─── 2. Hero Section ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Text */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE0B2]/50 text-[#E65100] text-xs font-bold tracking-wider mb-6 border border-[#FFE0B2]">
              <Star className="size-3 fill-[#E65100]" />
              Your Personal Cookbook
            </div>

            <h1 className={`${syneFont} text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight text-[#26150F]`}>
              Discover Delicious Recipes <br />
              <span className="text-[#E65100]">for Every Mood</span>
            </h1>

            <p className="text-lg text-[#5D4037] mb-10 max-w-lg leading-relaxed">
              Find, save, and cook amazing food and drink recipes in one place. Explore a world of flavors tailored just for you.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E65100] to-[#FFB300] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center bg-white p-2 rounded-2xl shadow-sm border border-[#EFEBE5]">
                <Search className="size-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Search recipes, drinks, ingredients..."
                  className="w-full bg-transparent px-4 py-2 text-sm focus:outline-none placeholder:text-gray-400 text-[#3E2723]"
                />
                <button className="bg-[#26150F] text-white p-2 rounded-xl hover:bg-[#E65100] transition-colors">
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-[#E65100] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-[#E65100]/20 hover:scale-105 transition-all">
                Explore Recipes
              </button>
              <button className="bg-white text-[#3E2723] border border-[#D7CCC8] px-8 py-3.5 rounded-full text-sm font-bold hover:bg-[#F5F5F5] transition-all flex items-center gap-2">
                <Plus className="size-4" />
                Add Your Recipe
              </button>
            </div>
          </div>

          {/* Right Collage */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFE0B2]/40 rounded-full blur-3xl"></div>

            {/* Grid Collage */}
            <div className="absolute top-10 right-20 w-64 h-80 rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 z-20 border-4 border-white">
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80" alt="Ramen" className="w-full h-full object-cover" />
            </div>

            <div className="absolute bottom-10 right-10 w-56 h-64 rounded-[2rem] overflow-hidden shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-500 z-30 border-4 border-white">
              <img src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80" alt="Coffee" className="w-full h-full object-cover" />
            </div>

            <div className="absolute top-32 right-80 w-48 h-56 rounded-[2rem] overflow-hidden shadow-xl -rotate-12 hover:rotate-0 transition-transform duration-500 z-10 border-4 border-white">
              <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=500&q=80" alt="Dessert" className="w-full h-full object-cover" />
            </div>

            {/* Floating badge */}
            <div className="absolute bottom-40 right-72 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl z-40 flex items-center gap-3 border border-white">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Heart className="size-5 fill-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">Popular</p>
                <p className="text-sm font-black text-[#26150F]">Matcha Latte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Categories ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className={`${syneFont} text-3xl font-bold text-[#26150F] mb-2`}>Explore by Category</h2>
              <p className="text-[#5D4037]">Find what you're craving right now.</p>
            </div>
            <a href="#" className="hidden sm:flex items-center gap-1 text-[#E65100] font-bold text-sm hover:underline">
              View All <ArrowRight className="size-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Food", icon: "🍜", color: "bg-red-50" },
              { name: "Drinks", icon: "☕", color: "bg-amber-50" },
              { name: "Dessert", icon: "🍰", color: "bg-pink-50" },
              { name: "Healthy", icon: "🥗", color: "bg-green-50" },
              { name: "Quick Meals", icon: "⚡", color: "bg-blue-50" },
              { name: "Trending", icon: "🔥", color: "bg-orange-50" },
            ].map((cat) => (
              <div key={cat.name} className={`${cat.color} rounded-3xl p-6 text-center cursor-pointer hover:scale-105 transition-transform duration-300 border border-transparent hover:border-black/5`}>
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-[#3E2723]">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Trending Recipes (Netflix Style) ─── */}
      <section className="py-20 bg-[#26150F] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <h2 className={`${syneFont} text-3xl font-bold text-white mb-2`}>Trending Recipes</h2>
          <p className="text-gray-400">What everyone is cooking this week.</p>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="flex gap-6 overflow-x-auto px-6 pb-10 max-w-7xl mx-auto scrollbar-hide snap-x">
          {[
            { title: "Matcha Latte", time: "5 min", type: "Drink", img: "https://images.unsplash.com/photo-1515823662972-da6a2b4d3002?auto=format&fit=crop&w=600&q=80" },
            { title: "Chicken Katsu", time: "20 min", type: "Food", img: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=600&q=80" },
            { title: "Avocado Toast", time: "10 min", type: "Healthy", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=600&q=80" },
            { title: "Iced Caramel Macchiato", time: "5 min", type: "Drink", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80" },
            { title: "Spicy Ramen", time: "15 min", type: "Food", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80" },
          ].map((recipe, i) => (
            <div key={i} className="min-w-[280px] md:min-w-[320px] h-[400px] rounded-3xl relative overflow-hidden group cursor-pointer snap-center shadow-2xl flex-shrink-0">
              <img src={recipe.img} alt={recipe.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                {recipe.type}
              </div>

              <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className={`${syneFont} text-2xl font-bold text-white mb-2`}>{recipe.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-300 font-medium mb-4">
                  <span className="flex items-center gap-1"><Clock className="size-4" /> {recipe.time}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                  <span>{recipe.type}</span>
                </div>
                <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#E65100] hover:text-white flex items-center justify-center gap-2">
                  <PlayCircle className="size-4" /> View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. Why ShoofEats? ─── */}
      <section className="py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className={`${syneFont} text-4xl font-bold text-[#26150F] mb-16`}>Why ShoofEats?</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFE0B2] rounded-2xl flex items-center justify-center mb-6 rotate-3">
                <Compass className="size-8 text-[#E65100]" />
              </div>
              <h3 className={`${syneFont} text-xl font-bold text-[#26150F] mb-3`}>Discover Recipes</h3>
              <p className="text-[#5D4037]">Explore hundreds of food & drink ideas curated for your taste.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#C8E6C9] rounded-2xl flex items-center justify-center mb-6 -rotate-3">
                <Bookmark className="size-8 text-green-600" />
              </div>
              <h3 className={`${syneFont} text-xl font-bold text-[#26150F] mb-3`}>Save Favorites</h3>
              <p className="text-[#5D4037]">Build your personal cookbook and never lose a great recipe again.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFCDD2] rounded-2xl flex items-center justify-center mb-6 rotate-6">
                <ChefHat className="size-8 text-red-500" />
              </div>
              <h3 className={`${syneFont} text-xl font-bold text-[#26150F] mb-3`}>Share Your Recipe</h3>
              <p className="text-[#5D4037]">Upload and manage your own recipes easily to share with the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 & 7. Features & Showcase UI ─── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Features Text */}
          <div>
            <h2 className={`${syneFont} text-4xl font-bold text-[#26150F] mb-6 leading-tight`}>
              Manage Your Recipes <br /> <span className="text-[#E65100]">Like a Pro</span>
            </h2>
            <p className="text-lg text-[#5D4037] mb-8">
              Create, edit, organize, and save recipes effortlessly. Built with modern tools to give you the best experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {['Smart Search', 'Save Recipes', 'Upload Recipes', 'Easy CRUD', 'Favorite List', 'Personalized Cookbook'].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full">
                    <CheckCircle2 className="size-4 text-green-600" />
                  </div>
                  <span className="font-semibold text-[#3E2723]">{feature}</span>
                </div>
              ))}
            </div>

            <button className="bg-[#26150F] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl hover:bg-[#E65100] transition-colors">
              Start Cooking
            </button>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFE0B2] rounded-[3rem] rotate-6 scale-105 z-0"></div>
            <div className="relative z-10 bg-white border-8 border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden aspect-[4/3]">
              {/* Fake Dashboard Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-400"></div>
                  <div className="size-3 rounded-full bg-amber-400"></div>
                  <div className="size-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dashboard</div>
                <div className="size-6 bg-gray-200 rounded-full"></div>
              </div>
              {/* Fake Dashboard Content */}
              <div className="p-6 flex flex-col gap-4">
                <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                <div className="flex gap-4">
                  <div className="h-32 w-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Plus className="text-gray-400" />
                  </div>
                  <div className="h-32 flex-1 bg-gray-100 rounded-xl relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1495474472201-416e511c750f?auto=format&fit=crop&w=300&q=80" alt="Mock" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-[10px] font-bold">Coffee Setup</div>
                  </div>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded-full mt-4"></div>
                <div className="h-4 w-3/4 bg-gray-100 rounded-full"></div>
              </div>
            </div>

            {/* Floating Element */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 border border-gray-100 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-xl"><Coffee className="size-6 text-amber-600" /></div>
              <div>
                <p className="text-sm font-bold">Recipe Added!</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Stats ─── */}
      <section className="py-16 bg-[#26150F] text-white border-y border-white/10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="py-4">
            <h3 className={`${syneFont} text-5xl font-bold mb-2 text-[#E65100]`}>500+</h3>
            <p className="text-gray-400 font-medium">Recipes Available</p>
          </div>
          <div className="py-4">
            <h3 className={`${syneFont} text-5xl font-bold mb-2 text-[#E65100]`}>2K+</h3>
            <p className="text-gray-400 font-medium">Saved to Cookbooks</p>
          </div>
          <div className="py-4">
            <h3 className={`${syneFont} text-5xl font-bold mb-2 text-[#E65100]`}>100+</h3>
            <p className="text-gray-400 font-medium">Drink Mixes</p>
          </div>
        </div>
      </section>

      {/* ─── 9. CTA ─── */}
      <section className="py-24 bg-[#FFE0B2]/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={`${syneFont} text-4xl md:text-5xl font-bold text-[#26150F] mb-6`}>
            Ready to discover your next favorite dish?
          </h2>
          <p className="text-lg text-[#5D4037] mb-10">
            Join thousands of food lovers and start building your personalized cookbook today.
          </p>
          <button className="bg-[#E65100] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl shadow-[#E65100]/20 hover:scale-105 transition-transform">
            Start your cooking journey
          </button>
        </div>
      </section>

      {/* ─── 10. Footer ─── */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <a href="#" className={`${syneFont} text-2xl font-bold tracking-tight text-[#E65100]`}>
              ShoofEats.
            </a>
            <p className="text-sm text-gray-500 mt-2">© 2026 ShoofEats. All rights reserved.</p>
          </div>

          <div className="flex gap-8 text-sm font-semibold text-[#5D4037]">
            <a href="#" className="hover:text-[#E65100] transition-colors">Explore</a>
            <a href="#" className="hover:text-[#E65100] transition-colors">Recipes</a>
            <a href="#" className="hover:text-[#E65100] transition-colors">Drinks</a>
            <a href="#" className="hover:text-[#E65100] transition-colors">About</a>
          </div>

          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-[#E65100] transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-[#E65100] transition-colors">Github</a>
            <a href="#" className="text-gray-400 hover:text-[#E65100] transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
