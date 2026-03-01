"use client";

import { useEffect, useState } from "react";
import {
    FileText,
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    Loader2,
    Filter,
    Calendar,
    User as UserIcon,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NewsItem {
    id: string;
    title: string;
    type: "ARTICLE" | "NOTICE";
    createdAt: string;
    author: { name: string };
}

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchNews = () => {
        setLoading(true);
        fetch("/api/news")
            .then((res) => res.json())
            .then((data) => {
                setNews(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This headline will be removed from all feeds.")) return;

        try {
            const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
            if (res.ok) {
                setNews(news.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Deletion protocol failed");
        }
    };

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        NEWS <span className="text-gold">FEED</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Public Communications • Bulletin Management
                    </p>
                </div>
                <Link
                    href="/admin/news/new"
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black shadow-2xl shadow-gold/20 transition-all active:scale-95 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Publish Article</span>
                </Link>
            </div>

            {/* Content Console */}
            <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
                {/* Search / Filter Bar */}
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="SEARCH HEADLINES..."
                            className="w-full pl-14 pr-6 py-4 bg-[#0D0D0D] border border-white/5 rounded-2xl outline-none focus:border-gold/30 transition-all text-sm font-bold text-white placeholder:text-white/10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center space-x-3 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-gold hover:border-gold/20 transition-all">
                        <Filter className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                    </button>
                </div>

                {/* Table / List */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="h-10 w-10 text-gold animate-spin" />
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Synchronizing Feed...</p>
                        </div>
                    ) : news.length === 0 ? (
                        <div className="text-center py-32 bg-[#0D0D0D]/30">
                            <FileText className="h-16 w-16 text-white/5 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-white/40 uppercase italic">Archive Empty</h3>
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2">Start publishing to populate the club news feed.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01] text-white/30 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                    <th className="px-10 py-6">Article Information</th>
                                    <th className="px-10 py-6">Intelligence By</th>
                                    <th className="px-10 py-6">Timestamp</th>
                                    <th className="px-10 py-6 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredNews.map((item, idx) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group hover:bg-gold/[0.02] transition-colors"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center space-x-6">
                                                <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-gold group-hover:bg-gold/10 transition-all border border-white/5">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <span className="font-black text-white italic tracking-tight group-hover:text-gold transition-colors text-lg line-clamp-1 max-w-[400px]">
                                                        {item.title}
                                                    </span>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className={`h-1.5 w-1.5 rounded-full ${item.type === 'NOTICE' ? 'bg-gold animate-pulse' : 'bg-emerald-500'}`} />
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${item.type === 'NOTICE' ? 'text-gold' : 'text-emerald-500/60'}`}>
                                                            {item.type === 'NOTICE' ? 'Official Notice' : 'Public Article'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                                                    <UserIcon className="h-4 w-4 text-white/30" />
                                                </div>
                                                <span className="text-xs font-black text-white/60 uppercase tracking-tight italic">{item.author.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center space-x-3 text-white/40">
                                                <Calendar className="h-4 w-4 text-gold/40" />
                                                <span className="text-xs font-bold font-mono">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end space-x-4">
                                                <Link
                                                    href={`/news/${item.id}`}
                                                    className="p-3 bg-white/5 text-white/20 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/5"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/news/edit/${item.id}`}
                                                    className="p-3 bg-white/5 text-white/20 hover:text-gold hover:bg-gold/10 hover:border-gold/20 rounded-xl transition-all border border-white/5"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-3 bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 rounded-xl transition-all border border-white/5"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <ChevronRight className="h-5 w-5 text-white/5 group-hover:text-gold transition-colors" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
