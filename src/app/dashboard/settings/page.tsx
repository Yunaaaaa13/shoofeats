"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function SettingsPage() {
  const [theme, setTheme] = useState("Light");
  const [interests, setInterests] = useState(["Healthy", "Desserts"]);

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
      ? prev.filter(i => i !== interest)
      : [...prev, interest]
    );
  };

  return (
    <div className="max-w-4xl space-y-12 pb-12">
      <div>
        <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] mb-2`}>Settings</h2>
        <p className="text-gray-500 font-medium">Manage your account settings and preferences.</p>
      </div>

      <div className="space-y-10">
        
        {/* Account Settings */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-8`}>Account</h3>
          
          <div className="space-y-6 max-w-2xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2A120A] mb-2">Username</label>
                <input 
                  type="text" 
                  defaultValue="Luthfi Rafif"
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F05A00] focus:ring-4 focus:ring-[#FFD9B8]/50 outline-none transition-all font-medium text-[#2A120A]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2A120A] mb-2">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="luthfi@example.com"
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F05A00] focus:ring-4 focus:ring-[#FFD9B8]/50 outline-none transition-all font-medium text-[#2A120A]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#2A120A] mb-2">Password</label>
              <button className="text-[#F05A00] font-bold text-sm hover:underline">Change Password</button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-8`}>Preferences</h3>
          
          <div className="space-y-10 max-w-2xl">
            {/* Theme */}
            <div>
              <label className="block text-sm font-bold text-[#2A120A] mb-4">Theme</label>
              <div className="flex gap-4">
                {["Light", "Dark", "System"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 py-4 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${
                      theme === t 
                      ? "border-[#F05A00] bg-[#FFD9B8]/20 text-[#F05A00]" 
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {theme === t && <Check className="size-4" />} {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Cooking Interests */}
            <div>
              <label className="block text-sm font-bold text-[#2A120A] mb-4">Cooking Interests</label>
              <div className="flex flex-wrap gap-3">
                {["Drinks", "Healthy", "Desserts", "Quick Meals", "Asian", "Vegan", "Baking"].map(interest => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-5 py-3 rounded-full text-sm font-bold border transition-colors flex items-center gap-2 ${
                        isSelected 
                        ? "bg-[#2A120A] border-[#2A120A] text-white" 
                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {isSelected && <Check className="size-4" />} {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button className="bg-[#F05A00] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#d94f00] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
