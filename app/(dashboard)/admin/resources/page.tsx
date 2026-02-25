"use client";

import { useEffect, useState } from "react";
import { Plus, Search, FileText, Loader2, Trash2, Edit, BookOpen, ExternalLink, Filter, FolderClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminResourcesPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/resources");
            const data = await res.json();
            setResources(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch resources");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This intellectual asset will be removed.")) return;
        try {
            await fetch(`/api/resources/${id}`, { method: "DELETE" });
            fetchResources();
        } catch (error) {
            console.error("Deletion sequence terminated");
        }
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        KNOWLEDGE <span className="text-gold">VAULT</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Academic Asset Management • Student Resources
                    </p>
                </div>
                <Link
                    href="/admin/resources/new"
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black shadow-2xl shadow-gold/20 transition-all active:scale-95 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Upload Asset</span>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#151515] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="SEARCH ASSETS BY NAME OR CATEGORY..."
                        className="w-full pl-14 pr-6 py-4 bg-[#0D0D0D] border border-white/5 rounded-2xl outline-none focus:border-gold/30 transition-all text-sm font-bold text-white placeholder:text-white/10 uppercase tracking-widest"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center space-x-3 px-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-gold hover:border-gold/20 transition-all">
                    <Filter className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol Filters</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="h-10 w-10 text-gold animate-spin" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Accessing Vault Data...</p>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="py-24 text-center bg-[#151515] rounded-[3rem] border border-dashed border-white/5">
                    <div className="bg-white/5 h-20 w-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                        <FolderClosed className="h-8 w-8 text-white/20" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 italic">Vault Empty</h3>
                    <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto">
                        No intellectual assets found matching your current search parameters.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredResources.map((resource, idx) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-8 hover:border-gold/30 transition-all group relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl pointer-events-none" />

                            <div className="flex items-start justify-between mb-6">
                                <div className="h-16 w-16 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center shadow-lg relative overflow-hidden group-hover:border-gold/20 transition-all">
                                    {resource.imageUrl ? (
                                        <img src={resource.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                                    ) : (
                                        <FileText className="h-8 w-8 text-gold group-hover:scale-110 transition-transform" />
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/admin/resources/edit?id=${resource.id}`}
                                        className="p-3 bg-white/5 text-white/20 hover:text-gold hover:bg-gold/10 hover:border-gold/20 rounded-xl border border-white/5 transition-all shadow-xl"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(resource.id)}
                                        className="p-3 bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 rounded-xl border border-white/5 transition-all shadow-xl"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <h4 className="text-xl font-black text-white group-hover:text-gold transition-colors mb-2 italic tracking-tight">{resource.title}</h4>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="px-2.5 py-1 bg-gold/10 border border-gold/20 rounded-md text-[9px] font-black text-gold uppercase tracking-[0.15em]">
                                    {resource.category}
                                </span>
                            </div>
                            <p className="text-white/40 text-xs font-bold leading-relaxed line-clamp-2 mb-6 h-10 group-hover:text-white/60 transition-colors">
                                {resource.description || "System protocol: No description provided for this intellectual asset."}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="flex items-center space-x-2">
                                    <BookOpen className="h-3 w-3 text-white/10" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                        {new Date(resource.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <a
                                    href={resource.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-gold text-[10px] font-black uppercase tracking-widest hover:text-white transition-all group/link"
                                >
                                    <span>Access Asset</span>
                                    <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
