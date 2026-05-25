"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  PlusSquare,
  Edit3,
  Trash2,
  Eye,
  Clock,
  ChefHat
} from "lucide-react";
import Link from "next/link";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function MyRecipesPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Food", "Drink", "Healthy", "Dessert", "Published", "Draft"];

  const recipes = [
    { id: 1, title: "Chicken Katsu", category: "Food", time: "20 min", status: "Published", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Matcha Latte", category: "Drink", time: "5 min", status: "Published", img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Avocado Toast", category: "Healthy", time: "10 min", status: "Published", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Strawberry Shortcake", category: "Dessert", time: "45 min", status: "Draft", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80" },
  ];

  const filteredRecipes = recipes.filter(r => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Published" || activeFilter === "Draft") return r.status === activeFilter;
    return r.category === activeFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] mb-2`}>My Recipes</h2>
          <p className="text-gray-500 font-medium">Manage and organize your culinary creations.</p>
        </div>
        <Link href="/dashboard/recipes/new" className="hidden md:flex bg-[#F05A00] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#F05A00]/20 hover:bg-[#d94f00] transition-colors items-center gap-2">
          <PlusSquare className="size-5" /> Add New Recipe
        </Link>
      </div>

      {/* Toolbar (Search, Filter, Sort) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full lg:w-[350px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search recipes..." 
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#F05A00]/50 transition-all font-medium text-[#2A120A]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 text-gray-400 px-2 border-r border-gray-200 mr-2 shrink-0">
            <Filter className="size-5" />
          </div>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeFilter === filter 
                ? "bg-[#2A120A] text-white" 
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sort */}
        <button className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-[#2A120A] font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shrink-0">
          <ArrowUpDown className="size-5" /> Sort by
        </button>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecipes.map((recipe) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={recipe.id}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group relative"
              >
                {/* Image */}
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 backdrop-blur-md ${
                      recipe.status === "Published" ? "bg-green-500/90 text-white" : "bg-white/90 text-gray-600"
                    }`}>
                      {recipe.status === "Published" && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                      {recipe.status}
                    </span>
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-[#2A120A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2A120A] hover:bg-[#F05A00] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl">
                      <Eye className="size-5" />
                    </button>
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2A120A] hover:bg-blue-600 hover:text-white transition-colors transform translate-y-8 group-hover:translate-y-0 duration-500 shadow-xl">
                      <Edit3 className="size-5" />
                    </button>
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2A120A] hover:bg-red-600 hover:text-white transition-colors transform translate-y-12 group-hover:translate-y-0 duration-700 shadow-xl">
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className={`${syneFont} text-xl font-bold text-[#2A120A] mb-4`}>{recipe.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
                    <span className="flex items-center gap-1.5"><ChefHat className="size-4 text-[#F05A00]" /> {recipe.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1.5"><Clock className="size-4 text-[#F05A00]" /> {recipe.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-16 flex flex-col items-center justify-center text-center"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="size-10 text-gray-300" />
          </div>
          <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-2`}>No recipes yet 🍳</h3>
          <p className="text-gray-500 max-w-sm mb-8 font-medium">Your personal cookbook is empty. Start creating your first recipe to share with the world.</p>
          <Link href="/dashboard/recipes/new" className="bg-[#2A120A] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#1a0a05] transition-colors flex items-center gap-2">
            <PlusSquare className="size-5" /> Create First Recipe
          </Link>
        </motion.div>
      )}

      {/* Mobile Add Button (Sticky) */}
      <Link href="/dashboard/recipes/new" className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-[#F05A00] text-white rounded-full flex items-center justify-center shadow-2xl z-40">
        <PlusSquare className="size-6" />
      </Link>

    </div>
  );
}
