"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MapPin,
    ArrowRight,
    Camera,
    Sparkles,
    X,
    ExternalLink,
    Zap
} from "lucide-react";
import Link from "next/link";

interface Activity {
    id: string;
    title: string;
    description: string | null;
    category: string;
    date: string;
    location: string | null;
    coverUrl: string | null;
}

// Fallback high-quality math club activity photos if database is still fresh
const SAMPLE_ACTIVITIES: Activity[] = [
    {
        id: "sample-1",
        title: "National Math Olympiad Preparation Workshop",
        description: "Intensive training on combinatorics, number theory, and advanced Euclidean geometry with mentor problem-solving circles.",
        category: "Workshop",
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        location: "Auditorium, BAFSK",
        coverUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: "sample-2",
        title: "Inter-College Problem-Solving Marathon",
        description: "Over 200 participants from across Dhaka competing in rapid-fire mental calculus and logic puzzles.",
        category: "Competition",
        date: new Date(Date.now() - 12 * 86400000).toISOString(),
        location: "College Campus Ground",
        coverUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: "sample-3",
        title: "Pi Day Celebration & Mathematical Exhibition",
        description: "Annual showcase of interactive mathematical models, fractals, golden ratio art, and alumni meet.",
        category: "Exhibition",
        date: new Date(Date.now() - 25 * 86400000).toISOString(),
        location: "Science Complex",
        coverUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80"
    }
];

export default function RecentActivitiesAlbum() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    useEffect(() => {
        fetch("/api/activities")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setActivities(data.slice(0, 6));
                } else {
                    setActivities(SAMPLE_ACTIVITIES);
                }
                setLoading(false);
            })
            .catch(() => {
                setActivities(SAMPLE_ACTIVITIES);
                setLoading(false);
            });
    }, []);

    return (
        <section className="py-24 relative overflow-hidden bg-[#080C14]">
            {/* Ambient background glows */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none transform -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
                            <Camera className="h-3.5 w-3.5 text-sky-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
                                Campus Life & Moments
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                            Recent <span className="shimmer text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">Activities Album</span>
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base font-medium max-w-xl mt-3 leading-relaxed">
                            A snapshot of our vibrant workshops, olympiad marathons, and campus engagements.
                        </p>
                    </div>

                    <Link
                        href="/activities"
                        className="inline-flex items-center space-x-3 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-amber-300 font-black text-xs uppercase tracking-wider transition-all hover:-translate-y-0.5 shadow-lg group shrink-0"
                    >
                        <span>View All Activities</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Album Photo Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activities.map((activity, idx) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            onClick={() => setSelectedActivity(activity)}
                            className="math-glass-card rounded-[2.5rem] overflow-hidden cursor-pointer group relative flex flex-col justify-between"
                        >
                            {/* Photo Aspect Container */}
                            <div className="aspect-[16/10] relative overflow-hidden bg-black/60">
                                {activity.coverUrl ? (
                                    <img
                                        src={activity.coverUrl}
                                        alt={activity.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                                        <Zap className="h-12 w-12 text-amber-400/30" />
                                    </div>
                                )}

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-black/70 text-amber-300 border border-amber-400/30 backdrop-blur-md shadow-lg">
                                        {activity.category}
                                    </span>
                                </div>

                                {/* Click to Expand Prompt */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/80 text-[10px] font-black uppercase tracking-wider text-white border border-white/20 backdrop-blur-md">
                                    <span>Expand Album</span>
                                    <ExternalLink className="h-3 w-3" />
                                </div>
                            </div>

                            {/* Details Body */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 mb-3">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-amber-400/80" />
                                            {new Date(activity.date).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                        </span>
                                        {activity.location && (
                                            <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                                                <MapPin className="h-3.5 w-3.5 text-sky-400/80" />
                                                {activity.location}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors tracking-tight line-clamp-2 mb-3">
                                        {activity.title}
                                    </h3>

                                    {activity.description && (
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">
                                            {activity.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/80 group-hover:text-amber-300 flex items-center gap-1">
                                        <span>View Album Photos</span>
                                        <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox / Modal for Photo Viewing */}
            <AnimatePresence>
                {selectedActivity && (
                    <div
                        onClick={() => setSelectedActivity(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-white/10 rounded-[2.5rem] max-w-3xl w-full overflow-hidden shadow-2xl relative"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedActivity(null)}
                                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black border border-white/10 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Full Image */}
                            <div className="aspect-[16/9] w-full relative bg-black">
                                {selectedActivity.coverUrl ? (
                                    <img
                                        src={selectedActivity.coverUrl}
                                        alt={selectedActivity.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                                        <Zap className="h-16 w-16 text-amber-400" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-400 text-black shadow-lg">
                                        {selectedActivity.category}
                                    </span>
                                </div>
                            </div>

                            {/* Modal Details */}
                            <div className="p-8">
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 mb-3">
                                    <span className="flex items-center gap-1.5 text-amber-300">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(selectedActivity.date).toLocaleDateString(undefined, {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </span>
                                    {selectedActivity.location && (
                                        <span className="flex items-center gap-1.5 text-sky-300">
                                            <MapPin className="h-4 w-4" />
                                            {selectedActivity.location}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-black text-white tracking-tight mb-4">
                                    {selectedActivity.title}
                                </h3>

                                <p className="text-gray-300 text-sm leading-relaxed font-medium mb-6">
                                    {selectedActivity.description || "No extended description provided for this campus event."}
                                </p>

                                <div className="flex justify-end">
                                    <Link
                                        href={selectedActivity.id.startsWith("sample") ? "/activities" : `/activities/${selectedActivity.id}`}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-lg hover:shadow-amber-500/30 transition-all"
                                    >
                                        <span>Full Event Dossier</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
