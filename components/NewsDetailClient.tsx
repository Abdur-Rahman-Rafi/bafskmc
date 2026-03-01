"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, User, ArrowLeft, Loader2, Share2, Clock, Download, Paperclip } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NewsDetailClientProps {
    news: any;
}

export default function NewsDetailClient({ news: initialNews }: NewsDetailClientProps) {
    const router = useRouter();
    const [news, setNews] = useState<any>(initialNews);

    const handleShare = async () => {
        try {
            const shareData = {
                title: news?.title || "BAFSK Math Club News",
                text: `${news?.title}\n\nRead more here:`,
                url: window.location.href,
            };

            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${news?.title}\n\n${window.location.href}`);
                alert("Link Copied to Clipboard!");
            }
        } catch (err) {
            console.error("Share protocol failed", err);
        }
    };

    if (!news) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="bg-white/5 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                        <span className="text-4xl">🔍</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Article Not Found</h2>
                    <p className="text-white/40 font-medium">The news story you are looking for might have been moved or deleted.</p>
                    <Link href="/news" className="inline-flex items-center space-x-2 px-8 py-4 bg-gold text-black rounded-2xl font-black transition-all hover:scale-105">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Newsroom</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-gold/30">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden border-b border-gold/10 bg-[#151515]">
                {news.imageUrl && (
                    <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0D0D]/60 to-[#0D0D0D]" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-4 max-w-5xl mx-auto text-center"
                >
                    <div className="inline-flex items-center space-x-3 mb-6 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full">
                        <span className="h-2 w-2 bg-gold rounded-full animate-pulse" />
                        <span className="text-gold font-black text-[10px] uppercase tracking-[0.2em]">Latest Update</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
                        {news.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm font-bold">
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gold" />
                            <span>{news.author?.name || "Admin"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gold" />
                            <span>{new Date(news.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gold" />
                            <span>2 min read</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="relative group mb-12">
                    <Link href="/news" className="inline-flex items-center space-x-2 text-white/30 hover:text-gold transition-colors font-black uppercase text-[10px] tracking-widest">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to all stories</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="prose prose-invert prose-gold max-w-none text-white/80 leading-relaxed text-lg"
                >
                    {news.content.split('\n').map((paragraph: string, idx: number) => (
                        paragraph.trim() ? <p key={idx} className="mb-6">{paragraph}</p> : null
                    ))}
                </motion.div>

                {news.fileUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 bg-[#151515] p-8 rounded-[2.5rem] border border-gold/10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center space-x-6">
                                <div className="h-14 w-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
                                    <Paperclip className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black italic uppercase tracking-tight text-lg">Official Attachment</h4>
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Classified Document • Protocol Asset</p>
                                </div>
                            </div>
                            <a
                                href={news.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gold text-black px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#F0C040] transition-all flex items-center space-x-3 shadow-xl shadow-gold/10 active:scale-95"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download Asset</span>
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* Footer Actions */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleShare}
                            className="h-14 w-14 bg-white/5 hover:bg-gold hover:text-black rounded-2xl flex items-center justify-center transition-all border border-white/10"
                        >
                            <Share2 className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-8">
                        <Link href="/resources" className="text-white/40 hover:text-gold transition-colors font-black uppercase text-[11px] tracking-[0.2em]">Resources</Link>
                        <Link href="/activities" className="text-white/40 hover:text-gold transition-colors font-black uppercase text-[11px] tracking-[0.2em]">Activities</Link>
                        <Link href="/gallery" className="text-white/40 hover:text-gold transition-colors font-black uppercase text-[11px] tracking-[0.2em]">Gallery</Link>
                    </div>
                </div>
            </div>

            {/* Design accents */}
            <div className="fixed top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        </div>
    );
}
