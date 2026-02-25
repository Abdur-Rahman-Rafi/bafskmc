"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    FileText,
    ClipboardList,
    Trophy,
    TrendingUp,
    AlertCircle,
    Eye,
    Zap,
    Loader2,
    Shield,
    Activity,
    CreditCard
} from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then(res => res.json())
            .then(data => {
                if (data.stats) setStats(data.stats);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const adminStats = [
        { label: "Total Students", value: stats?.totalStudents || "0", icon: <Users className="h-6 w-6 text-gold" />, trend: "Active Members" },
        { label: "Active Exams", value: stats?.activeExams || "0", icon: <ClipboardList className="h-6 w-6 text-gold" />, trend: "Live Sessions" },
        { label: "News Posts", value: stats?.newsPosts || "0", icon: <FileText className="h-6 w-6 text-gold" />, trend: "Articles Published" },
        { label: "Achievements", value: stats?.achievements || "0", icon: <Trophy className="h-6 w-6 text-gold" />, trend: "Badges Awarded" },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Command Header */}
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                    CONTROL <span className="text-gold">CENTER</span>
                </h1>
                <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                    System Nexus • Global BAFSK Management
                </p>
            </div>

            {/* Stats Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {adminStats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#151515] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-gold/30 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl pointer-events-none" />
                        <div className="h-14 w-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-black transition-all">
                            {stat.icon}
                        </div>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <div className="flex items-end space-x-2">
                            <p className="text-4xl font-black text-white tracking-tighter italic">
                                {loading ? <Loader2 className="h-8 w-8 animate-spin inline text-gold" /> : stat.value}
                            </p>
                            <span className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-1.5">{stat.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Quick Management Protocols */}
                    <div className="bg-[#151515] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                        <div className="flex items-center space-x-3 text-gold mb-8">
                            <Zap className="h-5 w-5" />
                            <h2 className="text-xl font-black text-white uppercase tracking-wider italic">Management Protocols</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Link
                                href="/admin/exams/new"
                                className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-gold/30 hover:bg-gold/5 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-gold transition-colors">
                                        <ClipboardList className="h-5 w-5" />
                                    </div>
                                    <span className="font-black text-white tracking-tight uppercase text-xs">Initialize Exam</span>
                                </div>
                                <TrendingUp className="h-4 w-4 text-white/10 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </Link>
                            <Link
                                href="/admin/news/new"
                                className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-gold/30 hover:bg-gold/5 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-gold transition-colors">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <span className="font-black text-white tracking-tight uppercase text-xs">Publish Bulletin</span>
                                </div>
                                <TrendingUp className="h-4 w-4 text-white/10 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </Link>
                            <Link
                                href="/admin/activities/new"
                                className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-gold/30 hover:bg-gold/5 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-gold transition-colors">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <span className="font-black text-white tracking-tight uppercase text-xs">Deploy Activity</span>
                                </div>
                                <TrendingUp className="h-4 w-4 text-white/10 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </Link>
                        </div>
                    </div>

                    {/* Critical Alerts Console */}
                    <div className="bg-[#151515] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3 text-red-500">
                                <Activity className="h-5 w-5" />
                                <h2 className="text-xl font-black text-white uppercase tracking-wider italic">System Alerts</h2>
                            </div>
                            <span className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-full">Monitoring Live</span>
                        </div>
                        <div className="space-y-4">
                            {stats?.pendingPayments > 0 && (
                                <Link href="/admin/payments" className="flex items-start space-x-5 p-6 bg-amber-500/5 rounded-[2rem] border border-amber-500/10 hover:border-amber-500/30 transition-all group">
                                    <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shadow-lg">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">Pending Financial Verification</p>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                                            {stats.pendingPayments} students awaiting manual payment approval.
                                        </p>
                                    </div>
                                </Link>
                            )}
                            <div className="flex items-start space-x-5 p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10 transition-all">
                                <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shadow-lg">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">Security Node Operational</p>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                                        End-to-end encryption active on all API endpoints.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Terminal */}
                <div className="bg-[#0D0D0D] p-10 rounded-[3rem] border border-gold/20 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gold shadow-[0_0_15px_rgba(193,153,61,0.5)]" />
                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider mb-8 flex items-center">
                        <span className="h-2 w-2 bg-gold rounded-full mr-3 animate-pulse" />
                        Audit Terminal
                    </h2>
                    <div className="space-y-8">
                        {[
                            { user: "ADMIN", action: "DEPLOYED SYSTEM v2.4", time: "05m ago" },
                            { user: "CORE", action: "DATABASE BACKUP SEQ SUCCESS", time: "45m ago" },
                            { user: "MOD_01", action: "VERIFIED MEMBER ID_882", time: "02h ago" },
                            { user: "ADMIN", action: "UPDATED BRANDING IDENTITY", time: "04h ago" },
                        ].map((log, idx) => (
                            <div key={idx} className="flex flex-col space-y-1 relative pl-6 border-l border-white/5 group/log">
                                <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 bg-gold/20 rounded-full border border-gold/40 group-hover/log:bg-gold transition-colors"></div>
                                <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest italic">{log.user}</p>
                                <p className="text-xs font-black text-white tracking-tight uppercase leading-relaxed">{log.action}</p>
                                <p className="text-[8px] font-black text-white/10 uppercase tracking-widest pt-1">{log.time}</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-gold hover:bg-gold/5 transition-all">
                        Full Stream Access
                    </button>
                </div>
            </div>
        </div>
    );
}
