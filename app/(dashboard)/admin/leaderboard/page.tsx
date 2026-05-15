"use client";

import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff, Edit, Trophy, ShieldAlert, Check, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserRank {
    id: string;
    name: string;
    image: string | null;
    class: string | null;
    roll: string | null;
    totalPoints: number;
}

export default function AdminLeaderboardPage() {
    const [users, setUsers] = useState<UserRank[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [newPoints, setNewPoints] = useState<number>(0);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch users (temporarily bypassing hidden check to get all for admin)
            // Wait, we need to fetch from a different endpoint or just standard API that returns all.
            // Let's create an admin specific get or just use achievements/users.
            // Actually, we can fetch all users with their points directly from an admin API if needed, 
            // but let's just make the fetch here to `/api/leaderboard` with an admin param or create a new route.
            const [usersRes, configRes] = await Promise.all([
                fetch("/api/admin/leaderboard/users"),
                fetch("/api/admin/leaderboard/config")
            ]);
            
            const usersData = await usersRes.json();
            const configData = await configRes.json();
            
            setUsers(Array.isArray(usersData) ? usersData : []);
            setIsVisible(configData.visible);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibility = async () => {
        setProcessing(true);
        try {
            const newVis = !isVisible;
            await fetch("/api/admin/leaderboard/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visible: newVis })
            });
            setIsVisible(newVis);
        } finally {
            setProcessing(false);
        }
    };

    const handleSavePoints = async (userId: string) => {
        setProcessing(true);
        try {
            await fetch("/api/admin/leaderboard/adjust", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newTotalPoints: newPoints })
            });
            setEditingUserId(null);
            fetchData();
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-12 pb-20">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                        LEADERBOARD <span className="text-gold">CONTROL</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Rankings Management • Points Adjustment
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleVisibility}
                        disabled={processing}
                        className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-black transition-all ${
                            isVisible 
                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" 
                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20"
                        }`}
                    >
                        {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : (isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />)}
                        <span className="uppercase tracking-widest text-xs">{isVisible ? "Hide Leaderboard" : "Publish Leaderboard"}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
                <ShieldAlert className="h-6 w-6 text-gold shrink-0 mt-1" />
                <div>
                    <h3 className="text-white font-bold text-lg">System Status</h3>
                    <p className="text-white/40 text-sm mt-1">
                        The leaderboard is currently {isVisible ? <span className="text-emerald-500 font-bold">VISIBLE</span> : <span className="text-red-500 font-bold">HIDDEN</span>} to students. 
                        You can manually override a student's total XP here. This will automatically generate a background achievement to adjust their rating.
                    </p>
                </div>
            </div>

            <div className="relative w-full max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <input
                    type="text"
                    placeholder="Search student..."
                    className="w-full pl-12 pr-6 py-4 bg-[#151515] border border-white/5 rounded-2xl text-white text-xs font-bold outline-none focus:border-gold/30 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="h-12 w-12 text-gold animate-spin" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Loading Registry...</p>
                </div>
            ) : (
                <div className="bg-[#151515] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-12 p-8 border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-7 pl-6">Participant</div>
                        <div className="col-span-4 text-right pr-4">Total XP / Action</div>
                    </div>

                    <div className="divide-y divide-white/[0.03]">
                        {filteredUsers.map((user, idx) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-12 p-6 items-center group hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="col-span-1 text-center">
                                    <span className="text-sm font-black text-white/40">{idx + 1}</span>
                                </div>
                                <div className="col-span-7 flex items-center space-x-6 pl-6">
                                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-gold/30 transition-all flex-shrink-0">
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
                                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">
                                            {user.class ? `Class ${user.class}` : "Unknown"} {user.roll ? `• Roll ${user.roll}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-4 flex justify-end pr-4">
                                    {editingUserId === user.id ? (
                                        <div className="flex items-center space-x-2">
                                            <input 
                                                type="number" 
                                                value={newPoints}
                                                onChange={(e) => setNewPoints(parseInt(e.target.value) || 0)}
                                                className="w-24 px-3 py-2 bg-black border border-gold/30 rounded-lg text-white font-bold outline-none text-right"
                                                autoFocus
                                            />
                                            <button 
                                                onClick={() => handleSavePoints(user.id)}
                                                disabled={processing}
                                                className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg hover:bg-emerald-500/30 transition-all"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => setEditingUserId(null)}
                                                disabled={processing}
                                                className="p-2 bg-white/5 text-white/40 rounded-lg hover:text-white transition-all"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-4">
                                            <span className="text-xl font-black text-white tracking-tighter">{user.totalPoints} <span className="text-[10px] text-gold/60">XP</span></span>
                                            <button
                                                onClick={() => {
                                                    setEditingUserId(user.id);
                                                    setNewPoints(user.totalPoints);
                                                }}
                                                className="p-2 bg-white/5 text-white/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
