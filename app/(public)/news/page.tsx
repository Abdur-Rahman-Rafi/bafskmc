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

                <div className="space-y-24">
                    {/* News Section */}
                    <section>
                        <div className="flex items-center space-x-6 mb-12">
                            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
                                FEATURED <span className="text-gold">ARTICLES</span>
                            </h2>
                            <div className="h-px bg-white/5 flex-1" />
                        </div>

                        {articles.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-[3.5rem] border border-dashed border-white/10">
                                <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">No news articles found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {articles.map((item, idx) => (
                                    <motion.article
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-[#151515] rounded-[3rem] overflow-hidden border border-white/5 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all group"
                                    >
                                        <div className="h-48 bg-[#0D0D0D] relative overflow-hidden flex items-end">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                            <h3 className="text-xl font-black text-white line-clamp-2 relative z-10 px-8 pb-6 group-hover:text-gold transition-colors italic tracking-tight uppercase leading-[1.1]">{item.title}</h3>
                                        </div>
                                        <div className="p-8">
                                            <div className="flex items-center space-x-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6">
                                                <div className="flex items-center space-x-1.5">
                                                    <Calendar className="h-3 w-3 text-gold/60" />
                                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <User className="h-3 w-3 text-gold/60" />
                                                    <span>{item.author.name}</span>
                                                </div>
                                            </div>
                                            <p className="text-white/40 font-medium mb-8 line-clamp-3 leading-relaxed text-sm">
                                                {item.content}
                                            </p>
                                            <Link
                                                href={`/news/${item.id}`}
                                                className="inline-flex items-center space-x-3 text-gold font-black group-hover:text-white transition-all uppercase text-[10px] tracking-widest"
                                            >
                                                <span>Read Analysis</span>
                                                <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
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
                            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
                                OFFICIAL <span className="text-gold">NOTICES</span>
                            </h2>
                            <div className="h-px bg-white/5 flex-1" />
                        </div>

                        {notices.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-[3.5rem] border border-dashed border-white/10">
                                <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">No active notices broadcasted.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {notices.map((item, idx) => (
                                    <motion.article
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + idx * 0.1 }}
                                        className="bg-[#151515] p-8 rounded-[2.5rem] border border-gold/10 hover:border-gold/40 shadow-xl hover:shadow-gold/5 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="h-14 w-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
                                                <div className="text-lg">📢</div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Priority Notice</p>
                                                <p className="text-[10px] font-black text-gold uppercase tracking-[0.1em] mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black text-white mb-4 line-clamp-2 uppercase italic tracking-tight">{item.title}</h3>

                                        <p className="text-white/40 text-xs font-bold leading-relaxed line-clamp-2 mb-8 uppercase tracking-widest">
                                            {item.content}
                                        </p>

                                        <Link
                                            href={`/news/${item.id}`}
                                            className="w-full py-4 bg-white/5 hover:bg-gold hover:text-black border border-white/10 hover:border-gold rounded-2xl flex items-center justify-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
                                        >
                                            <span>View Notice Protocol</span>
                                            <ArrowRight className="h-3 w-3" />
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
