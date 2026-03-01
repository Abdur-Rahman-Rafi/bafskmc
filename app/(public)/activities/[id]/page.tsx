"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, Loader2, Share2, Clock, Paperclip, FileText, Download, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ActivityDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchActivity();
        }
    }, [params.id]);

    const fetchActivity = async () => {
        try {
            const res = await fetch(`/api/activities/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setActivity(data);
            }
        } catch (error) {
            console.error("Failed to fetch activity details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-10 w-10 text-gold animate-spin" />
                    <p className="text-gold/50 font-black uppercase tracking-[0.2em] text-xs">Accessing Nexus Link...</p>
                </div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="bg-white/5 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                        <span className="text-4xl">🔍</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Event Not Found</h2>
                    <p className="text-white/40 font-medium">The activity deployment you are looking for might have been concluded or classified.</p>
                    <Link href="/activities" className="inline-flex items-center space-x-2 px-8 py-4 bg-gold text-black rounded-2xl font-black transition-all hover:scale-105 shadow-2xl shadow-gold/20">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Activity Nexus</span>
                    </Link>
                </div>
            </div>
        );
    }

    const files = Array.isArray(activity.files) ? activity.files : [];

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-gold/30 pt-20">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative h-[50vh] min-h-[500px] w-full overflow-hidden rounded-[3rem] border border-white/5 shadow-2xl bg-[#151515]">
                    {activity.coverUrl ? (
                        <img
                            src={activity.coverUrl}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                            alt={activity.title}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/5 to-transparent">
                            <Zap className="h-32 w-32 text-gold/10" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-x-0 bottom-0 p-8 md:p-16 flex flex-col items-start justify-end"
                    >
                        <div className="inline-flex items-center space-x-3 mb-6 px-4 py-2 bg-gold text-black rounded-full">
                            <Zap className="h-3 w-3" />
                            <span className="font-black text-[10px] uppercase tracking-[0.2em]">{activity.category}</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter italic uppercase max-w-4xl">
                            {activity.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-gold" />
                                <span>{new Date(activity.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            {activity.location && (
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-4 w-4 text-gold" />
                                    <span>{activity.location}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="relative">
                            <Link href="/activities" className="inline-flex items-center space-x-2 text-white/30 hover:text-gold transition-colors font-black uppercase text-[10px] tracking-widest mb-10">
                                <ArrowLeft className="h-4 w-4" />
                                <span>Return to Central Database</span>
                            </Link>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="prose prose-invert prose-gold max-w-none"
                            >
                                <div className="bg-[#151515] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                                    <h2 className="text-white font-black italic uppercase tracking-tight text-2xl mb-8 flex items-center">
                                        <FileText className="h-6 w-6 mr-3 text-gold" />
                                        Protocol Description
                                    </h2>
                                    <div className="text-white/60 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                                        {activity.description || "System Log: No tactical description provided for this specific event deployment."}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Attachments Card */}
                        <div className="bg-[#151515] p-10 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full" />
                            <h2 className="text-white font-black italic uppercase tracking-tight text-xl mb-8 flex items-center relative z-10">
                                <Paperclip className="h-5 w-5 mr-3 text-gold" />
                                Mission Assets
                            </h2>

                            {files.length === 0 ? (
                                <p className="text-white/20 text-xs font-black uppercase tracking-widest italic">No classified files attached.</p>
                            ) : (
                                <div className="space-y-4 relative z-10">
                                    {files.map((file: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group/file">
                                            <div className="flex items-center space-x-4 overflow-hidden">
                                                <div className="h-10 w-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-white font-bold text-xs truncate">{file.name}</p>
                                                    <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mt-1">
                                                        {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-10 w-10 bg-white/5 hover:bg-gold hover:text-black rounded-xl flex items-center justify-center transition-all border border-white/5 group-hover/file:border-gold"
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Metadata Card */}
                        <div className="bg-[#151515] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-white/5">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Deploying Officer</span>
                                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">{activity.creator?.name || "Command Admin"}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-white/5">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Filing ID</span>
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">#{activity.id.slice(-6)}</span>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <button className="flex items-center space-x-2 text-gold group hover:text-white transition-colors">
                                        <Share2 className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Share Report</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Design accents */}
            <div className="fixed top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-96 h-96 bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
        </div>
    );
}
