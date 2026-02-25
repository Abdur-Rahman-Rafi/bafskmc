"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, ArrowLeft, Mail, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
            } else {
                setSent(true);
            }
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#080808] px-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <AnimatePresence mode="wait">
                    {!sent ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl shadow-black/60"
                        >
                            {/* Icon + Title */}
                            <div className="text-center mb-10">
                                <div className="mx-auto h-20 w-20 bg-gold/10 border border-gold/20 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-gold/5">
                                    <KeyRound className="text-gold h-9 w-9" />
                                </div>
                                <h1 className="text-3xl font-black text-white tracking-tighter italic">
                                    Forgot Password?
                                </h1>
                                <p className="mt-3 text-sm text-white/30 font-medium leading-relaxed max-w-xs mx-auto">
                                    Enter your registered email and we'll dispatch a secure reset link.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-[9px] font-black text-white/20 uppercase tracking-[0.25em] mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-white/20" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="block w-full pl-12 pr-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/15 outline-none focus:border-gold/50 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl"
                                        >
                                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-red-400 text-xs font-bold">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center py-4 px-6 bg-gold hover:bg-[#F0C040] text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-gold/20"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Dispatching Link...
                                        </>
                                    ) : "Send Reset Link"}
                                </button>
                            </form>

                            <div className="text-center pt-8">
                                <Link href="/login" className="inline-flex items-center space-x-2 text-xs font-black text-white/20 hover:text-white/60 uppercase tracking-widest transition-colors">
                                    <ArrowLeft className="h-3 w-3" />
                                    <span>Back to Login</span>
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#151515] border border-gold/20 rounded-[2.5rem] p-10 shadow-2xl shadow-black/60 text-center"
                        >
                            <div className="mx-auto h-20 w-20 bg-gold/10 border border-gold/20 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl">
                                <ShieldCheck className="h-9 w-9 text-gold" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tighter italic mb-3">
                                Manual Reset Required
                            </h2>
                            <p className="text-white/40 text-sm font-medium leading-relaxed mb-6">
                                To ensure maximum security, automated password recovery is currently disabled.
                            </p>

                            <div className="bg-gold/5 border border-gold/10 rounded-2xl p-6 mb-8 text-center space-y-3">
                                <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Next Step</p>
                                <p className="text-sm text-white font-bold leading-relaxed">
                                    Please contact a <span className="text-gold">Math Club Panel Member</span> or an <span className="text-gold">Administrator</span> to manually update your password.
                                </p>
                            </div>

                            <div className="mt-6">
                                <Link href="/login" className="inline-flex items-center space-x-2 text-xs font-black text-white/20 hover:text-white/60 uppercase tracking-widest transition-colors">
                                    <ArrowLeft className="h-3 w-3" />
                                    <span>Back to Login</span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
