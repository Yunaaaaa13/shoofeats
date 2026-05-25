"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  UploadCloud, 
  Plus, 
  Trash2, 
  GripVertical, 
  CheckCircle2,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const syneFont = "font-[family-name:var(--font-syne)]";

export default function AddRecipePage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // File State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form State
  const [basicInfo, setBasicInfo] = useState({ title: "", description: "" });
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [instructions, setInstructions] = useState([{ text: "" }]);
  const [meta, setMeta] = useState({ category: "Food", difficulty: "Medium", tags: [] as string[] });

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // Handlers for dynamic arrays
  const addIngredient = () => setIngredients([...ingredients, { name: "", amount: "" }]);
  const removeIngredient = (idx: number) => setIngredients(ingredients.filter((_, i) => i !== idx));
  const updateIngredient = (idx: number, field: "name" | "amount", val: string) => {
    const newArr = [...ingredients];
    newArr[idx][field] = val;
    setIngredients(newArr);
  };

  const addInstruction = () => setInstructions([...instructions, { text: "" }]);
  const removeInstruction = (idx: number) => setInstructions(instructions.filter((_, i) => i !== idx));
  const updateInstruction = (idx: number, val: string) => {
    const newArr = [...instructions];
    newArr[idx].text = val;
    setInstructions(newArr);
  };
  const moveInstruction = (idx: number, direction: "up" | "down") => {
    if (direction === "up" && idx > 0) {
      const newArr = [...instructions];
      [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
      setInstructions(newArr);
    } else if (direction === "down" && idx < instructions.length - 1) {
      const newArr = [...instructions];
      [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
      setInstructions(newArr);
    }
  };

  const toggleTag = (tag: string) => {
    setMeta(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitRecipe = async (status: "Draft" | "Published") => {
    setIsSubmitting(true);
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      alert("You must be logged in to create a recipe.");
      setIsSubmitting(false);
      return;
    }

    // Default image if none provided
    let imgUrl = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80";

    if (imageFile) {
      setUploadingImage(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('recipes')
        .upload(filePath, imageFile);

      setUploadingImage(false);

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message + "\nMake sure you have created a public 'recipes' storage bucket.");
        setIsSubmitting(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('recipes').getPublicUrl(filePath);
      imgUrl = publicUrl;
    }

    const newRecipe = {
      user_id: session.user.id,
      title: basicInfo.title || "Untitled Recipe",
      description: basicInfo.description,
      category: meta.category,
      difficulty: meta.difficulty,
      status: status,
      time: "30 min", // You can add a time input field later
      img: imgUrl,
      ingredients: ingredients.filter(i => i.name.trim() !== ""),
      instructions: instructions.filter(i => i.text.trim() !== ""),
      tags: meta.tags,
    };

    const { error } = await supabase.from('recipes').insert([newRecipe]);

    if (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe: " + error.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    router.push("/dashboard/recipes");
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 lg:px-0">
      {/* Header & Progress */}
      <div className="mb-8 md:mb-10">
        <Link href="/dashboard/recipes" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F05A00] font-bold mb-4 md:mb-6 transition-colors">
          <ArrowLeft className="size-4" /> Back to recipes
        </Link>
        <h2 className={`${syneFont} text-3xl md:text-4xl font-bold text-[#2A120A] mb-6 md:mb-8`}>Create New Recipe</h2>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#F05A00] rounded-full z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-sm ${
                s < step ? "bg-[#F05A00] text-white" : s === step ? "bg-[#2A120A] text-white ring-4 ring-[#FFD9B8]" : "bg-white text-gray-400 border border-gray-200"
              }`}
            >
              {s < step ? <CheckCircle2 className="size-5" /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
          <span className={`w-10 ${step >= 1 ? "text-[#F05A00]" : ""}`}>Basic</span>
          <span className={`w-10 ${step >= 2 ? "text-[#F05A00]" : ""}`}>Ingred.</span>
          <span className={`w-10 ${step >= 3 ? "text-[#F05A00]" : ""}`}>Steps</span>
          <span className={`w-10 ${step >= 4 ? "text-[#F05A00]" : ""}`}>Details</span>
          <span className={`w-10 ${step >= 5 ? "text-[#F05A00]" : ""}`}>Preview</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 lg:p-12 shadow-sm border border-gray-100 min-h-[500px] relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-8`}>Basic Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#2A120A] mb-2">Recipe Title</label>
                  <input 
                    type="text" 
                    value={basicInfo.title}
                    onChange={(e) => setBasicInfo({...basicInfo, title: e.target.value})}
                    placeholder="e.g. Classic Chicken Katsu" 
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F05A00] focus:ring-4 focus:ring-[#FFD9B8]/50 outline-none transition-all text-xl font-bold text-[#2A120A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2A120A] mb-2">Description</label>
                  <textarea 
                    rows={4}
                    value={basicInfo.description}
                    onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
                    placeholder="Tell a story about this recipe..." 
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F05A00] focus:ring-4 focus:ring-[#FFD9B8]/50 outline-none transition-all font-medium text-[#2A120A] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2A120A] mb-2">Cover Image</label>
                  <label className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors group relative overflow-hidden h-64">
                    <input 
                      type="file" 
                      accept="image/svg+xml, image/png, image/jpeg, image/gif" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <UploadCloud className="size-8 text-[#F05A00]" />
                        </div>
                        <p className="font-bold text-[#2A120A]">Click to upload or drag & drop</p>
                        <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                      </>
                    )}
                  </label>
                  {imagePreview && (
                    <button 
                      onClick={() => { setImageFile(null); setImagePreview(null); }} 
                      className="mt-3 text-sm font-bold text-red-500 hover:underline inline-block"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Ingredients */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-8`}>Ingredients</h3>
              <div className="space-y-4">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-gray-50 p-2 rounded-xl">
                    <div className="w-8 flex justify-center text-gray-400 font-bold">{idx + 1}</div>
                    <input 
                      type="text" 
                      placeholder="e.g. Chicken breast" 
                      value={ing.name}
                      onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                      className="flex-1 bg-white px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#F05A00] font-medium"
                    />
                    <input 
                      type="text" 
                      placeholder="e.g. 500g" 
                      value={ing.amount}
                      onChange={(e) => updateIngredient(idx, "amount", e.target.value)}
                      className="w-32 bg-white px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#F05A00] font-medium"
                    />
                    <button onClick={() => removeIngredient(idx)} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                ))}
                
                <button onClick={addIngredient} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl font-bold text-gray-500 hover:text-[#F05A00] hover:border-[#F05A00] transition-colors flex items-center justify-center gap-2 mt-4">
                  <Plus className="size-5" /> Add another ingredient
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Instructions */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-8`}>Instructions</h3>
              <div className="space-y-6">
                {instructions.map((inst, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex gap-4 relative group">
                    <div className="flex flex-col gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveInstruction(idx, "up")} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><GripVertical className="size-4" /></button>
                      <div className="w-6 h-6 rounded-full bg-[#F05A00] text-white flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <textarea 
                        rows={3}
                        placeholder="Describe this step..." 
                        value={inst.text}
                        onChange={(e) => updateInstruction(idx, e.target.value)}
                        className="w-full bg-white px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F05A00] font-medium resize-none"
                      />
                      <button className="text-sm font-bold text-gray-500 hover:text-[#F05A00] flex items-center gap-1.5 transition-colors">
                        <ImageIcon className="size-4" /> Add image for this step
                      </button>
                    </div>
                    <button onClick={() => removeInstruction(idx)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                ))}
                
                <button onClick={addInstruction} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl font-bold text-gray-500 hover:text-[#F05A00] hover:border-[#F05A00] transition-colors flex items-center justify-center gap-2 mt-4">
                  <Plus className="size-5" /> Add another step
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Metadata */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A] mb-8`}>Tags & Details</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-[#2A120A] mb-3">Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Food", "Drink", "Dessert", "Healthy"].map(cat => (
                      <div 
                        key={cat} 
                        onClick={() => setMeta({...meta, category: cat})}
                        className={`cursor-pointer px-4 py-3 rounded-xl border-2 text-center font-bold transition-all ${
                          meta.category === cat ? "border-[#F05A00] bg-[#FFD9B8]/20 text-[#F05A00]" : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2A120A] mb-3">Difficulty</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Easy", "Medium", "Hard"].map(diff => (
                      <div 
                        key={diff} 
                        onClick={() => setMeta({...meta, difficulty: diff})}
                        className={`cursor-pointer px-2 py-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                          meta.difficulty === diff ? "border-[#2A120A] bg-[#2A120A] text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {diff}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 mt-4">
                  <label className="block text-sm font-semibold text-[#2A120A] mb-3">Popular Tags</label>
                  <div className="flex flex-wrap gap-3">
                    {["Quick Meal", "Vegan", "High Protein", "Breakfast", "Spicy", "Low Carb", "Oven Baked"].map(tag => {
                      const isSelected = meta.tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                            isSelected ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                          }`}
                        >
                          {isSelected && "✓ "}{tag}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Preview */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center justify-between mb-8">
                <h3 className={`${syneFont} text-2xl font-bold text-[#2A120A]`}>Review & Publish</h3>
              </div>
              
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                {imagePreview ? (
                  <div className="aspect-video rounded-2xl mb-6 overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 rounded-2xl mb-6 flex items-center justify-center text-gray-400">
                    <ImageIcon className="size-12 opacity-50" />
                  </div>
                )}
                
                <div className="flex gap-2 mb-4">
                  <span className="bg-[#FFD9B8] text-[#F05A00] px-3 py-1 rounded-full text-xs font-bold uppercase">{meta.category}</span>
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{meta.difficulty}</span>
                </div>
                
                <h1 className={`${syneFont} text-4xl font-bold text-[#2A120A] mb-4`}>
                  {basicInfo.title || "Untitled Recipe"}
                </h1>
                
                <p className="text-gray-600 text-lg mb-8">
                  {basicInfo.description || "No description provided."}
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="font-bold text-[#2A120A] text-xl mb-4">Ingredients</h4>
                    <ul className="space-y-3">
                      {ingredients.filter(i => i.name).map((ing, idx) => (
                        <li key={idx} className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-700 font-medium">{ing.name}</span>
                          <span className="text-[#F05A00] font-bold">{ing.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2A120A] text-xl mb-4">Steps ({instructions.filter(i => i.text).length})</h4>
                    <ul className="space-y-4">
                      {instructions.filter(i => i.text).slice(0, 3).map((inst, idx) => (
                        <li key={idx} className="flex gap-4">
                          <div className="font-bold text-[#F05A00]">0{idx + 1}</div>
                          <p className="text-gray-700">{inst.text}</p>
                        </li>
                      ))}
                      {instructions.length > 3 && (
                        <li className="text-gray-400 font-medium italic">...and more steps</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => submitRecipe("Draft")} 
                  disabled={isSubmitting}
                  className="flex-1 bg-white border-2 border-gray-200 text-[#2A120A] py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="size-5 animate-spin" />} Save as Draft
                </button>
                <button 
                  onClick={() => submitRecipe("Published")} 
                  disabled={isSubmitting || uploadingImage}
                  className="flex-1 bg-[#F05A00] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#d94f00] transition-colors shadow-xl shadow-[#F05A00]/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(isSubmitting || uploadingImage) ? <Loader2 className="size-5 animate-spin" /> : "Publish Recipe"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {step < 5 && (
        <div className="flex justify-between mt-8">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-0 transition-colors"
          >
            Back
          </button>
          
          <button 
            onClick={nextStep}
            className="bg-[#2A120A] text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold shadow-lg shadow-[#2A120A]/20 hover:bg-[#1a0a05] transition-colors flex items-center gap-2"
          >
            Next <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
