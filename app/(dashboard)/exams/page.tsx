"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Calendar, Clock, Trophy, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ExamItem {
    id: string;
    name: string;
    description: string;
    regStartTime: string;
    regEndTime: string;
    startTime: string;
    endTime: string;
    registrations?: any[];
    submissions?: any[];
}

export default function ExamsListingPage() {
    const [exams, setExams] = useState<ExamItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchExams = () => {
        fetch("/api/exams")
            .then((res) => res.json())
            .then((data) => {
                setExams(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleRegister = async (examId: string) => {
        setProcessing(examId);
        try {
            const res = await fetch(`/api/exams/${examId}/register`, { method: "POST" });
            if (res.ok) {
                fetchExams();
            } else {
                const data = await res.json();
                alert(data.error || "Registration failed");
            }
        } catch (error) {
            alert("Network error");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic">ACTIVE <span className="text-gold">EXAMS</span></h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em]">National Mathematics Challenges</p>
                </div>
                <Trophy className="h-8 w-8 text-gold" />
            </div>

            {exams.length === 0 ? (
                <div className="bg-[#151515] p-20 rounded-[3rem] border border-dashed border-white/5 text-center">
                    <ClipboardList className="h-16 w-16 text-white/5 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">No Active Exams</h3>
                    <p className="text-white/30 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                        There are currently no scheduled exams. Check back later for upcoming challenges!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {exams.map((exam, idx) => {
                        const now = new Date();
                        const regStart = new Date(exam.regStartTime);
                        const regEnd = new Date(exam.regEndTime);
                        const examStart = new Date(exam.startTime);
                        const examEnd = new Date(exam.endTime);

                        const isRegWindow = now >= regStart && now <= regEnd;
                        const isExamWindow = now >= examStart && now <= examEnd;
                        const isRegistered = exam.registrations?.length && exam.registrations.length > 0;
                        const isPast = now > examEnd;

                        let statusLabel = "Upcoming";
                        let statusColor = "bg-white/5 text-white/40";

                        if (isPast) {
                            statusLabel = "Completed";
                            statusColor = "bg-red-500/10 text-red-500";
                        } else if (isExamWindow) {
                            statusLabel = "Ongoing Now";
                            statusColor = "bg-emerald-500/10 text-emerald-500 animate-pulse";
                        } else if (isRegWindow) {
                            statusLabel = "Registration Open";
                            statusColor = "bg-gold/10 text-gold";
                        }

                        return (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#151515] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-gold/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />

                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-4 bg-white/5 rounded-2xl text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                                        <ClipboardList className="h-6 w-6" />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
                                        {statusLabel}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-gold transition-colors">{exam.name}</h3>
                                <p className="text-white/40 font-medium text-sm line-clamp-2 mb-8 leading-relaxed">
                                    {exam.description || "Challenge yourself with our curated mathematical problems designed by experts."}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Starts</p>
                                        <div className="flex items-center space-x-2 text-sm font-bold text-white">
                                            <Calendar className="h-4 w-4 text-gold" />
                                            <span>{examStart.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Time</p>
                                        <div className="flex items-center space-x-2 text-sm font-bold text-white">
                                            <Clock className="h-4 w-4 text-gold" />
                                            <span>{examStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {isPast ? (
                                    <div className="w-full py-4 bg-white/5 border border-white/10 text-white/20 rounded-2xl font-black text-sm flex items-center justify-center cursor-not-allowed">
                                        Exam Concluded
                                    </div>
                                ) : isExamWindow ? (
                                    isRegistered ? (
                                        exam.submissions?.length ? (
                                            <div className="w-full py-4 bg-gold/10 border border-gold/20 text-gold rounded-2xl font-black text-sm flex items-center justify-center space-x-2">
                                                <Trophy className="h-4 w-4" />
                                                <span>Participated</span>
                                            </div>
                                        ) : (
                                            <Link
                                                href={`/exams/${exam.id}`}
                                                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm flex items-center justify-center space-x-2 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
                                            >
                                                <span>Participate Now</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        )
                                    ) : (
                                        <div className="w-full py-4 bg-white/5 border border-white/10 text-white/30 rounded-2xl font-black text-sm flex items-center justify-center cursor-not-allowed">
                                            Not Registered
                                        </div>
                                    )
                                ) : isRegWindow ? (
                                    <button
                                        onClick={() => !isRegistered && handleRegister(exam.id)}
                                        disabled={isRegistered || processing === exam.id}
                                        className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 ${isRegistered
                                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default"
                                            : "bg-gold text-black hover:bg-[#F0C040] shadow-xl shadow-gold/20"
                                            }`}
                                    >
                                        {processing === exam.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : isRegistered ? (
                                            <>
                                                <Trophy className="h-4 w-4" />
                                                <span>Registered Successfully</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Register For Exam</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="w-full py-4 bg-white/5 border border-white/10 text-white/30 rounded-2xl font-black text-sm flex items-center justify-center cursor-not-allowed">
                                        Registration Starts {regStart.toLocaleDateString()}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
