"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Trophy,
    BookOpen,
    Calendar,
    Zap,
    ArrowRight,
    Users,
    Loader2,
    Activity,
    CreditCard,
    Settings,
    FileText,
    ClipboardList,
    ChevronRight,
    Clock,
    CheckCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface StatItem {
    label: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
}

interface ActivityItem {
    id: string;
    title: string;
    date: string;
    type: string;
    score: string | null;
}

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<StatItem[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [latestPayment, setLatestPayment] = useState<any>(null);
    const [adsList, setAdsList] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            fetch("/api/dashboard/stats").then(r => r.json()),
            fetch("/api/profile").then(r => r.json()),
            fetch("/api/advertisements").then(r => r.json()).catch(() => [])
        ]).then(([dashData, profileData, adsData]) => {
            if (dashData.stats) {
                setStats([
                    { label: "Points Earned", value: dashData.stats.totalPoints.toLocaleString(), icon: <Zap className="h-5 w-5 text-gold" />, trend: "Total XP" },
                    { label: "Exams Taken", value: dashData.stats.totalExams.toString(), icon: <BookOpen className="h-5 w-5 text-gold" />, trend: "Participations" },
                    { label: "Portal Rank", value: dashData.stats.rank, icon: <Trophy className="h-5 w-5 text-gold" />, trend: dashData.stats.percentile },
                ]);
            }
            if (dashData.activities) setActivities(dashData.activities);
            if (dashData.latestPayment) setLatestPayment(dashData.latestPayment);
            setProfile(profileData);
            
            if (Array.isArray(adsData)) {
                setAdsList(adsData.filter(a => a.isActive));
            }

            setLoading(false);

            // Mark login if first time
            if (profileData && !profileData.hasLoggedInBefore) {
                fetch("/api/auth/mark-login", { method: "POST" });
            }

            // Trigger Advertisement
            window.dispatchEvent(new Event('show-ad'));
        }).catch(() => setLoading(false));
    }, []);

    const isFirstLogin = !profile?.hasLoggedInBefore;
    const firstName = session?.user?.name?.split(" ")?.[0] || "Student";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    const quickLinks = [
        { title: "Global Ranks", href: "/dashboard/leaderboard", icon: <Trophy className="h-5 w-5" />, desc: "View Hall of Fame" },
        { title: "Resources", href: "/dashboard/resources", icon: <BookOpen className="h-5 w-5" />, desc: "Study materials" },
        { title: "My Payments", href: "/dashboard/payments", icon: <CreditCard className="h-5 w-5" />, desc: "Fee records" },
        { title: "My Profile", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" />, desc: "Manage identity" },
    ];

    return (
        <div className="space-y-10">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-white italic tracking-tighter"
                    >
                        {isFirstLogin ? "Welcome," : "Welcome Back,"}{" "}
                        <span className="text-gold">{firstName}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/30 font-bold uppercase text-[10px] tracking-[0.2em] mt-2"
                    >
                        BAFSKMC Math Club • Student Portal • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </motion.p>
                </div>
                {isFirstLogin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="px-6 py-3 bg-gold/10 border border-gold/20 rounded-2xl"
                    >
                        <p className="text-gold text-xs font-black uppercase tracking-widest">🎉 Welcome to BAFSKMC!</p>
                        <p className="text-white/40 text-[10px] font-bold mt-1">Complete your profile in Settings.</p>
                    </motion.div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link
                            href={stat.label.includes("Rank") ? "/dashboard/leaderboard" : stat.label.includes("Exams") ? "/dashboard/results" : "#"}
                            className="block bg-[#151515] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-gold/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl pointer-events-none group-hover:bg-gold/10 transition-colors" />
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-gold group-hover:bg-gold group-hover:text-black transition-all">
                                    {stat.icon}
                                </div>
                                <span className="text-[10px] font-black text-gold bg-gold/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</h3>
                            <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Payment Pulse / Tracker */}
            {latestPayment && latestPayment.status === "PENDING" && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gold/10 border border-gold/30 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center space-x-6">
                        <div className="h-16 w-16 bg-gold text-black rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20">
                            <Clock className="h-8 w-8 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-white font-black italic uppercase tracking-tight text-lg">Payment Verification In Progress</h3>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                Submission for <span className="text-gold">৳{latestPayment.amount}</span> • {latestPayment.note}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden md:block">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Awaiting Admin Response</p>
                            <p className="text-[10px] font-black text-gold/60 uppercase tracking-widest mt-0.5">EST. TIME: 2-4 HOURS</p>
                        </div>
                        <Link
                            href="/dashboard/payments"
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
                        >
                            View Details
                        </Link>
                    </div>
                </motion.div>
            )}

            {latestPayment && latestPayment.status === "VERIFIED" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/30 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center space-x-6">
                        <div className="h-16 w-16 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-white font-black italic uppercase tracking-tight text-lg">Transaction Verified</h3>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                Your payment of <span className="text-emerald-400">৳{latestPayment.amount}</span> has been confirmed by the Treasury.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/payments"
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                    >
                        History
                    </Link>
                </motion.div>
            )}

            {/* Quick Links */}
            <div>
                <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-5">Quick Access</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickLinks.map((link, idx) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.05 }}
                        >
                            <Link
                                href={link.href}
                                className="block bg-[#151515] border border-white/5 rounded-[2rem] p-6 hover:border-gold/30 transition-all group shadow-xl text-center"
                            >
                                <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all mx-auto mb-4 border border-white/5">
                                    {link.icon}
                                </div>
                                <p className="text-white font-black text-xs tracking-tight group-hover:text-gold transition-colors">{link.title}</p>
                                <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">{link.desc}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="bg-[#151515] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl lg:col-span-1">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <Activity className="h-5 w-5 text-gold" />
                            <h2 className="text-lg font-black text-white uppercase tracking-wider italic">Activity Log</h2>
                        </div>
                        <Link href="/dashboard/results" className="text-white/20 text-[10px] font-black uppercase tracking-widest hover:text-gold transition-colors flex items-center space-x-1">
                            <span>All Results</span>
                            <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {activities.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="h-12 w-12 text-white/5 mx-auto mb-4" />
                            <p className="text-white/20 font-bold uppercase text-[10px] tracking-widest">No activity yet</p>
                            <p className="text-white/10 text-xs mt-2">Take an exam to see your results here!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activities.slice(0, 5).map((activity, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-gold group-hover:text-black transition-all text-white/30">
                                            {activity.type === "Exam" ? <Trophy className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white text-sm group-hover:text-gold transition-colors tracking-tight">{activity.title}</h4>
                                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5">
                                                {new Date(activity.date).toLocaleDateString()} • {activity.type}
                                            </p>
                                        </div>
                                    </div>
                                    {activity.score && (
                                        <span className="text-xs font-black text-gold bg-gold/10 px-4 py-2 rounded-xl border border-gold/20">
                                            {activity.score}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Advertisement Cards */}
                {adsList.map((adItem) => (
                    <div key={adItem.id} className="bg-[#151515] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-gold/30 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-white uppercase tracking-wider italic">Partner Showcase</h2>
                                <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 text-gold border border-white/10">
                                    {adItem.type === 'PAID' ? 'Sponsored' : 'Partner'}
                                </span>
                            </div>
                            <div className="w-full relative rounded-2xl overflow-hidden border border-white/5 mb-6 group-hover:scale-[1.02] transition-transform duration-500 bg-black/50">
                                {adItem.targetUrl ? (
                                    <a href={adItem.targetUrl} target="_blank" rel="noopener noreferrer">
                                       {adItem.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                           <video src={adItem.imageUrl} autoPlay loop muted playsInline className="w-full h-48 object-cover" />
                                       ) : (
                                           <img src={adItem.imageUrl} alt={adItem.companyName} className="w-full h-48 object-cover" />
                                       )}
                                    </a>
                                ) : (
                                    adItem.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                        <video src={adItem.imageUrl} autoPlay loop muted playsInline className="w-full h-48 object-cover" />
                                    ) : (
                                        <img src={adItem.imageUrl} alt={adItem.companyName} className="w-full h-48 object-cover" />
                                    )
                                )}
                            </div>
                            <h3 className="text-white font-black text-2xl tracking-tighter mb-2 shimmer">{adItem.companyName}</h3>
                        </div>
                        {adItem.targetUrl && (
                            <Link href={adItem.targetUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gold text-xs font-bold uppercase tracking-widest hover:text-yellow-400 mt-4 transition-colors w-fit">
                                <span>Visit Website</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
