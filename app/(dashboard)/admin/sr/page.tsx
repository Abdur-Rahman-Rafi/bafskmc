"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    Shield,
    BookOpen,
    Facebook,
    Hash,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionRep } from "@/app/api/sr/route";

export default function AdminSRManagementPage() {
    const [reps, setReps] = useState<SectionRep[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchReps = () => {
        setLoading(true);
        fetch("/api/sr", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => {
                setReps(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchReps();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove SR ${name}? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/sr/${id}`, { method: "DELETE" });
            if (res.ok) {
                setReps(reps.filter((r) => r.id !== id));
            } else {
                alert("Failed to delete SR.");
            }
        } catch {
            alert("Network error deleting SR.");
        }
    };

    const filtered = reps.filter(
        (r) =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-24">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                        SECTION <span className="text-gold">REPRESENTATIVES</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Classroom Ambassador Network • SR Registry Control
                    </p>
                </div>
                <Link
                    href="/admin/sr/new"
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black shadow-2xl shadow-gold/20 transition-all active:scale-95 group w-full md:w-auto"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Register New SR</span>
                </Link>
            </div>

            {/* Content Hub */}
            <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
                {/* Search / Filter Bar */}
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME, CLASS, OR SECTION..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-[#0D0D0D] border border-white/5 rounded-2xl outline-none focus:border-gold/40 transition-all text-xs font-black uppercase text-white placeholder:text-white/20 tracking-wider"
                        />
                    </div>
                    <div className="text-xs font-mono text-white/40 font-bold px-2">
                        Total Registered: <span className="text-gold">{reps.length}</span> SRs
                    </div>
                </div>

                {/* Table or Loading */}
                <div className="p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-28 space-y-4">
                            <Loader2 className="h-10 w-10 text-gold animate-spin" />
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                Accessing SR Registry...
                            </p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-24 bg-[#0D0D0D]/40 rounded-[2.5rem] border border-dashed border-white/5 p-8">
                            <Users className="h-16 w-16 text-white/10 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-white/40 uppercase">No SR Records Found</h3>
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2">
                                Click &apos;Register New SR&apos; to add representatives to the club database.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((sr, idx) => (
                                <motion.div
                                    key={sr.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="bg-[#0D0D0D] border border-white/5 rounded-[2rem] p-6 hover:border-gold/30 transition-all group relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                                {sr.image ? (
                                                    <img
                                                        src={sr.image}
                                                        alt={sr.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gold/40 font-black text-xl">
                                                        {sr.name ? sr.name.charAt(0) : "S"}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-white group-hover:text-gold transition-colors tracking-tight line-clamp-1">
                                                    {sr.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gold/10 text-gold border border-gold/20">
                                                        {sr.class}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                                        Sec: {sr.section}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1 shrink-0">
                                            <Link
                                                href={`/admin/sr/edit/${sr.id}`}
                                                className="p-2.5 bg-white/5 text-white/30 hover:text-gold hover:bg-gold/10 rounded-xl transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(sr.id, sr.name)}
                                                className="p-2.5 bg-white/5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/30 font-medium">
                                        <span className="flex items-center gap-1 font-mono text-[10px]">
                                            <Hash className="h-3 w-3 text-gold/40" />
                                            Priority: {sr.priority}
                                        </span>
                                        {sr.fbId && (
                                            <span className="text-[10px] text-blue-400/70 font-mono">
                                                FB: {sr.fbId}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
