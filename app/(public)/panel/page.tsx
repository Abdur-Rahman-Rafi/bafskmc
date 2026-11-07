"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Loader2, Facebook } from "lucide-react";
import Link from "next/link";

interface Member {
    id: string;
    name: string;
    position: string;
    image: string | null;
    bio: string | null;
    session: string | null;
    fbId: string | null;
    priority: number;
}

export default function PanelPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/members?type=PANEL")
            .then((res) => res.json())
            .then((data) => {
                setMembers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#06080F] min-h-screen pt-24 pb-20 relative overflow-hidden">
            {/* Background ambient orbs */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 sm:mb-20">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(255,184,0,0.15)]">
                        <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse" />
                        <span className="text-amber-400 font-black text-[10px] uppercase tracking-[0.3em]">Leadership Council</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white mb-5 tracking-tight">
                        Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shimmer">Panel</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Meet the dedicated minds leading the BAFSK Math Club towards national dominance, Olympiad victories, and intellectual innovation.
                    </p>
                </div>

                {/* Trendy Apply Recruitment Banner */}
                <div className="relative rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 mb-16 sm:mb-20 overflow-hidden border border-amber-400/30 bg-gradient-to-r from-[#1E1B18] via-[#0F172A] to-[#0A0F1D] shadow-[0_12px_45px_rgba(255,184,0,0.15)] flex flex-col md:flex-row items-center justify-between gap-6 group">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
                    
                    <div className="text-center md:text-left relative z-10 max-w-xl">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-3">
                            <span>Open Recruitment</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                            Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">Panel Member</span>
                        </h2>
                        <p className="text-gray-300 text-sm font-medium leading-relaxed">
                            Steer the club towards excellence, organize workshops, lead Olympiad contingents, and make your mark.
                        </p>
                    </div>

                    <Link 
                        href="/apply-panel" 
                        className="relative z-10 shrink-0 btn-gold px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:scale-105 transition-all shadow-xl shadow-amber-500/20"
                    >
                        <span>Apply For Panel</span>
                        <span className="text-base">→</span>
                    </Link>
                </div>

                {members.length === 0 ? (
                    <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 p-8">
                        <Shield className="h-16 w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">The panel list is currently being finalized.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {members.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="math-glass-card rounded-3xl sm:rounded-[2rem] overflow-hidden group relative flex flex-col justify-between"
                            >
                                <div className="aspect-[4/3] bg-black/40 relative overflow-hidden">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-amber-400/20 bg-slate-900">
                                            <User className="h-20 w-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-transparent to-transparent opacity-90" />
                                    {member.bio && (
                                        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-black/80 backdrop-blur-md border-t border-white/10">
                                            <p className="text-white/90 text-xs font-medium line-clamp-3 leading-relaxed">{member.bio}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 sm:p-7 relative">
                                    <h3 className="text-xl sm:text-2xl font-black text-white mb-1 group-hover:text-amber-300 transition-colors tracking-tight line-clamp-1">{member.name}</h3>
                                    <p className="text-amber-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 line-clamp-1">{member.position}</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        {member.session ? (
                                            <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-gray-400 border border-white/10 uppercase tracking-widest">
                                                Session {member.session}
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Executive</span>
                                        )}
                                        {member.fbId && (
                                            <a
                                                href={`https://facebook.com/${member.fbId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/20 text-blue-400 transition-all hover:scale-110"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <Facebook className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
