"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, User, Loader2, ArrowLeft, Search, Zap, Crown } from "lucide-react";
import Link from "next/link";

interface LeaderboardUser {
    id: string;
    name: string;
    image: string | null;
    class: string | null;
    roll: string | null;
    totalPoints: number;
}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("/api/leaderboard")
            .then(res => res.json())
            .then(data => {
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const top3 = filteredUsers.slice(0, 3);
    const rest = filteredUsers.slice(3);

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard"
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-gold transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                            GLOBAL <span className="text-gold">RANKINGS</span>
                        </h1>
                        <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 pl-0.5">
                            Top Performers • BAFSKMC Hall of Fame
                        </p>
                    </div>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search student..."
                        className="w-full pl-12 pr-6 py-4 bg-[#151515] border border-white/5 rounded-2xl text-white text-xs font-bold outline-none focus:border-gold/30 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="h-12 w-12 text-gold animate-spin" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Calculating Ranks...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="py-24 text-center bg-[#151515] rounded-[3rem] border border-dashed border-white/5">
                    <Trophy className="h-16 w-16 text-white/5 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-white/40 uppercase italic">No Match Found</h3>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2 max-w-sm mx-auto">
                        We couldn't find any students matching your search criteria.
                    </p>
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Top 3 Podium */}
                    {searchQuery === "" && top3.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto pt-10">
                            {/* 2nd Place */}
                            {top3[1] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="order-2 md:order-1 h-full"
                                >
                                    <div className="bg-[#151515] border border-white/5 rounded-[3rem] p-8 text-center relative group hover:border-white/20 transition-all flex flex-col items-center">
                                        <div className="h-24 w-24 rounded-3xl border-4 border-slate-400/50 overflow-hidden mb-6 relative z-10 shadow-2xl">
                                            {top3[1].image ? (
                                                <img src={top3[1].image} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-slate-400/10 flex items-center justify-center text-slate-400 font-black text-2xl uppercase">
                                                    {top3[1].name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute top-4 left-4 h-10 w-10 bg-slate-400 rounded-xl flex items-center justify-center text-black font-black text-lg skew-x-[-10deg]">2</div>
                                        <h3 className="text-white font-black text-xl tracking-tight italic mb-2">{top3[1].name}</h3>
                                        <div className="px-4 py-2 bg-slate-400/10 border border-slate-400/20 rounded-xl text-slate-400 font-black text-xs tracking-tighter italic">
                                            {top3[1].totalPoints} XP
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 1st Place */}
                            {top3[0] && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="order-1 md:order-2 h-full"
                                >
                                    <div className="bg-[#151515] border border-gold/40 rounded-[3rem] p-10 text-center relative group shadow-[0_0_50px_rgba(201,150,43,0.1)] -mt-10 flex flex-col items-center">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                            <Crown className="h-16 w-16 text-gold drop-shadow-[0_0_15px_rgba(201,150,43,0.5)]" />
                                        </div>
                                        <div className="h-32 w-32 rounded-[2.5rem] border-4 border-gold overflow-hidden mb-6 relative z-10 shadow-2xl">
                                            {top3[0].image ? (
                                                <img src={top3[0].image} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-gold/10 flex items-center justify-center text-gold font-black text-3xl uppercase">
                                                    {top3[0].name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-white font-black text-2xl tracking-tight italic mb-2 group-hover:text-gold transition-colors">{top3[0].name}</h3>
                                        <div className="px-6 py-3 bg-gold/10 border border-gold/20 rounded-2xl text-gold font-black text-sm tracking-tighter italic shadow-xl">
                                            {top3[0].totalPoints} XP
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 3rd Place */}
                            {top3[2] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="order-3 h-full"
                                >
                                    <div className="bg-[#151515] border border-white/5 rounded-[3rem] p-8 text-center relative group hover:border-white/20 transition-all flex flex-col items-center">
                                        <div className="h-20 w-20 rounded-3xl border-4 border-amber-700/50 overflow-hidden mb-6 relative z-10 shadow-2xl">
                                            {top3[2].image ? (
                                                <img src={top3[2].image} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-amber-700/10 flex items-center justify-center text-amber-700 font-black text-xl uppercase">
                                                    {top3[2].name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute top-4 left-4 h-10 w-10 bg-amber-700 rounded-xl flex items-center justify-center text-black font-black text-lg skew-x-[-10deg]">3</div>
                                        <h3 className="text-white font-black text-lg tracking-tight italic mb-2">{top3[2].name}</h3>
                                        <div className="px-4 py-2 bg-amber-700/10 border border-amber-700/20 rounded-xl text-amber-700 font-black text-xs tracking-tighter italic">
                                            {top3[2].totalPoints} XP
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Rankings Table */}
                    <div className="max-w-5xl mx-auto bg-[#151515] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-12 p-8 border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                            <div className="col-span-1 text-center">Rank</div>
                            <div className="col-span-8 md:col-span-7 pl-6">Participant</div>
                            <div className="hidden md:block col-span-2 text-center">Academic</div>
                            <div className="col-span-3 md:col-span-2 text-right">Points</div>
                        </div>

                        <div className="divide-y divide-white/[0.03]">
                            {(searchQuery === "" ? rest : filteredUsers).map((user, idx) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="grid grid-cols-12 p-8 items-center group hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="col-span-1 text-center">
                                        <span className="text-sm font-black text-white/40 italic">{(searchQuery === "" ? 4 + idx : 1 + idx)}</span>
                                    </div>
                                    <div className="col-span-8 md:col-span-7 flex items-center space-x-6 pl-6">
                                        <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 group-hover:border-gold/30 transition-all flex-shrink-0">
                                            {user.image ? (
                                                <img src={user.image} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-white/5 flex items-center justify-center text-white/30 font-black text-xs uppercase">
                                                    {user.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-white tracking-tight group-hover:text-gold transition-colors">{user.name}</p>
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Academic Vanguard</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block col-span-2 text-center">
                                        {user.class && (
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                Class {user.class} {user.roll && `• Roll ${user.roll}`}
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-span-3 md:col-span-2 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-black text-white tracking-tighter italic">{user.totalPoints}</span>
                                            <span className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Global XP</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
