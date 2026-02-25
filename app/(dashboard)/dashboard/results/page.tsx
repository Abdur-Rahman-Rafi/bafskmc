"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, Clock, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Submission {
    id: string;
    score: number;
    submittedAt: string;
    exam: {
        name: string;
    };
}

export default function ResultsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard/submissions")
            .then(res => res.json())
            .then(data => {
                setSubmissions(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <Link
                    href="/dashboard"
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-gold transition-all"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter">
                        PERFORMANCE <span className="text-gold">HISTORY</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em]">Comprehensive Exam Analytics & Scores</p>
                </div>
            </div>

            {submissions.length === 0 ? (
                <div className="bg-[#151515] p-20 rounded-[3rem] border border-dashed border-white/5 text-center">
                    <Trophy className="h-16 w-16 text-white/5 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
                    <p className="text-white/30 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                        You haven't participated in any exams yet. Start your journey by challenging yourself in the competition hall!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {submissions.map((sub, idx) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-[#151515] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-gold/30 transition-all"
                        >
                            <div className="flex items-center space-x-6">
                                <div className="h-16 w-16 bg-gold/10 rounded-[1.5rem] flex items-center justify-center border border-gold/20 text-gold group-hover:bg-gold group-hover:text-black transition-all">
                                    <Trophy className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight group-hover:text-gold transition-colors">{sub.exam.name}</h3>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center space-x-1.5 text-white/20">
                                            <Calendar className="h-3 w-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5 text-white/20">
                                            <Clock className="h-3 w-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-8">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Final Score</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">
                                        {Math.round(sub.score)}<span className="text-gold text-lg ml-0.5">%</span>
                                    </p>
                                </div>
                                <div className="h-12 w-[1px] bg-white/5 hidden md:block" />
                                <div className="flex flex-col items-center justify-center px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mb-1" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
