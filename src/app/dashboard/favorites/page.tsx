"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, PlayCircle } from "lucide-react";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function FavoritesPage() {
  const collections = [
    {
      title: "Coffee Drinks",
      recipes: [
        { title: "Matcha Latte", img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=300&q=80" },
        { title: "Espresso", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=300&q=80" },
        { title: "Iced Caramel Macchiato", img: "https://images.unsplash.com/photo-1495474472204-518653683b45?auto=format&fit=crop&w=300&q=80" },
      ]
    },
    {
      title: "Quick Meals",
      recipes: [
        { title: "Chicken Katsu", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=300&q=80" },
        { title: "Avocado Toast", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=300&q=80" },
        { title: "Pasta Carbonara", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80" },
        { title: "Grilled Salmon", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80" },
      ]
    },
    {
      title: "Healthy",
      recipes: [
        { title: "Vegan Bowl", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=80" },
        { title: "Fruit Salad", img: "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?auto=format&fit=crop&w=300&q=80" },
      ]
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      <div>
        <h2 className={`${syneFont} text-3xl font-bold text-[#2A120A] mb-2`}>Saved Recipes</h2>
        <p className="text-gray-500 font-medium">Your personal collection of inspiration.</p>
      </div>

      <div className="space-y-12">
        {collections.map((collection, idx) => (
          <section key={collection.title}>
            <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-6`}>{collection.title}</h3>
            
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {collection.recipes.map((recipe, rIdx) => (
                <motion.div 
                  key={recipe.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 + rIdx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="min-w-[280px] md:min-w-[320px] group cursor-pointer snap-start"
                >
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden relative mb-4 shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:shadow-[#F05A00]/10 transition-all duration-300">
                    <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    
                    <div className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full shadow-sm text-red-500 hover:bg-white transition-colors">
                      <Heart className="size-5 fill-red-500" />
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white text-[#2A120A] px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0">
                        <PlayCircle className="size-5" /> View
                      </button>
                    </div>
                  </div>
                  <h4 className={`${syneFont} font-bold text-[#2A120A] text-lg px-1`}>{recipe.title}</h4>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
