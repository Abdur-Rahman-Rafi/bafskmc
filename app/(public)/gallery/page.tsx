"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Maximize2, Camera } from "lucide-react";

export default function GalleryPage() {
    const images = [
        { id: 1, title: "Math Olympiad 2023", category: "Events", color: "bg-blue-100" },
        { id: 2, title: "Workshop on Calculus", category: "Workshops", color: "bg-emerald-100" },
        { id: 3, title: "Club Inauguration", category: "Community", color: "bg-amber-100" },
        { id: 4, title: "Strategy Session", category: "Planning", color: "bg-indigo-100" },
        { id: 5, title: "Prize Giving Ceremony", category: "Events", color: "bg-rose-100" },
        { id: 6, title: "Group Study Session", category: "Academic", color: "bg-cyan-100" },
    ];

    return (
        <div className="bg-slate-50 min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Memories & Gallery</h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Relive the best moments of BAFSK Math Club through our visual history.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {images.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all"
                        >
                            <div className={`aspect-[4/3] ${img.color} flex items-center justify-center relative overflow-hidden`}>
                                <ImageIcon className="h-12 w-12 text-slate-300 group-hover:scale-110 transition-transform duration-500" />

                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white cursor-pointer hover:scale-110 transition-transform">
                                        <Maximize2 className="h-6 w-6" />
                                    </div>
                                </div>

                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/80 backdrop-blur-sm shadow-sm rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">
                                        {img.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center space-x-2 text-slate-400 mb-1">
                                    <Camera className="h-3 w-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">March 15, 2024</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">{img.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex flex-col items-center p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm max-w-xl mx-auto">
                        <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <Camera className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Have photos to share?</h3>
                        <p className="text-slate-500 text-sm font-medium mb-8">
                            Our gallery is a community-driven collection. If you have photos from club events, send them to our executive panel!
                        </p>
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95">
                            Submit Photos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
