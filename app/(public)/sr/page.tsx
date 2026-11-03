"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Search,
    GraduationCap,
    Facebook,
    Loader2,
    Sparkles,
    Shield,
    BookOpen
} from "lucide-react";
import MathBackground from "@/components/MathBackground";

interface SectionRep {
    id: string;
    name: string;
    section: string;
    class: string;
    image: string | null;
    priority: number;
    fbId?: string | null;
    createdAt?: string;
}

export default function SectionRepresentativesPage() {
    const [reps, setReps] = useState<SectionRep[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState<string>("ALL");

    useEffect(() => {
        fetch("/api/sr")
            .then((res) => res.json())
            .then((data) => {
                setReps(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Extract unique classes for filter pills
    const classList = useMemo(() => {
        const set = new Set<string>();
        reps.forEach((r) => {
            if (r.class) set.add(r.class.trim());
        });
        return Array.from(set).sort();
    }, [reps]);

    // Filter by search and selected class
    const filteredReps = useMemo(() => {
        return reps.filter((r) => {
            const matchesSearch =
                r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.class.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesClass = selectedClass === "ALL" || r.class.trim() === selectedClass;
            return matchesSearch && matchesClass;
        });
    }, [reps, searchTerm, selectedClass]);

    return (
        <div className="min-h-screen bg-[#080C14] text-white pt-24 pb-28 relative overflow-hidden font-sans">
            <MathBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(240,192,64,0.15)]">
                            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
                                Classroom Ambassadors
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
                            Section <span className="shimmer text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">Representatives</span>
                        </h1>

                        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            Meet the dedicated Section Representatives (SRs) bridging their classrooms with the BAFSK Math Club — promoting workshops, competitions, and peer problem-solving.
                        </p>
                    </motion.div>
                </div>

                {/* Filter & Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/60 p-4 md:p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl"
                >
                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, class, section..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-amber-400/50 text-sm font-semibold text-white placeholder:text-gray-500 transition-all"
                        />
                    </div>

                    {/* Class Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                        <button
                            onClick={() => setSelectedClass("ALL")}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${selectedClass === "ALL"
                                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20"
                                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            All Classes
                        </button>
                        {classList.map((c) => (
                            <button
                                key={c}
                                onClick={() => setSelectedClass(c)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${selectedClass === c
                                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20"
                                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-10 w-10 text-amber-400 animate-spin" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            Accessing Section Representative Directory...
                        </p>
                    </div>
                ) : filteredReps.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-24 bg-slate-900/40 rounded-[2.5rem] border border-dashed border-white/10 p-8">
                        <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-300 uppercase tracking-tight">No Representatives Found</h3>
                        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                            No section representatives matched your current query or filter. Try selecting another class or clearing your search.
                        </p>
                    </div>
                ) : (
                    /* Grid of SRs */
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7"
                    >
                        <AnimatePresence>
                            {filteredReps.map((sr, idx) => (
                                <motion.div
                                    key={sr.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                                    className="math-glass-card rounded-[2rem] p-6 relative overflow-hidden flex flex-col group"
                                >
                                    {/* Ambient card aura */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />

                                    {/* Image / Portrait Frame */}
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-5 bg-black/50 border border-white/10 group-hover:border-amber-400/30 transition-all">
                                        {sr.image ? (
                                            <img
                                                src={sr.image}
                                                alt={sr.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                                                <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 font-black text-2xl shadow-inner">
                                                    {sr.name ? sr.name.charAt(0).toUpperCase() : "S"}
                                                </div>
                                            </div>
                                        )}

                                        {/* Class & Section overlay pill */}
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                                                {sr.class}
                                            </span>
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/80 text-sky-300 border border-sky-400/30 backdrop-blur-md">
                                                Sec: {sr.section}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Name & Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-400/80 mb-1">
                                                <Shield className="h-3 w-3" />
                                                <span>Section Representative</span>
                                            </div>
                                            <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors tracking-tight line-clamp-1">
                                                {sr.name}
                                            </h3>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5">
                                                <BookOpen className="h-3.5 w-3.5 text-amber-400/60" />
                                                <span>{sr.class} • {sr.section}</span>
                                            </div>

                                            {sr.fbId && (
                                                <a
                                                    href={`https://facebook.com/${sr.fbId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={`${sr.name} on Facebook`}
                                                    className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all"
                                                >
                                                    <Facebook className="h-3.5 w-3.5" />
                                                </a>
                                            )}
                                        </div>
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
