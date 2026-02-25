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
        <div className="bg-[#0D0D0D] min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-6"
                    >
                        <Zap className="h-3 w-3" />
                        <span>Operations Hub</span>
                    </motion.div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter italic uppercase">
                        ACITIVITY <span className="text-gold">NEXUS</span>
                    </h1>
                    <p className="text-white/40 font-bold max-w-2xl mx-auto leading-relaxed text-sm uppercase tracking-widest">
                        From strategic workshops to national olympiads — track every deployment and event in real-time.
                    </p>
                </div>

                {activities.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#151515] p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />
                            <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gold/40 mb-10 group-hover:text-gold transition-colors">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tight">Upcoming Competitions</h3>
                            <p className="text-white/30 font-medium leading-relaxed mb-12 uppercase text-[10px] tracking-[0.2em]">
                                Our strategic planning department is currently finalizing the next major deployment. Standard protocols remain active.
                            </p>
                            <div className="inline-flex items-center space-x-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                <span className="h-1.5 w-1.5 bg-white/10 rounded-full"></span>
                                <span>Status: Preparing Deployment</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gold p-12 rounded-[3rem] text-black overflow-hidden relative shadow-2xl shadow-gold/20"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                <Users className="h-48 w-48 text-black" />
                            </div>
                            <h3 className="text-3xl font-black mb-4 italic uppercase tracking-tight">Weekly Workshops</h3>
                            <p className="text-black/60 font-medium leading-relaxed mb-12 uppercase text-[10px] tracking-[0.1em]">
                                Join the elite circle every Wednesday for intensive problem-solving sessions and advanced cognitive training.
                            </p>
                            <div className="flex items-center space-x-6 relative z-10">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-12 w-12 rounded-2xl border-2 border-gold bg-black/20 backdrop-blur-md flex items-center justify-center">
                                            <span className="text-[8px] font-black text-white">ID_{i}</span>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-black uppercase tracking-widest">50+ Active Personnel</span>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence>
                            {activities.map((activity, idx) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-[#151515] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden group hover:border-gold/30 transition-all relative flex flex-col"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />

                                    <div className="h-56 w-full bg-[#0D0D0D] relative overflow-hidden">
                                        {activity.coverUrl ? (
                                            <img src={activity.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/5 to-transparent">
                                                <Zap className="h-12 w-12 text-gold/10 group-hover:text-gold/30 transition-colors" />
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6">
                                            <span className="px-4 py-2 bg-gold text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-gold/20">
                                                {activity.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-black text-white group-hover:text-gold transition-colors mb-6 italic tracking-tight">{activity.title}</h3>

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

                                        <p className="text-white/30 text-xs font-medium leading-relaxed italic line-clamp-3 mb-8 border-l-2 border-white/5 pl-4 flex-1">
                                            {activity.description || "System Log: No tactical description provided for this specific event deployment."}
                                        </p>

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
                            <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter italic uppercase leading-tight">Got a challenge for our <span className="text-gold">Personnel</span>?</h2>
                            <p className="text-white/40 text-lg font-medium mb-12 max-w-xl uppercase tracking-widest text-xs leading-loose">
                                We are always seeking high-level collaborations and strategic partnerships. If you are an organizer or academic body, let's initiate protocol.
                            </p>
                            <button className="bg-gold text-black px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-gold-light hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-gold/20">
                                Initiate Communication
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
