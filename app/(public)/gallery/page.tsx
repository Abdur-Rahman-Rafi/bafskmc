"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Maximize2, Camera, X, Loader2, Calendar } from "lucide-react";
import Link from "next/link";

interface GalleryItem {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    date: string;
}

export default function GalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetch("/api/gallery")
            .then(res => res.json())
            .then(data => {
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];
    const filteredItems = filter === "All" ? items : items.filter(i => i.category === filter);

    return (
        <div className="min-h-screen pt-32 pb-28 px-4 bg-[#06080F] text-white relative overflow-hidden font-sans">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-sky-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16 md:mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(255,184,0,0.15)]">
                            <Camera className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-300 font-black text-[10px] uppercase tracking-[0.25em]">
                                Visual Archives
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase">
                            Visual <span className="text-gradient-gold">Archives</span>
                        </h1>
                        <p className="text-slate-300/80 font-medium text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
                            A chronological repository of BAFSK Math Club's most significant moments, competitions, and achievements.
                        </p>
                    </motion.div>

                    {/* Filter Pills */}
                    {!loading && items.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-wrap justify-center gap-2.5 pt-4"
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === cat
                                            ? "btn-gold shadow-lg"
                                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <Loader2 className="h-10 w-10 text-amber-400 animate-spin" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Visual Nodes...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-32 math-glass rounded-[2.5rem] border border-dashed border-white/10">
                        <Camera className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-300 uppercase tracking-tight">Vault Empty</h3>
                        <p className="text-xs text-slate-500 font-medium mt-2">No photographic assets have been archived yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative math-glass-card rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-amber-400/40 shadow-2xl transition-all"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden bg-black/60">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <button
                                            onClick={() => setSelectedImage(item.imageUrl)}
                                            className="btn-gold p-4 rounded-2xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-2xl"
                                        >
                                            <Maximize2 className="h-5 w-5 text-black" />
                                        </button>
                                    </div>

                                    <div className="absolute top-5 left-5">
                                        <span className="px-3.5 py-1.5 bg-black/80 backdrop-blur-md border border-amber-400/30 text-[10px] font-black uppercase tracking-wider text-amber-300 rounded-xl">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-7">
                                    <div className="flex items-center space-x-2 mb-2 text-slate-400 text-xs font-semibold">
                                        <Calendar className="h-3.5 w-3.5 text-amber-400" />
                                        <span>
                                            {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-white tracking-tight uppercase group-hover:text-amber-300 transition-colors leading-snug">
                                        {item.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Submit Section */}
                <div className="mt-32 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex flex-col items-center p-12 md:p-16 math-glass-card rounded-[3rem] border border-amber-400/20 shadow-2xl max-w-2xl mx-auto relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                        <div className="h-16 w-16 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 mb-6 border border-amber-400/20">
                            <ImageIcon className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">Want to Contribute?</h2>
                        <p className="text-slate-300/80 text-xs sm:text-sm font-medium mb-8 leading-relaxed max-w-lg">
                            Our gallery is a living archive. If you have high-quality photos from club events or competitions, submit them to our panel.
                        </p>
                        <Link href="/panel" className="btn-gold text-xs uppercase tracking-wider">
                            Contact Panel
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all">
                            <X className="h-6 w-6" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={selectedImage}
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl shadow-white/5"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
