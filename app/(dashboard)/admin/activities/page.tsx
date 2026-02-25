"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Calendar, MapPin, Loader2, Trash2, Edit, ExternalLink, Filter, Zap, LayoutGrid, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminActivitiesPage() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const router = useRouter();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/activities");
            const data = await res.json();
            setActivities(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch activities");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This event and all its logs will be purged.")) return;
        try {
            const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchActivities();
            }
        } catch (error) {
            console.error("Purge sequence failed");
        }
    };

    const filteredActivities = activities.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        ACTIVITY <span className="text-gold">NEXUS</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Operations Log • Event Management • Real-time Updates
                    </p>
                </div>
                <Link
                    href="/admin/activities/new"
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black shadow-2xl shadow-gold/20 transition-all active:scale-95 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Initialize Activity</span>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#151515] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="SEARCH OPERATIONS BY TITLE, CATEGORY, OR LOCATION..."
                        className="w-full pl-14 pr-6 py-4 bg-[#0D0D0D] border border-white/5 rounded-2xl outline-none focus:border-gold/30 transition-all text-sm font-bold text-white placeholder:text-white/10 uppercase tracking-widest"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-3 p-1.5 bg-[#0D0D0D] border border-white/5 rounded-2xl">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-gold text-black shadow-lg shadow-gold/20" : "text-white/20 hover:text-white/40"}`}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-gold text-black shadow-lg shadow-gold/20" : "text-white/20 hover:text-white/40"}`}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
                <button className="flex items-center space-x-3 px-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-gold hover:border-gold/20 transition-all">
                    <Filter className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Strategy Filters</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="h-10 w-10 text-gold animate-spin" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Synchronizing Nexus Data...</p>
                </div>
            ) : filteredActivities.length === 0 ? (
                <div className="py-24 text-center bg-[#151515] rounded-[3rem] border border-dashed border-white/5">
                    <div className="bg-white/5 h-20 w-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                        <Zap className="h-8 w-8 text-white/20" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 italic">Nexus Silent</h3>
                    <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto">
                        No active operations found matching your current search parameters.
                    </p>
                </div>
            ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-4"}>
                    <AnimatePresence mode="popLayout">
                        {filteredActivities.map((activity, idx) => (
                            <motion.div
                                key={activity.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`bg-[#151515] border border-white/5 shadow-2xl overflow-hidden group hover:border-gold/30 transition-all relative ${viewMode === "grid" ? "rounded-[2.5rem] flex flex-col" : "rounded-3xl flex items-center p-4"}`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />

                                {viewMode === "grid" ? (
                                    <>
                                        <div className="h-48 w-full bg-[#0D0D0D] relative overflow-hidden">
                                            {activity.coverUrl ? (
                                                <img src={activity.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/5 to-transparent">
                                                    <Zap className="h-12 w-12 text-gold/10" />
                                                </div>
                                            )}
                                            <div className="absolute top-6 left-6">
                                                <span className="px-3 py-1.5 bg-gold text-black text-[9px] font-black uppercase tracking-[0.15em] rounded-lg shadow-xl shadow-gold/20">
                                                    {activity.category}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-4 right-4 flex space-x-2">
                                                <Link
                                                    href={`/admin/activities/edit?id=${activity.id}`}
                                                    className="p-3 bg-white/10 backdrop-blur-md text-white hover:text-gold hover:bg-black/40 rounded-xl border border-white/10 transition-all"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(activity.id)}
                                                    className="p-3 bg-white/10 backdrop-blur-md text-white hover:text-red-500 hover:bg-black/40 rounded-xl border border-white/10 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <h4 className="text-xl font-black text-white group-hover:text-gold transition-colors mb-4 italic tracking-tight">{activity.title}</h4>

                                            <div className="space-y-2 mb-6">
                                                <div className="flex items-center text-white/40 space-x-3">
                                                    <Calendar className="h-3.5 w-3.5 text-gold/40" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(activity.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                {activity.location && (
                                                    <div className="flex items-center text-white/40 space-x-3">
                                                        <MapPin className="h-3.5 w-3.5 text-gold/40" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest truncate">{activity.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-white/30 text-xs font-medium leading-relaxed line-clamp-2 mb-8 flex-1 italic">
                                                {activity.description || "System log: No operational details provided for this activity deployment."}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                                <div className="flex -space-x-2">
                                                    {(activity.files as any[])?.slice(0, 3).map((_, i) => (
                                                        <div key={i} className="h-6 w-6 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                                                            <Plus className="h-2 w-2 text-gold" />
                                                        </div>
                                                    ))}
                                                    {(activity.files as any[])?.length > 3 && (
                                                        <div className="h-6 w-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                                            <span className="text-[8px] font-black text-white">+{activity.files.length - 3}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/admin/activities/edit?id=${activity.id}`}
                                                    className="flex items-center space-x-2 text-gold text-[9px] font-black uppercase tracking-widest hover:text-white transition-all group/link"
                                                >
                                                    <span>Nexus Details</span>
                                                    <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-16 w-16 bg-[#0D0D0D] rounded-2xl overflow-hidden mr-6 flex-shrink-0 border border-white/5">
                                            {activity.coverUrl ? (
                                                <img src={activity.coverUrl} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Zap className="h-6 w-6 text-gold/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-6">
                                            <h4 className="text-base font-black text-white truncate italic uppercase tracking-tighter">{activity.title}</h4>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="text-[8px] font-black text-gold uppercase tracking-widest">{activity.category}</span>
                                                <span className="h-1 w-1 bg-white/10 rounded-full" />
                                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{new Date(activity.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 flex-shrink-0">
                                            <Link
                                                href={`/admin/activities/edit?id=${activity.id}`}
                                                className="p-3 bg-white/5 text-white/20 hover:text-gold hover:bg-gold/10 rounded-xl border border-white/5 transition-all"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(activity.id)}
                                                className="p-3 bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl border border-white/5 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
