"use client";

import { useState, useEffect } from "react";
import { getAvailableQuizzes } from "./actions";
import { Loader2, Play, Calendar, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function QuizPortalPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAvailableQuizzes().then(data => {
            setQuizzes(data);
            setLoading(false);
        });
    }, []);

    const class58 = quizzes.filter(q => q.category === "CLASS_5_8");
    const class910 = quizzes.filter(q => q.category === "CLASS_9_10");

    const renderQuizCard = (quiz: any) => {
        const now = new Date();
        const start = new Date(quiz.startTime);
        const end = new Date(quiz.endTime);
        const hasStarted = now >= start;
        const hasEnded = now > end;

        return (
            <div key={quiz.id} className="bg-[#151515] p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-gold/30 transition-all shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />
                <h3 className="font-black text-2xl text-white tracking-tighter mb-2">{quiz.name}</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-[#0D0D0D] p-3 rounded-xl border border-white/5">
                        <span className="flex items-center text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
                            <Calendar className="w-3 h-3 mr-1" /> Start Time
                        </span>
                        <p className="text-xs font-bold text-white/60">{start.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#0D0D0D] p-3 rounded-xl border border-white/5">
                        <span className="flex items-center text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
                            <Clock className="w-3 h-3 mr-1" /> Duration
                        </span>
                        <p className="text-xs font-bold text-white/60">{quiz.duration} Mins</p>
                    </div>
                </div>
                
                {hasEnded ? (
                    <button disabled className="w-full py-4 bg-white/5 text-white/30 rounded-xl font-black uppercase tracking-widest text-xs">
                        Exam Ended
                    </button>
                ) : hasStarted ? (
                    <Link href={`/quiz/${quiz.id}`} className="w-full py-4 bg-gold hover:bg-[#F0C040] text-black rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center transition-all">
                        <Play className="w-4 h-4 mr-2" /> Enter Exam
                    </Link>
                ) : (
                    <button disabled className="w-full py-4 bg-white/5 text-gold/50 rounded-xl font-black uppercase tracking-widest text-xs">
                        Starts in {Math.round((start.getTime() - now.getTime()) / 60000)} mins
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-12 pb-20 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">
                    Quiz <span className="text-gold">Portal</span>
                </h1>
                <p className="text-white/40 font-bold tracking-widest uppercase text-xs">Select your category to begin</p>
                
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-start gap-4 text-left max-w-2xl mx-auto mt-6">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-1">Strict Anti-Cheat Enforced</h4>
                        <p className="text-xs font-bold opacity-80">Do not take screenshots, switch tabs, minimize the window, or attempt to copy text. Doing so will result in an immediate automatic cancellation of your exam.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-gold" /></div>
            ) : (
                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-black text-white/50 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Class 5 to 8</h2>
                        {class58.length === 0 ? <p className="text-white/20 italic">No quizzes available for this category.</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {class58.map(renderQuizCard)}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white/50 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Class 9 to 10</h2>
                        {class910.length === 0 ? <p className="text-white/20 italic">No quizzes available for this category.</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {class910.map(renderQuizCard)}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
