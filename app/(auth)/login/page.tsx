"use client";

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
            // Use native redirect for maximum reliability in production
            await signIn("credentials", {
                email,
                password,
                callbackUrl: loginType === "admin" ? "/admin" : "/dashboard",
                redirect: true,
            });
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md space-y-0">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center space-x-3 mb-8 group cursor-pointer" onClick={() => router.push("/")}>
                        <div className="h-14 w-14 bg-white/5 border border-gold/30 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(201,150,43,0.2)] group-hover:scale-110 transition-transform">
                            <img src="/logo.jpg" alt="BAFSKMC" className="h-full w-full object-cover" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-black text-lg tracking-tight italic">BAFSKMC</p>
                            <p className="text-gold/60 font-black text-[10px] uppercase tracking-[0.2em]">Math Club Portal</p>
                        </div>
                    </div>

                    {justRegistered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-bold"
                        >
                            ✓ Account created successfully! Sign in below.
                        </motion.div>
                    )}

                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
                        Sign <span className="text-gold">In</span>
                    </h1>
                    <p className="text-white/30 font-bold text-sm">Access the BAFSKMC Math Club Portal.</p>
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
                        className={`flex-1 flex items-center justify-center space-x-3 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${loginType === "student"
                            ? "bg-gold text-black shadow-xl shadow-gold/20"
                            : "bg-white/5 text-white/30 border border-white/5 hover:border-white/10"
                            }`}
                    >
                        <GraduationCap className="h-4 w-4" />
                        <span>Student</span>
                    </button>
                    <button
                        onClick={() => setLoginType("admin")}
                        className={`flex-1 flex items-center justify-center space-x-3 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${loginType === "admin"
                            ? "bg-gold text-black shadow-xl shadow-gold/20"
                            : "bg-white/5 text-white/30 border border-white/5 hover:border-white/10"
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
                    className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                    {loginType === "admin" && (
                        <div className="flex items-center space-x-3 mb-8 p-4 bg-gold/10 border border-gold/20 rounded-2xl">
                            <Shield className="h-4 w-4 text-gold flex-shrink-0" />
                            <p className="text-gold text-xs font-black uppercase tracking-widest">Administrator Access Mode</p>
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <input
                                type="email"
                                required
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-white/30 hover:text-gold text-xs font-bold uppercase tracking-widest transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-gold/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center space-x-3 group mt-2"
                        >
                            <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            <span>{loading ? "Authenticating..." : "Sign In"}</span>
                        </button>
                    </form>

                    {loginType === "student" && (
                        <p className="text-center text-white/20 text-sm font-bold mt-8">
                            New to BAFSKMC?{" "}
                            <Link href="/register" className="text-gold hover:text-[#F0C040] font-black transition-colors underline-offset-4 underline">
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
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
