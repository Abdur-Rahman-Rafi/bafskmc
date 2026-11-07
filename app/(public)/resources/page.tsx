"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Search, Tag, Loader2 } from "lucide-react";

interface Resource {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    imageUrl?: string | null;
    category: string;
    createdAt: string;
}

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/api/resources")
            .then((res) => res.json())
            .then((data) => {
                setResources(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredResources = resources.filter(res =>
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#080C14] text-white min-h-screen pt-24 sm:pt-28 pb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-[9px] sm:text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-4 sm:mb-6">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Academic Repository</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">
                        Study <span className="shimmer text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">Resources</span>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Download previous year questions, formula sheets, Olympiad materials, and curated problem sets.
                    </p>
                </div>

                <div className="mb-10 sm:mb-12 relative max-w-xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search topics, categories, or keywords..."
                        className="w-full pl-11 sm:pl-14 pr-4 py-3.5 sm:py-4 bg-[#151515] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-semibold text-white placeholder:text-gray-500 text-sm shadow-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredResources.length === 0 ? (
                    <div className="text-center py-16 sm:py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 p-6">
                        <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold text-sm">No resources found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                        {filteredResources.map((res, idx) => (
                            <motion.div
                                key={res.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="bg-[#151515] p-5 sm:p-7 rounded-3xl border border-white/10 shadow-xl hover:border-gold/30 transition-all group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="p-3 sm:p-3.5 bg-gold/10 rounded-2xl text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                                            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <div className="flex items-center space-x-1.5 px-3 py-1 bg-white/5 border border-white/10 text-gold text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">
                                            <Tag className="h-3 w-3" />
                                            <span>{res.category}</span>
                                        </div>
                                    </div>

                                    {res.imageUrl && (
                                        <div className="mb-5 rounded-2xl overflow-hidden aspect-video border border-white/10 bg-black/40">
                                            <img src={res.imageUrl} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}

                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">{res.title}</h3>
                                    <p className="text-gray-400 font-medium text-xs sm:text-sm line-clamp-3 mb-6 leading-relaxed">
                                        {res.description || "Comprehensive material designed to help you master mathematical concepts."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-2">
                                    <span className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                        {new Date(res.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <a
                                        href={res.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 bg-gradient-to-r from-gold to-[#F0C040] text-black px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-95 transition-all active:scale-95 shadow-md shadow-gold/20"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Download</span>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
