"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard/settings`,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <main className="min-h-screen flex selection:bg-[#F05A00] selection:text-white bg-white">
      
      {/* Left Column - Image & Branding */}
      <div className="hidden lg:flex flex-1 relative bg-[#110704] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1605224097491-168a25c1e958?auto=format&fit=crop&w=1200&q=80"
          alt="Aesthetic Coffee"
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
              Reset Your <br />Password.
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Don't worry, we'll help you get back into your kitchen. We'll send a reset link to your email.
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
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#F05A00] transition-colors mb-8">
              <ArrowLeft className="size-4" /> Back to log in
            </Link>

            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-3xl font-bold text-[#2A120A] mb-2">Forgot password?</h2>
                  <p className="text-gray-500 mb-10">No worries, we'll send you reset instructions.</p>

                  <form onSubmit={handleReset} className="space-y-6">
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

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#2A120A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a0a05] transition-colors mt-8 disabled:opacity-70"
                    >
                      {isLoading ? "Sending..." : "Reset Password"}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="size-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2A120A] mb-2">Check your email</h3>
                  <p className="text-gray-600 mb-8">
                    We sent a password reset link to <br/>
                    <span className="font-bold text-[#2A120A]">{email}</span>
                  </p>
                  <button 
                    onClick={() => setIsSent(false)}
                    className="text-[#F05A00] font-bold hover:underline"
                  >
                    Didn't receive the email? Click to resend
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
