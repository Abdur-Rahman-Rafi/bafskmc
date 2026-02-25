"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Zap, Radio } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TickerItem {
    id: string;
    text: string;
    type: "NEWS" | "EXAM" | "RESOURCE" | "ALERT";
}

export default function NewsTicker() {
    const [items, setItems] = useState<TickerItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchTickerItems = async () => {
            const fallback: TickerItem[] = [
                { id: "wel", text: "Welcome to BAFSK Math Club — BAF Shaheen College Kurmitola", type: "NEWS" },
                { id: "wsh", text: "Join our weekly math problem-solving sessions!", type: "NEWS" },
                { id: "res", text: "Check out our latest study resources.", type: "RESOURCE" },
            ];
            try {
                const [newsRes, examsRes, resourcesRes] = await Promise.all([
                    fetch("/api/news"),
                    fetch("/api/exams"),
                    fetch("/api/resources")
                ]);

                const news = await newsRes.json();
                const exams = await examsRes.json();
                const resources = await resourcesRes.json();

                const tickerItems: TickerItem[] = [];

                // Add News
                if (Array.isArray(news)) {
                    news.slice(0, 2).forEach((n: any) => {
                        tickerItems.push({ id: n.id, text: `NEWS: ${n.title}`, type: "NEWS" });
                    });
                }

                // Add Exams and prioritize Announcements
                if (Array.isArray(exams)) {
                    exams.slice(0, 3).forEach((e: any) => {
                        if (e.announcement) {
                            tickerItems.push({
                                id: e.id,
                                text: `ALERT: ${e.name} — ${e.announcement.slice(0, 60)}${e.announcement.length > 60 ? '...' : ''}`,
                                type: "ALERT"
                            });
                        } else {
                            tickerItems.push({ id: e.id, text: `EXAM: ${e.name} trials initialized`, type: "EXAM" });
                        }
                    });
                }

                // Add Resources
                if (Array.isArray(resources)) {
                    resources.slice(0, 2).forEach((r: any) => {
                        tickerItems.push({ id: r.id, text: `RESOURCE: ${r.title} uploaded`, type: "RESOURCE" });
                    });
                }

                setItems(tickerItems.length > 0 ? tickerItems : fallback);
            } catch (error) {
                setItems(fallback);
            }
        };

        fetchTickerItems();
    }, []);

    if (items.length === 0) return null;

    // Multi-duplicate for seamless looping across ultra-wide monitors
    const displayItems = [...items, ...items, ...items, ...items, ...items, ...items];

    return (
        <div className="bg-[#050505] border-b border-white/5 h-12 flex items-center overflow-hidden relative z-50">
            {/* Pulsing "Live" Indicator */}
            <div className="h-full px-6 flex items-center bg-gold text-black font-black uppercase text-[10px] tracking-[0.2em] relative z-20 shadow-[8px_0_20px_rgba(0,0,0,0.8)]">
                <Radio className="h-3 w-3 mr-2 animate-pulse" />
                <span className="whitespace-nowrap italic">Global Feed</span>
            </div>

            {/* Scrolling Track */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                <motion.div
                    className="flex items-center space-x-24 whitespace-nowrap"
                    animate={{
                        x: [0, -2000],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 60,
                            ease: "linear",
                        },
                    }}
                >
                    {displayItems.map((item, idx) => (
                        <Link
                            key={`${item.id}-${idx}`}
                            href={
                                item.id === "wel" ? "/news" :
                                    item.id === "wsh" ? "/news" :
                                        item.id === "res" ? "/resources" :
                                            item.type === "NEWS" ? `/news/${item.id}` :
                                                (item.type === "EXAM" || item.type === "ALERT") ? `/exams/${item.id}` :
                                                    "/resources"
                            }
                            className="flex items-center space-x-4 cursor-pointer group relative z-30"
                        >
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${item.type === 'ALERT' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                item.type === 'EXAM' ? "bg-gold/10 border-gold/20 text-gold" :
                                    "bg-white/5 border-white/10 text-white/40"
                                }`}>
                                {item.type}
                            </span>
                            <span className="text-white/80 text-xs font-bold tracking-tight group-hover:text-gold transition-all">
                                {item.text}
                            </span>
                            <div className="h-1 w-1 rounded-full bg-white/10 group-hover:bg-gold transition-colors" />
                        </Link>
                    ))}
                </motion.div>

                {/* Depth Overlays - Added pointer-events-none to prevent blocking clicks */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
            </div>

            {/* Terminal Status */}
            <div className="px-6 hidden xl:flex items-center space-x-4 border-l border-white/5 h-full bg-[#080808]">
                <div className="flex items-center space-x-2">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Node-Alpha Synchronized</span>
                </div>
                <Zap className="h-3 w-3 text-gold/20" />
            </div>
        </div>
    );
}
