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
    link: string;
}

export default function NewsTicker() {
    const [items, setItems] = useState<TickerItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchTickerItems = async () => {
            const fallback: TickerItem[] = [
                { id: "wel", text: "Welcome to BAFSK Math Club — BAF Shaheen College Kurmitola", type: "NEWS", link: "/news" },
                { id: "wsh", text: "Join our weekly math problem-solving sessions!", type: "NEWS", link: "/news" },
                { id: "res", text: "Check out our latest study resources.", type: "RESOURCE", link: "/resources" },
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

                // Add News and Notices
                if (Array.isArray(news)) {
                    news.slice(0, 4).forEach((n: any) => {
                        const prefix = n.type === "NOTICE" ? "NOTICE" : "NEWS";
                        tickerItems.push({
                            id: n.id,
                            text: `${prefix}: ${n.title}`,
                            type: n.type === "NOTICE" ? "ALERT" : "NEWS",
                            link: `/news/${n.id}`
                        });
                    });
                }

                // Add Exams and prioritize Announcements
                if (Array.isArray(exams)) {
                    exams.slice(0, 3).forEach((e: any) => {
                        if (e.announcement) {
                            tickerItems.push({
                                id: e.id,
                                text: `ALERT: ${e.name} — ${e.announcement.slice(0, 60)}${e.announcement.length > 60 ? '...' : ''}`,
                                type: "ALERT",
                                link: `/exams/${e.id}`
                            });
                        } else {
                            tickerItems.push({ id: e.id, text: `EXAM: ${e.name} trials initialized`, type: "EXAM", link: `/exams/${e.id}` });
                        }
                    });
                }

                // Add Resources
                if (Array.isArray(resources)) {
                    resources.slice(0, 2).forEach((r: any) => {
                        tickerItems.push({ id: r.id, text: `RESOURCE: ${r.title} uploaded`, type: "RESOURCE", link: "/resources" });
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
        <div className="bg-[#06080F] border-b border-white/10 h-11 flex items-center overflow-hidden relative z-50">
            {/* Pulsing "Live" Indicator */}
            <div className="h-full px-4 flex-shrink-0 flex items-center bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black uppercase text-[10px] tracking-[0.25em] relative z-20 shadow-[8px_0_20px_rgba(0,0,0,0.8)]">
                <span className="h-2 w-2 rounded-full bg-black animate-ping mr-2" />
                <span className="whitespace-nowrap hidden sm:inline">LIVE FEED</span>
                <span className="whitespace-nowrap sm:hidden">LIVE</span>
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
                            href={item.link}
                            className="flex items-center space-x-4 cursor-pointer group relative z-30"
                        >
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${item.type === 'ALERT' ? "bg-red-500/15 border-red-500/30 text-red-400" :
                                item.type === 'EXAM' ? "bg-amber-500/15 border-amber-500/30 text-amber-300" :
                                    "bg-sky-500/10 border-sky-500/20 text-sky-300"
                                }`}>
                                {item.type}
                            </span>
                            <span className="text-gray-300 text-xs font-bold tracking-tight group-hover:text-yellow-400 transition-all">
                                {item.text}
                            </span>
                            <div className="h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-yellow-400 transition-colors" />
                        </Link>
                    ))}
                </motion.div>

                {/* Depth Overlays */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#080C14] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#080C14] to-transparent z-10 pointer-events-none" />
            </div>

            {/* Terminal Status */}
            <div className="px-6 hidden xl:flex items-center space-x-4 border-l border-white/10 h-full bg-[#0B1120]">
                <div className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Node-Alpha Synchronized</span>
                </div>
                <Zap className="h-3 w-3 text-amber-400/40" />
            </div>
        </div>
    );
}
