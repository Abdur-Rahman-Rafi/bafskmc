"use client";
// Force new deployment: 2026-02-25 23:55

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, ShieldCheck, Mail, Lock, Shield, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";

function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState<"student" | "admin">("student");
    const router = useRouter();
    const searchParams = useSearchParams();
    const justRegistered = searchParams?.get("registered") === "true";
    const authError = searchParams?.get("error");

    useEffect(() => {
        if (authError === "CredentialsSignin") {
            setError("Invalid email or password. Please try again.");
        } else if (authError) {
            setError("Authentication failed. Please try again.");
        }
    }, [authError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    setError("Invalid email or password. Please try again.");
                } else if (result.error === "Configuration") {
                    setError("Server configuration error. Please contact admin.");
                } else {
                    setError("Authentication failed. Please check your credentials.");
                }
                setLoading(false);
            } else {
                // Hard redirect to clear any state and ensure middleware sees the cookie
                const targetUrl = loginType === "admin" ? "/admin" : "/dashboard";
                window.location.replace(targetUrl);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#06080F] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-amber-500/15 via-sky-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md space-y-0 relative z-10 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center space-x-3 mb-6 group cursor-pointer" onClick={() => router.push("/")}>
                        <div className="h-14 w-14 bg-amber-400/10 border border-amber-400/30 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(255,184,0,0.2)] group-hover:scale-105 transition-transform p-0.5">
                            <img src="/logo.jpg" alt="BAFSKMC" className="h-full w-full object-cover rounded-xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-black text-lg tracking-tight">BAFSKMC</p>
                            <p className="text-amber-400/80 font-black text-[10px] uppercase tracking-[0.25em]">Math Club Portal</p>
                        </div>
                    </div>

                    {justRegistered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        >
                            ✓ Account created successfully! Sign in below.
                        </motion.div>
                    )}

                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase mb-2">
                        Sign <span className="text-gradient-gold">In</span>
                    </h1>
                    <p className="text-slate-400 font-medium text-xs sm:text-sm">Access the BAFSKMC Math Club Arena & Portal.</p>
                </motion.div>

                {/* Login Type Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="flex gap-3 mb-6"
                >
                    <button
                        onClick={() => setLoginType("student")}
                        className={`flex-1 flex items-center justify-center space-x-2.5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${loginType === "student"
                            ? "btn-gold shadow-lg"
                            : "math-glass text-slate-400 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        <GraduationCap className="h-4 w-4" />
                        <span>Student</span>
                    </button>
                    <button
                        onClick={() => setLoginType("admin")}
                        className={`flex-1 flex items-center justify-center space-x-2.5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${loginType === "admin"
                            ? "btn-gold shadow-lg"
                            : "math-glass text-slate-400 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        <Shield className="h-4 w-4" />
                        <span>Admin</span>
                    </button>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="math-glass-card rounded-[2.5rem] border border-white/10 shadow-2xl p-8 sm:p-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 blur-[100px] pointer-events-none" />

                    {loginType === "admin" && (
                        <div className="flex items-center space-x-3 mb-6 p-3.5 bg-amber-400/10 border border-amber-400/25 rounded-2xl">
                            <Shield className="h-4 w-4 text-amber-400 flex-shrink-0" />
                            <p className="text-amber-300 text-xs font-bold uppercase tracking-wider">Administrator Access Mode</p>
                        </div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-500 text-sm font-bold"
                        >
                            <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                            <input
                                type="email"
                                required
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#0A0E1A]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all font-semibold placeholder:text-slate-500 text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#0A0E1A]/80 border border-white/10 rounded-2xl text-white outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all font-semibold placeholder:text-slate-500 text-sm"
                            />
                        </div>

                        <div className="flex justify-end pt-1">
                            <Link href="/forgot-password" className="text-slate-400 hover:text-amber-300 text-xs font-semibold uppercase tracking-wider transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 btn-gold text-xs uppercase tracking-[0.2em] shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2.5 group mt-3"
                        >
                            <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
                        </button>
                    </form>

                    {loginType === "student" && (
                        <p className="text-center text-slate-400 text-xs font-medium mt-6">
                            New to BAFSKMC?{" "}
                            <Link href="/register" className="text-amber-400 hover:text-amber-300 font-bold transition-colors underline-offset-4 underline">
                                Create Account
                            </Link>
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#06080F] flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
