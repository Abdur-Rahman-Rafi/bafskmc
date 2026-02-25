"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ShieldCheck, User, Mail, Lock, Phone, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        studentClass: "",
        section: "",
        roll: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center py-16 px-4 font-sans">
            <div className="w-full max-w-xl space-y-0">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
                        <div className="h-14 w-14 bg-white/5 border border-gold/30 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(201,150,43,0.2)] group-hover:scale-110 transition-transform">
                            <img src="/logo.jpg" alt="BAFSKMC" className="h-full w-full object-cover" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-black text-lg tracking-tight italic">BAFSKMC</p>
                            <p className="text-gold/60 font-black text-[10px] uppercase tracking-[0.2em]">Math Club Portal</p>
                        </div>
                    </Link>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
                        Join The <span className="text-gold">Club</span>
                    </h1>
                    <p className="text-white/30 font-bold text-sm">Create your student account to access the portal.</p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

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

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Identity */}
                        <div className="space-y-5">
                            <div className="flex items-center space-x-3 mb-4">
                                <User className="h-4 w-4 text-gold/50" />
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Identity</span>
                                <div className="h-px bg-white/5 flex-1" />
                            </div>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                                />
                            </div>
                        </div>

                        {/* Security */}
                        <div className="space-y-5">
                            <div className="flex items-center space-x-3 mb-4">
                                <Lock className="h-4 w-4 text-gold/50" />
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Security</span>
                                <div className="h-px bg-white/5 flex-1" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Create Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                                />
                            </div>
                        </div>

                        {/* Academic (Optional) */}
                        <div className="space-y-5">
                            <div className="flex items-center space-x-3 mb-4">
                                <GraduationCap className="h-4 w-4 text-gold/50" />
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Academic Info</span>
                                <div className="h-px bg-white/5 flex-1" />
                                <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Optional</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <input
                                    name="studentClass"
                                    placeholder="Class"
                                    value={formData.studentClass}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm text-center"
                                />
                                <input
                                    name="section"
                                    placeholder="Section"
                                    value={formData.section}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm text-center"
                                />
                                <input
                                    name="roll"
                                    placeholder="Roll"
                                    value={formData.roll}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm text-center"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-gold/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center space-x-3 group mt-4"
                        >
                            <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            <span>{loading ? "Creating Account..." : "Create Account"}</span>
                        </button>
                    </form>

                    <p className="text-center text-white/30 text-sm font-bold mt-8">
                        Already a member?{" "}
                        <Link href="/login" className="text-gold hover:text-[#F0C040] font-black transition-colors underline-offset-4 underline">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
