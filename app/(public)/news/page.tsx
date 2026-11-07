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
    fileUrl?: string;
    type: "ARTICLE" | "NOTICE";
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

    const articles = news.filter(n => n.type === "ARTICLE");
    const notices = news.filter(n => n.type === "NOTICE");

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#06080F]">
                <Loader2 className="h-10 w-10 text-amber-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#06080F] min-h-screen pt-28 pb-28 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-amber-500/15 via-sky-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-amber-500/10 via-sky-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center space-x-3 mb-6 px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-400/30 rounded-full shadow-[0_0_20px_rgba(255,184,0,0.15)]">
                        <span className="h-2 w-2 bg-amber-400 rounded-full animate-pulse" />
                        <span className="text-amber-300 font-black text-[10px] uppercase tracking-[0.25em]">BAFSK Newsroom & Dispatch</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight uppercase">Latest <span className="text-gradient-gold">Updates</span></h1>
                    <p className="text-slate-300/80 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
                        Stay connected with the mathematical pulse, competitive announcements, and strategic dispatches of the club.
                    </p>
                </div>

                <div className="space-y-24">
                    {/* News Section */}
                    <section>
                        <div className="flex items-center space-x-6 mb-12">
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                                FEATURED <span className="text-gradient-gold">ARTICLES</span>
                            </h2>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        {articles.length === 0 ? (
                            <div className="text-center py-20 math-glass rounded-[2.5rem] border border-dashed border-white/10">
                                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">No news articles found in the archive.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {articles.map((item, idx) => (
                                    <motion.article
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="math-glass-card rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-amber-400/40 hover:shadow-[0_0_40px_rgba(255,184,0,0.15)] transition-all group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="h-52 bg-[#0A0E1A] relative overflow-hidden flex items-end">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-sky-500/10 to-transparent blur-2xl" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/50 to-transparent" />
                                                <h3 className="text-xl font-black text-white line-clamp-2 relative z-10 px-8 pb-5 group-hover:text-amber-300 transition-colors tracking-tight uppercase leading-[1.1]">{item.title}</h3>
                                            </div>
                                            <div className="p-8 pt-4">
                                                <div className="flex items-center space-x-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                                    <div className="flex items-center space-x-1.5">
                                                        <Calendar className="h-3 w-3 text-amber-400" />
                                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1.5">
                                                        <User className="h-3 w-3 text-amber-400" />
                                                        <span>{item.author.name}</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-300/80 font-medium mb-6 line-clamp-3 leading-relaxed text-sm">
                                                    {item.content}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-8 pt-0">
                                            <Link
                                                href={`/news/${item.id}`}
                                                className="inline-flex items-center space-x-2 text-amber-400 font-black group-hover:text-amber-300 transition-all uppercase text-xs tracking-wider"
                                            >
                                                <span>Read Analysis</span>
                                                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Notice Section */}
                    <section id="notices">
                        <div className="flex items-center space-x-6 mb-12">
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                                OFFICIAL <span className="text-gradient-gold">NOTICES</span>
                            </h2>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        {notices.length === 0 ? (
                            <div className="text-center py-20 math-glass rounded-[2.5rem] border border-dashed border-white/10">
                                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">No active notices broadcasted.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {notices.map((item, idx) => (
                                    <motion.article
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + idx * 0.1 }}
                                        className="math-glass-card p-8 rounded-[2.5rem] border border-white/10 hover:border-amber-400/40 shadow-xl hover:shadow-[0_0_30px_rgba(255,184,0,0.15)] transition-all group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="h-12 w-12 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-400/20 text-lg">
                                                    📢
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">Priority Notice</p>
                                                    <p className="text-[10px] font-black text-amber-300 uppercase tracking-wider mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-black text-white mb-3 line-clamp-2 uppercase tracking-tight group-hover:text-amber-300 transition-colors">{item.title}</h3>

                                            <p className="text-slate-300/80 text-xs font-medium leading-relaxed line-clamp-3 mb-8">
                                                {item.content}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/news/${item.id}`}
                                            className="w-full py-3.5 btn-glass flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
                                        >
                                            <span>View Notice Protocol</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </motion.article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
