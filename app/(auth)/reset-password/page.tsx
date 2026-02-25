"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Loader2, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, XCircle } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [tokenEmail, setTokenEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    // Validate token on mount
    useEffect(() => {
        if (!token) {
            setValidating(false);
            setTokenValid(false);
            return;
        }

        fetch(`/api/auth/reset-password?token=${token}`)
            .then(res => res.json())
            .then(data => {
                setTokenValid(data.valid);
                if (data.email) setTokenEmail(data.email);
            })
            .catch(() => setTokenValid(false))
            .finally(() => setValidating(false));
    }, [token]);

    const passwordsMatch = password === confirmPassword;
    const passwordStrong = password.length >= 8;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch || !passwordStrong) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to reset password");
            } else {
                setSuccess(true);
                setTimeout(() => router.push("/login?reset=success"), 3000);
            }
        } catch {
            setError("Network error. Please try again.");
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

            <div className="w-full max-w-md relative z-10">
                {/* Loading token validation */}
                {validating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-12 text-center shadow-2xl"
                    >
                        <Loader2 className="h-10 w-10 text-gold animate-spin mx-auto mb-4" />
                        <p className="text-white/30 font-black text-xs uppercase tracking-widest">Validating reset link...</p>
                    </motion.div>
                )}

                {/* Invalid / Expired token */}
                {!validating && !tokenValid && !success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#151515] border border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl text-center"
                    >
                        <div className="mx-auto h-20 w-20 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] flex items-center justify-center mb-6">
                            <XCircle className="h-9 w-9 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tighter italic mb-3">Link Expired</h2>
                        <p className="text-white/30 text-sm font-medium leading-relaxed mb-8">
                            This password reset link is invalid or has expired. Links are only valid for 1 hour.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center space-x-2 px-8 py-4 bg-gold hover:bg-[#F0C040] text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                        >
                            <span>Request New Link</span>
                        </Link>
                    </motion.div>
                )}

                {/* Success state */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#151515] border border-emerald-500/20 rounded-[2.5rem] p-10 shadow-2xl text-center"
                    >
                        <div className="mx-auto h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] flex items-center justify-center mb-6">
                            <CheckCircle className="h-9 w-9 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tighter italic mb-3">Password Updated!</h2>
                        <p className="text-white/30 text-sm font-medium leading-relaxed mb-2">
                            Your password has been successfully reset.
                        </p>
                        <p className="text-white/20 text-xs font-black uppercase tracking-widest">
                            Redirecting to login...
                        </p>
                        <div className="mt-6">
                            <Loader2 className="h-5 w-5 text-gold animate-spin mx-auto" />
                        </div>
                    </motion.div>
                )}

                {/* Reset form */}
                {!validating && tokenValid && !success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl shadow-black/60"
                    >
                        {/* Icon + Title */}
                        <div className="text-center mb-10">
                            <div className="mx-auto h-20 w-20 bg-gold/10 border border-gold/20 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-gold/5">
                                <ShieldCheck className="text-gold h-9 w-9" />
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tighter italic">
                                Set New Password
                            </h1>
                            {tokenEmail && (
                                <p className="mt-2 text-xs text-gold/60 font-black tracking-widest uppercase">
                                    {tokenEmail}
                                </p>
                            )}
                            <p className="mt-3 text-sm text-white/30 font-medium leading-relaxed">
                                Choose a strong password for your account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* New Password */}
                            <div>
                                <label className="block text-[9px] font-black text-white/20 uppercase tracking-[0.25em] mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-white/20" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                        className="block w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/15 outline-none focus:border-gold/50 transition-all font-bold text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/20 hover:text-white/50 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {password && !passwordStrong && (
                                    <p className="mt-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                                        Password must be at least 8 characters
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-[9px] font-black text-white/20 uppercase tracking-[0.25em] mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-white/20" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat your password"
                                        className={`block w-full pl-12 pr-5 py-4 bg-white/[0.03] border rounded-2xl text-white placeholder:text-white/15 outline-none transition-all font-bold text-sm ${confirmPassword && !passwordsMatch
                                                ? "border-red-500/40 focus:border-red-500/60"
                                                : confirmPassword && passwordsMatch
                                                    ? "border-emerald-500/40 focus:border-emerald-500/60"
                                                    : "border-white/10 focus:border-gold/50"
                                            }`}
                                    />
                                    {confirmPassword && (
                                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
                                            {passwordsMatch
                                                ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                                                : <AlertCircle className="h-4 w-4 text-red-400" />
                                            }
                                        </div>
                                    )}
                                </div>
                                {confirmPassword && !passwordsMatch && (
                                    <p className="mt-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                                        Passwords do not match
                                    </p>
                                )}
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
                                disabled={loading || !passwordsMatch || !passwordStrong}
                                className="w-full flex items-center justify-center py-4 px-6 bg-gold hover:bg-[#F0C040] text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 disabled:opacity-40 shadow-xl shadow-gold/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Updating Password...
                                    </>
                                ) : "Update Password"}
                            </button>
                        </form>

                        <div className="text-center pt-8">
                            <Link href="/login" className="inline-flex items-center space-x-2 text-xs font-black text-white/20 hover:text-white/60 uppercase tracking-widest transition-colors">
                                <ArrowLeft className="h-3 w-3" />
                                <span>Back to Login</span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
