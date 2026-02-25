"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Award, Loader2, Trash2, Edit, User, Calendar, ExternalLink, Filter, Sparkles, X, Zap } from "lucide-react";
import BadgeForm from "@/components/admin/BadgeForm";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAchievementsPage() {
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBadge, setEditingBadge] = useState<any | null>(null);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/achievements");
            const data = await res.json();
            setAchievements(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch achievements");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This award will be removed from history.")) return;
        try {
            await fetch(`/api/achievements/${id}`, { method: "DELETE" });
            fetchAchievements();
        } catch (error) {
            console.error("Deletion sequence terminated");
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        HALL OF <span className="text-gold">FAME</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Student Recognition • Achievement Protocol Management
                    </p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => {
                            setEditingBadge(null);
                            setShowForm(true);
                        }}
                        className="flex items-center justify-center space-x-3 px-8 py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black shadow-2xl shadow-gold/20 transition-all active:scale-95 group"
                    >
                        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                        <span className="uppercase tracking-widest text-xs">Issue Award</span>
                    </button>
                )}
            </div>

            {/* Achievement Hub */}
            <AnimatePresence mode="wait">
                {showForm ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#151515] rounded-[3rem] border border-gold/20 shadow-2xl p-10 max-w-4xl mx-auto relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                        <div className="flex items-center justify-between mb-12 relative">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
                                    {editingBadge ? "Modify Record" : "New Award Protocol"}
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowForm(false)}
                                className="h-10 w-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <BadgeForm
                            initialData={editingBadge}
                            onSuccess={() => {
                                setShowForm(false);
                                fetchAchievements();
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-12"
                    >
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <Loader2 className="h-12 w-12 text-gold animate-spin" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Synchronizing Records...</p>
                            </div>
                        ) : achievements.length === 0 ? (
                            <div className="py-24 text-center bg-[#151515] rounded-[3rem] border border-dashed border-white/5">
                                <div className="bg-white/5 h-20 w-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                                    <Award className="h-8 w-8 text-white/10" />
                                </div>
                                <h3 className="text-xl font-black text-white/40 uppercase italic">Hall Empty</h3>
                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2 max-w-sm mx-auto">
                                    No student achievements currently registered. Initiate a protocol above.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {achievements.map((badge, idx) => (
                                    <motion.div
                                        key={badge.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-8 hover:border-gold/30 transition-all group relative overflow-hidden shadow-2xl"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl pointer-events-none" />

                                        <div className="flex items-start justify-between mb-8">
                                            <div className="h-20 w-20 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-center shadow-xl group-hover:border-gold/20 transition-all p-4 relative">
                                                {badge.badgeUrl ? (
                                                    <img src={badge.badgeUrl} alt={badge.title} className="max-w-full max-h-full object-contain drop-shadow-[0_0_15px_rgba(193,153,61,0.2)]" />
                                                ) : (
                                                    <Award className="h-10 w-10 text-gold/40" />
                                                )}
                                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border border-black shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            </div>
                                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingBadge(badge);
                                                        setShowForm(true);
                                                    }}
                                                    className="p-3 bg-white/5 text-white/20 hover:text-gold hover:bg-gold/10 hover:border-gold/20 rounded-xl border border-white/5 transition-all"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(badge.id)}
                                                    className="p-3 bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 rounded-xl border border-white/5 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <h4 className="text-xl font-black text-white italic group-hover:text-gold transition-colors tracking-tight line-clamp-1">{badge.title}</h4>
                                        <div className="flex items-center justify-between mt-1 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <User className="h-3 w-3 text-gold/40" />
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] truncate">
                                                    DECORATED: <span className="text-white/60">{badge.user?.name || "REDACTED"}</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-1.5 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full">
                                                <Zap className="h-3 w-3 text-gold" />
                                                <span className="text-[9px] font-black text-gold uppercase tracking-tighter">{badge.points} XP</span>
                                            </div>
                                        </div>
                                        <p className="text-white/30 text-xs font-bold leading-relaxed line-clamp-2 h-10 group-hover:text-white/50 transition-colors">
                                            {badge.description || "Official BAFSK citation: No additional achievement description provided."}
                                        </p>

                                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-white/20">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                                                    {new Date(badge.dateAwarded).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                                <div className="h-1 w-1 bg-gold rounded-full animate-pulse" />
                                                <span className="text-[8px] font-black text-gold/60 uppercase tracking-widest italic">Verified Honor</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
