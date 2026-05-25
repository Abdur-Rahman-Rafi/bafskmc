"use client";

import { useState, useEffect } from "react";
import { getAvailableQuizzes } from "./actions";
import { Loader2, Play, Calendar, Clock, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function QuizPortalPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("CLASS_5");

    const classes = [
        { id: "CLASS_5", label: "Class 5" },
        { id: "CLASS_6", label: "Class 6" },
        { id: "CLASS_7", label: "Class 7" },
        { id: "CLASS_8", label: "Class 8" },
        { id: "CLASS_9", label: "Class 9" },
        { id: "CLASS_10", label: "Class 10" }
    ];

    useEffect(() => {
        getAvailableQuizzes().then(data => {
            setQuizzes(data);
            setLoading(false);
        });
    }, []);

    const filteredQuizzes = quizzes.filter(q => q.category === activeTab);

    const renderQuizCard = (quiz: any, idx: number) => {
        const now = new Date();
        const start = new Date(quiz.startTime);
        const end = new Date(quiz.endTime);
        const hasStarted = now >= start;
        const hasEnded = now > end;
        
        let minutesUntil = 0;
        if (!hasStarted) {
            minutesUntil = Math.round((start.getTime() - now.getTime()) / 60000);
        }

        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={quiz.id} 
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-1 group hover:border-gold/30 transition-colors shadow-2xl"
            >
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-gold/20 transition-all" />
                
                <div className="bg-[#0A0A0A]/80 backdrop-blur-3xl rounded-[1.8rem] p-8 h-full flex flex-col relative z-10 border border-white/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        {hasEnded ? (
                            <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Ended</span>
                        ) : hasStarted ? (
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Live Now</span>
                        ) : (
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Scheduled</span>
                        )}
                    </div>
                    
                    <h3 className="font-black text-2xl text-white tracking-tighter mb-2 group-hover:text-gold transition-colors">{quiz.name}</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Official Assessment</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="flex items-center text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">
                                <Calendar className="w-3 h-3 mr-1.5 text-gold/60" /> Date
                            </span>
                            <p className="text-xs font-bold text-white/70">{start.toLocaleDateString()}</p>
                            <p className="text-[10px] font-semibold text-white/40">{start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="flex items-center text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">
                                <Clock className="w-3 h-3 mr-1.5 text-gold/60" /> Duration
                            </span>
                            <p className="text-xl font-black text-white/70">{quiz.duration}</p>
                            <p className="text-[10px] font-semibold text-white/40">Minutes</p>
                        </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-white/5">
                        {hasEnded ? (
                            <button disabled className="w-full py-4 bg-white/5 text-white/20 rounded-xl font-black uppercase tracking-widest text-xs cursor-not-allowed">
                                Submissions Closed
                            </button>
                        ) : hasStarted ? (
                            <Link href={`/quiz/${quiz.id}`} className="w-full py-4 bg-gradient-to-r from-gold to-[#F0C040] hover:to-gold text-black rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center transition-all shadow-[0_0_30px_rgba(201,150,43,0.3)] hover:scale-[1.02]">
                                <Play className="w-4 h-4 mr-2" /> Enter Portal
                            </Link>
                        ) : (
                            <button disabled className="w-full py-4 bg-white/5 text-gold/40 rounded-xl font-black uppercase tracking-widest text-xs cursor-not-allowed border border-white/5">
                                Starts in {minutesUntil} mins
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
                {/* Header */}
                <div className="text-center space-y-6 mb-20">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                        <span>Examination Network</span>
                    </motion.div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 tracking-tighter uppercase leading-none">
                        Student <br className="md:hidden" /><span className="text-gold bg-none fill-gold">Assessment</span>
                    </h1>
                    
                    <p className="text-white/40 font-medium text-sm md:text-base max-w-2xl mx-auto">
                        Welcome to the official testing portal. Select your designated class below to view active and upcoming examinations. Ensure you are in a quiet environment before commencing.
                    </p>
                    
                    {/* Security Warning */}
                    <div className="bg-[#111111]/80 backdrop-blur-xl border border-red-500/20 p-6 rounded-3xl flex items-start md:items-center gap-5 text-left max-w-3xl mx-auto mt-10 shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-widest text-red-400 mb-1">Strict Anti-Cheat Protocol Active</h4>
                            <p className="text-xs font-semibold text-white/50 leading-relaxed">The examination engine actively monitors tab switching, window minimizing, and screenshot attempts (PrintScreen). Any violation will result in the immediate and irreversible cancellation of your exam.</p>
                        </div>
                    </div>
                </div>

                {/* Class Navigation */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {classes.map(cls => (
                        <button
                            key={cls.id}
                            onClick={() => setActiveTab(cls.id)}
                            className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                activeTab === cls.id 
                                ? "bg-gold text-black shadow-[0_0_20px_rgba(201,150,43,0.3)] scale-105" 
                                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {cls.label}
                        </button>
                    ))}
                </div>

                {/* Quizzes Grid */}
                <div className="min-h-[40vh]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center pt-20">
                            <Loader2 className="w-10 h-10 animate-spin text-gold mb-4" />
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Synchronizing Database...</p>
                        </div>
                    ) : filteredQuizzes.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center pt-20 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center mb-6">
                                <AlertTriangle className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="text-xl font-black text-white/60 mb-2">No Scheduled Assessments</h3>
                            <p className="text-xs text-white/30 max-w-md">There are currently no active or upcoming quizzes assigned to {classes.find(c => c.id === activeTab)?.label}.</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredQuizzes.map((quiz, idx) => renderQuizCard(quiz, idx))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
