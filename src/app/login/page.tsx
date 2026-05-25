"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setShowToast(true);
    
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh(); // Ensure middleware state is updated
    }, 1500);
  };

  return (
    <main className="min-h-screen flex selection:bg-[#F05A00] selection:text-white bg-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-0 left-1/2 z-50 bg-white/90 backdrop-blur-md shadow-2xl border border-gray-100 px-6 py-4 rounded-2xl flex items-center gap-3"
          >
            <div className="bg-green-100 p-1 rounded-full text-green-600">
              <CheckCircle2 className="size-5" />
            </div>
            <p className="font-bold text-[#2A120A]">Welcome back, Luthfi 👋</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Column - Image & Branding */}
      <div className="hidden lg:flex flex-1 relative bg-[#110704] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
          alt="Cooking Workspace"
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
              Welcome Back to<br />ShoofEats.
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Cook smarter, save better. Access your personal cookbook and discover new flavors tailored for you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
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
            <h2 className="text-3xl font-bold text-[#2A120A] mb-2">Log in</h2>
            <p className="text-gray-500 mb-10">Enter your details to access your dashboard.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="size-5" />
                  {errorMsg}
                </div>
              )}
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-[#2A120A]">Password</label>
                  <Link href="/forgot-password" className="text-sm font-bold text-[#F05A00] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F05A00] focus:ring-4 focus:ring-[#FFD9B8]/50 outline-none transition-all text-[#2A120A] font-medium"
                  placeholder="••••••••"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2A120A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a0a05] transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-70"
              >
                {isLoading ? "Signing in..." : "Sign in"} 
                {!isLoading && <ArrowRight className="size-5" />}
              </motion.button>
            </form>

            <p className="text-center mt-10 text-gray-500 font-medium">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#F05A00] font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
