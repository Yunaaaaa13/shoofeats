"use client";

import React from "react";
import { motion } from "framer-motion";
import { Edit2, MapPin, Link as LinkIcon } from "lucide-react";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      {/* Cover & Avatar */}
      <div className="relative mb-20">
        <div className="h-64 rounded-[2.5rem] bg-[#2A120A] overflow-hidden relative shadow-sm">
          <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80" alt="Cover" className="w-full h-full object-cover opacity-60" />
          <button className="absolute top-6 right-6 bg-white/20 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/30 transition-colors">
            Edit Cover
          </button>
        </div>
        
        <div className="absolute -bottom-16 left-12 flex items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-[#FDFBF7] overflow-hidden shadow-xl bg-white">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80" alt="Luthfi Rafif" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 bg-[#F05A00] text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white">
              <Edit2 className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info & Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-4 lg:px-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className={`${syneFont} text-4xl font-bold text-[#2A120A] mb-1`}>Luthfi Rafif</h2>
            <p className="text-[#F05A00] font-bold text-lg mb-4">Recipe Creator</p>
            <p className="text-gray-600 max-w-lg mb-6 leading-relaxed">
              Passionate home cook exploring the world one recipe at a time. I love creating simple, healthy, and delicious meals for busy people.
            </p>
            <div className="flex gap-4 text-sm font-medium text-gray-500 mb-8">
              <span className="flex items-center gap-1.5"><MapPin className="size-4 text-gray-400" /> Jakarta, ID</span>
              <span className="flex items-center gap-1.5"><LinkIcon className="size-4 text-gray-400" /> luthfirafif.com</span>
            </div>
          </div>
          
          <button className="bg-gray-100 text-[#2A120A] px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Edit2 className="size-4" /> Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 border-y border-gray-200 py-6 mb-8">
          <div>
            <p className={`${syneFont} text-3xl font-bold text-[#2A120A]`}>12</p>
            <p className="text-gray-500 font-medium">Recipes</p>
          </div>
          <div>
            <p className={`${syneFont} text-3xl font-bold text-[#2A120A]`}>89</p>
            <p className="text-gray-500 font-medium">Saves</p>
          </div>
          <div>
            <p className={`${syneFont} text-3xl font-bold text-[#2A120A]`}>420</p>
            <p className="text-gray-500 font-medium">Visits</p>
          </div>
        </div>
        
        {/* Social Links */}
        <div>
          <h3 className="font-bold text-[#2A120A] mb-4">Connect</h3>
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#F05A00] hover:text-[#F05A00] hover:bg-orange-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
