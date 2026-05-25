"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Search } from "lucide-react";
import Link from "next/link";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function FavoritesPage() {
  return (
    <div className="space-y-12 pb-12">
      <div>
        <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] mb-2`}>Saved Recipes</h2>
        <p className="text-gray-500 font-medium">Your personal collection of inspiration.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm"
      >
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="size-10 text-red-400" />
        </div>
        <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-3`}>No saved recipes yet</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
          You haven't saved any recipes to your favorites. Start exploring the community to find your next favorite meal!
        </p>
        
        <Link 
          href="/dashboard/community"
          className="inline-flex items-center gap-2 bg-[#F05A00] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-[#F05A00]/20 hover:bg-[#d94f00] hover:scale-105 transition-all"
        >
          <Search className="size-5" /> Explore Community
        </Link>
      </motion.div>
    </div>
  );
}
