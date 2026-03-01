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

    useEffect(() => {
        Promise.all([
            fetch("/api/dashboard/stats").then(r => r.json()),
            fetch("/api/profile").then(r => r.json()),
        ]).then(([dashData, profileData]) => {
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
            setLoading(false);

            // Mark login if first time
            if (profileData && !profileData.hasLoggedInBefore) {
                fetch("/api/auth/mark-login", { method: "POST" });
            }
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-[#151515] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
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

                {/* Announcement Card */}
                <div className="bg-gold p-10 rounded-[3rem] text-black shadow-2xl shadow-gold/10 relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="bg-black/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                                Priority Announcement
                            </div>
                            <h2 className="text-4xl font-black mb-4 italic leading-[0.9] tracking-tighter uppercase">
                                National Math <br />Selection
                            </h2>
                            <p className="text-black/60 mb-8 font-bold leading-relaxed max-w-sm text-sm">
                                The upcoming selection round for the International Mathematical Olympiad has been scheduled. Ensure your registration is current.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-black/40" />
                                    <span className="font-black text-xs uppercase tracking-widest">March 15, 2026</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-black/40" />
                                    <span className="font-black text-xs uppercase tracking-widest">Grand Hall</span>
                                </div>
                            </div>
                            <Link
                                href="/exams"
                                className="flex items-center justify-center space-x-3 w-full bg-black text-white px-8 py-5 rounded-[2rem] font-black text-sm hover:bg-black/80 transition-all shadow-2xl active:scale-95"
                            >
                                <span>VIEW ACTIVE EXAMS</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute -right-20 -top-20 opacity-10"
                    >
                        <Zap className="h-80 w-80 text-black" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
