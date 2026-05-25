"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setSuccessMsg(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <main className="min-h-screen flex selection:bg-[#F05A00] selection:text-white bg-white">
      
      {/* Left Column - Image & Branding */}
      <div className="hidden lg:flex flex-1 relative bg-[#110704] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80"
          alt="Cooking Ingredients"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110704] via-[#110704]/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 h-full">
          <Link href="/" className="font-[family-name:var(--font-syne)] text-3xl font-bold text-white">
            ShoofEats.
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-[family-name:var(--font-syne)] text-5xl font-bold text-white mb-6 leading-tight">
              Start Your <br />Culinary Journey.
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Join thousands of food lovers. Organize your recipes, plan meals, and discover endless inspiration.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden mb-12">
            <Link href="/" className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[#F05A00]">
              ShoofEats.
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-[#2A120A] mb-2">Create an account</h2>
            <p className="text-gray-500 mb-10">Start building your personal cookbook today.</p>

            <form onSubmit={handleRegister} className="space-y-5">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="size-5" />
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="size-5" />
                  Success! Redirecting to login...
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-[#2A120A] mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F05A00] focus:ring-4 focus:ring-[#FFD9B8]/50 outline-none transition-all text-[#2A120A] font-medium"
                  placeholder="Luthfi Rafif"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2A120A] mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F05A00] focus:ring-4 focus:ring-[#FFD9B8]/50 outline-none transition-all text-[#2A120A] font-medium"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2A120A] mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F05A00] focus:ring-4 focus:ring-[#FFD9B8]/50 outline-none transition-all text-[#2A120A] font-medium"
                  placeholder="Create a strong password"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2A120A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a0a05] transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-70"
              >
                {isLoading ? "Creating account..." : "Sign up"} 
                {!isLoading && <ArrowRight className="size-5" />}
              </motion.button>
            </form>

            <p className="text-center mt-10 text-gray-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-[#F05A00] font-bold hover:underline">
                Log in here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
