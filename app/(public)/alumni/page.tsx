"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    GraduationCap,
    Loader2,
    Facebook,
    Search,
    Award,
    Sparkles,
    Briefcase
} from "lucide-react";
import MathBackground from "@/components/MathBackground";

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

export default function AlumniPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSession, setSelectedSession] = useState<string>("ALL");

    useEffect(() => {
        fetch("/api/members?type=ALUMNI")
            .then((res) => res.json())
            .then((data) => {
                setMembers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Extract unique sessions
    const sessionList = useMemo(() => {
        const set = new Set<string>();
        members.forEach((m) => {
            if (m.session) set.add(m.session.trim());
        });
        return Array.from(set).sort().reverse();
    }, [members]);

    const filtered = useMemo(() => {
        return members.filter((m) => {
            const matchesSearch =
                m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (m.session && m.session.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesSession = selectedSession === "ALL" || m.session?.trim() === selectedSession;
            return matchesSearch && matchesSession;
        });
    }, [members, searchTerm, selectedSession]);

    return (
        <div className="bg-[#06080F] text-white min-h-screen pt-28 pb-28 relative overflow-hidden font-sans">
            <MathBackground />

            {/* Ambient Lighting Orbs */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-sky-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(255,184,0,0.15)]">
                            <GraduationCap className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-300 font-black text-[10px] uppercase tracking-[0.3em]">
                                Alumni Association
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight uppercase">
                            Honoring Our <span className="text-gradient-gold">Alumni</span>
                        </h1>

                        <p className="text-slate-300/80 text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                            Connecting graduates, scholars, and former leadership who laid the foundation for mathematical brilliance at BAF Shaheen College Kurmitola.
                        </p>
                    </motion.div>
                </div>

                {/* Filter and Search Hub */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 math-glass-card p-4 md:p-6 rounded-[2rem] border border-white/10 shadow-2xl"
                >
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                        <input
                            type="text"
                            placeholder="Search alumni by name, role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-[#0A0E1A]/80 border border-white/10 rounded-2xl outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 text-sm font-semibold text-white placeholder:text-slate-500 transition-all"
                        />
                    </div>

                    {sessionList.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                            <button
                                onClick={() => setSelectedSession("ALL")}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${selectedSession === "ALL"
                                    ? "btn-gold shadow-lg"
                                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                                    }`}
                            >
                                All Sessions
                            </button>
                            {sessionList.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSession(s)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${selectedSession === s
                                        ? "btn-gold shadow-lg"
                                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                                        }`}
                                >
                                    Session {s}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-10 w-10 text-amber-400 animate-spin" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            Accessing Alumni Directory...
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 bg-slate-900/40 rounded-[2.5rem] border border-dashed border-white/10 p-8">
                        <GraduationCap className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-300 uppercase tracking-tight">Alumni Archive Empty</h3>
                        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                            No alumni found matching your query. The alumni directory is updated on an ongoing basis.
                        </p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence>
                            {filtered.map((member, idx) => (
                                <motion.div
                                    key={member.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="math-glass-card rounded-[2.5rem] p-7 text-center relative overflow-hidden flex flex-col justify-between group"
                                >
                                    {/* Ambient top aura */}
                                    <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-500" />

                                    <div>
                                        {/* Avatar / Photo */}
                                        <div className="h-28 w-28 rounded-full mx-auto mb-6 p-1 bg-gradient-to-tr from-amber-500/40 via-yellow-200/20 to-sky-400/30 group-hover:from-amber-400 group-hover:to-yellow-200 transition-all duration-500 shadow-xl">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-black/60 relative">
                                                {member.image ? (
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-amber-300 font-black text-3xl">
                                                        {member.name ? member.name.charAt(0) : "A"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Name & Position */}
                                        <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors tracking-tight line-clamp-1 mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400/90 mb-4 line-clamp-1">
                                            {member.position}
                                        </p>

                                        {/* Bio if available */}
                                        {member.bio && (
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-3 mb-6 px-2">
                                                {member.bio}
                                            </p>
                                        )}
                                    </div>

                                    {/* Session Badge & Social */}
                                    <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                            {member.session ? `Session ${member.session}` : "Alumnus"}
                                        </span>

                                        {member.fbId ? (
                                            <a
                                                href={`https://facebook.com/${member.fbId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={`${member.name} on Facebook`}
                                                className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all"
                                            >
                                                <Facebook className="h-3.5 w-3.5" />
                                            </a>
                                        ) : (
                                            <span />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
