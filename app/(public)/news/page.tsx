"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface NewsItem {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    author: { name: string };
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/news")
            .then((res) => res.json())
            .then((data) => {
                setNews(Array.isArray(data) ? data : []);
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
        <div className="bg-[#0D0D0D] min-h-screen pt-20 pb-20 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-3 mb-6 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full">
                        <span className="h-2 w-2 bg-gold rounded-full animate-pulse" />
                        <span className="text-gold font-black text-[10px] uppercase tracking-[0.2em]">BAFSK Newsroom</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">Latest <span className="gold-text">Updates</span></h1>
                    <p className="text-lg text-white/40 font-medium max-w-2xl mx-auto uppercase tracking-widest text-xs">
                        Stay connected with the mathematical pulse of the club.
                    </p>
                </div>

                {news.length === 0 ? (
                    <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <div className="text-4xl mb-4 opacity-50">📰</div>
                        <p className="text-white/30 font-bold uppercase tracking-widest text-xs">No entries found in the archives.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item, idx) => (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#151515] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all group"
                            >
                                <div className="h-48 bg-gradient-to-br from-[#1A1A1A] to-[#111111] border-b border-white/5 relative overflow-hidden flex items-end">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <h3 className="text-xl font-black text-white line-clamp-2 relative z-10 px-8 pb-6 group-hover:text-gold transition-colors">{item.title}</h3>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center space-x-4 text-xs font-black text-white/30 uppercase tracking-widest mb-6">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-3.5 w-3.5 text-gold" />
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <User className="h-3.5 w-3.5 text-gold" />
                                            <span>{item.author.name}</span>
                                        </div>
                                    </div>
                                    <p className="text-white/50 font-medium mb-8 line-clamp-3 leading-relaxed">
                                        {item.content}
                                    </p>
                                    <Link
                                        href={`/news/${item.id}`}
                                        className="inline-flex items-center space-x-2 text-gold font-black group-hover:text-[#F0C040] transition-colors uppercase text-[10px] tracking-widest"
                                    >
                                        <span>Read Full Story</span>
                                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
