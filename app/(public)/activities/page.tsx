"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Calendar, Users, MapPin, Loader2, ArrowRight, Layers, FileText, Paperclip, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Activity {
    id: string;
    title: string;
    description: string | null;
    category: string;
    date: string;
    location: string | null;
    coverUrl: string | null;
    files: any;
}

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/activities")
            .then((res) => res.json())
            .then((data) => {
                setActivities(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Accessing Activity Nexus...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#06080F] min-h-screen pt-28 sm:pt-32 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 -right-32 w-96 h-96 bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 sm:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-5 backdrop-blur-md shadow-[0_0_20px_rgba(255,184,0,0.15)]"
                    >
                        <Zap className="h-3.5 w-3.5 text-amber-400" />
                        <span>Operations Hub</span>
                    </motion.div>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-5 tracking-tighter uppercase">
                        ACTIVITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shimmer">NEXUS</span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
                        From strategic workshops to national Olympiads — track deployments, achievements, and club missions in real-time.
                    </p>
                </div>

                {activities.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="math-glass-card p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />
                            <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-amber-400 mb-8 group-hover:scale-110 transition-transform">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 uppercase tracking-tight">Upcoming Competitions</h3>
                            <p className="text-gray-400 font-medium leading-relaxed mb-8 text-xs sm:text-sm">
                                Our strategic planning department is currently finalizing the next major deployment. Standard Olympiad training remains active.
                            </p>
                            <div className="inline-flex items-center space-x-2.5 text-[10px] font-black text-amber-400/70 uppercase tracking-widest bg-amber-400/5 px-3.5 py-1.5 rounded-full border border-amber-400/20">
                                <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse" />
                                <span>Status: Preparing Deployment</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] text-black overflow-hidden relative shadow-2xl shadow-amber-500/20 flex flex-col justify-between"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Users className="h-44 w-44 text-black" />
                            </div>
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-black mb-3 uppercase tracking-tight">Weekly Workshops</h3>
                                <p className="text-black/80 font-bold leading-relaxed mb-8 text-xs sm:text-sm">
                                    Join the elite circle every Wednesday for intensive problem-solving sessions, combinatorics, and advanced cognitive training.
                                </p>
                            </div>
                            <div className="flex items-center justify-between relative z-10 pt-4 border-t border-black/10">
                                <span className="text-xs font-black uppercase tracking-wider text-black">Active Circles</span>
                                <span className="px-3.5 py-1 rounded-full bg-black text-amber-300 text-[10px] font-black uppercase tracking-widest shadow-md">
                                    50+ Members
                                </span>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <AnimatePresence>
                            {activities.map((activity, idx) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="math-glass-card rounded-3xl sm:rounded-[2rem] overflow-hidden group relative flex flex-col justify-between"
                                >
                                    <div className="h-52 w-full bg-black/40 relative overflow-hidden">
                                        {activity.coverUrl ? (
                                            <img src={activity.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-transparent">
                                                <Zap className="h-12 w-12 text-amber-400/30 group-hover:text-amber-400 transition-colors" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-black/70 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                                                {activity.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors mb-4 tracking-tight line-clamp-2 leading-snug">{activity.title}</h3>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center text-white/40 space-x-3">
                                                <Calendar className="h-4 w-4 text-gold/60" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                                    {new Date(activity.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            {activity.location && (
                                                <div className="flex items-center text-white/40 space-x-3">
                                                    <MapPin className="h-4 w-4 text-gold/60" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] truncate">{activity.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-white/30 text-xs font-medium leading-relaxed line-clamp-3 mb-8 border-l-2 border-white/5 pl-4 flex-1">
                                            {activity.description || "System Log: No tactical description provided for this specific event deployment."}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                        <div className="flex items-center space-x-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                            <Paperclip className="h-3 w-3" />
                                            <span>{(activity.files as any[])?.length || 0} Assets</span>
                                        </div>
                                        <Link
                                            href={`/activities/${activity.id}`}
                                            className="flex items-center space-x-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:text-black hover:bg-gold hover:border-gold transition-all group/link"
                                        >
                                            <span>Details</span>
                                            <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                )}

                <div className="mt-24">
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-[4rem] p-12 lg:p-24 border border-gold/10 relative overflow-hidden shadow-2xl group">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-[600px] w-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-gold/10 transition-colors duration-700"></div>
                        <div className="max-w-3xl relative z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="h-20 w-20 bg-gold/10 rounded-[2rem] border border-gold/20 flex items-center justify-center text-gold mb-12 shadow-2xl shadow-gold/10"
                            >
                                <ExternalLink className="h-8 w-8" />
                            </motion.div>
                            <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter uppercase leading-tight">Got a challenge for our <span className="text-gold">Personnel</span>?</h2>
                            <p className="text-white/40 text-lg font-medium mb-12 max-w-xl uppercase tracking-widest text-xs leading-loose">
                                We are always seeking high-level collaborations and strategic partnerships. If you are an organizer or academic body, let's initiate protocol.
                            </p>
                            <a 
                                href="mailto:bafsk.mathclub@gmail.com"
                                className="inline-block bg-gold text-black px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#F0C040] hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-gold/20"
                            >
                                Initiate Communication
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
