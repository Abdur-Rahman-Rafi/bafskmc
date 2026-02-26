"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Maximize2, Camera, X, Loader2, Calendar } from "lucide-react";

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
        <div className="min-h-screen pt-32 pb-20 px-4" style={{ backgroundColor: "#0D0D0D" }}>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
                            VISUAL <span className="text-gold shimmer">ARCHIVES</span>
                        </h1>
                        <p className="text-white/40 font-bold uppercase text-xs tracking-[0.3em] mt-6 max-w-2xl mx-auto">
                            A CHRONOLOGICAL REPOSITORY OF BAFSK MATH CLUB'S MOST SIGNIFICANT MOMENTS & ACHIEVEMENTS.
                        </p>
                    </motion.div>

                    {/* Filter Pills */}
                    {!loading && items.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-wrap justify-center gap-3 pt-4"
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat
                                            ? "bg-gold text-black shadow-lg shadow-gold/20"
                                            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5"
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
                        <Loader2 className="h-10 w-10 text-gold animate-spin" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Accessing Visual Nodes...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-40 bg-white/[0.02] rounded-[4rem] border border-dashed border-white/5">
                        <Camera className="h-20 w-20 text-white/5 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-white/20 uppercase italic tracking-tighter">Vault Empty</h3>
                        <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest mt-2">No photographic assets have been archived yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-white/[0.02] rounded-[3rem] overflow-hidden border border-white/5 hover:border-gold/30 shadow-2xl transition-all"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                        <button
                                            onClick={() => setSelectedImage(item.imageUrl)}
                                            className="bg-gold text-black p-5 rounded-3xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl"
                                        >
                                            <Maximize2 className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="absolute top-8 left-8">
                                        <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-gold rounded-xl">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 md:p-10">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <Calendar className="h-3 w-3 text-gold/40" />
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                            {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase group-hover:text-gold transition-colors leading-[1.1]">
                                        {item.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Submit Section */}
                <div className="mt-40 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex flex-col items-center p-16 md:p-24 bg-white/[0.02] rounded-[4rem] border border-white/5 shadow-2xl max-w-2xl mx-auto relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                        <div className="h-20 w-20 bg-gold/10 rounded-[2rem] flex items-center justify-center text-gold mb-8 border border-gold/20">
                            <ImageIcon className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">WANT TO CONTRIBUTE?</h2>
                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">
                            OUr gallery is a living archive. If you have high-quality photos from club events, please submit them for moderation.
                        </p>
                        <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold transition-all active:scale-95 shadow-xl">
                            CONTACT PANEL
                        </button>
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
