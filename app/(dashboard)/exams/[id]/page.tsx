"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Timer, ClipboardList, AlertCircle, Loader2, ArrowLeft, Play, Download, Upload, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import FileUploadZone from "@/components/admin/FileUploadZone";

export default function ExamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [exam, setExam] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submissionFileUrl, setSubmissionFileUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchExam();
        }
    }, [params.id]);

    const fetchExam = async () => {
        try {
            const res = await fetch(`/api/exams/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setExam(data);
                if (data.duration) setTimeLeft(data.duration * 60);
            }
        } catch (error) {
            console.error("Failed to fetch exam details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (started && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && started) {
            handleSubmit();
        }
    }, [started, timeLeft]);

    const handleSubmit = async () => {
        if (!submissionFileUrl && timeLeft > 0) {
            alert("Please upload your answer script before submitting.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`/api/exams/${params.id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ submissionFileUrl })
            });
            if (res.ok) {
                router.push("/dashboard/activities");
            } else {
                alert("Submission failed");
            }
        } catch (error) {
            alert("Network error during submission");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center space-y-6">
                <div className="text-6xl">📝</div>
                <h1 className="text-3xl font-black text-white px-4 text-center">Exam Not Found</h1>
                <Link href="/exams" className="px-8 py-4 bg-gold text-black rounded-2xl font-black transition-all hover:scale-105">
                    Return to Exams
                </Link>
            </div>
        );
    }

    const now = new Date();
    const isUpcoming = new Date(exam.startTime) > now;
    const isPast = new Date(exam.endTime) < now;
    const isOngoing = now >= new Date(exam.startTime) && now <= new Date(exam.endTime);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (started) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] text-white">
                <div className="sticky top-0 z-50 bg-[#111111]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 mb-8">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gold/10 rounded-xl text-gold">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white">{exam.name}</h2>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Global Trial Control</p>
                            </div>
                        </div>
                        <div className={`flex items-center space-x-3 px-6 py-2 rounded-2xl border font-black ${timeLeft < 60 ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-gold/10 border-gold/20 text-gold"}`}>
                            <Timer className="h-5 w-5" />
                            <span className="text-xl tabular-nums">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 pb-20 space-y-8">
                    {/* Question Display */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#151515] p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8 overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] flex items-center">
                                <FileText className="h-4 w-4 mr-3 text-gold" />
                                Examination Repository
                            </h3>
                            <a
                                href={exam.questionFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <Download className="h-3 w-3" />
                                <span>Download PDF</span>
                            </a>
                        </div>

                        {exam.questionFileUrl?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                            <img src={exam.questionFileUrl} alt="Question Paper" className="w-full h-auto rounded-3xl border border-white/5" />
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center bg-black/40 rounded-[2.5rem] border border-dashed border-white/5">
                                <FileText className="h-16 w-16 text-white/10 mb-4" />
                                <p className="text-white/40 font-bold text-sm tracking-tight text-center">
                                    Question Paper is in PDF format.<br />
                                    Please use the download button to view.
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Submission Zone */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-px bg-white/5 flex-1" />
                            <div className="flex items-center space-x-3 text-gold/40">
                                <Upload className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Submission Portal</span>
                            </div>
                            <div className="h-px bg-white/5 flex-1" />
                        </div>

                        <div className="bg-[#151515] p-10 rounded-[3rem] border border-emerald-500/10 shadow-2xl">
                            <FileUploadZone
                                type="document"
                                label="Upload Answer Script (PDF/Image)"
                                initialUrl={submissionFileUrl}
                                onUploadComplete={(url) => setSubmissionFileUrl(url)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center pt-10">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !submissionFileUrl}
                            className="bg-gold text-black px-16 py-6 rounded-[2.5rem] font-black text-xl hover:bg-[#F0C040] shadow-[0_20px_60px_rgba(201,150,43,0.3)] transition-all active:scale-95 disabled:opacity-20 uppercase tracking-widest"
                        >
                            {submitting ? (
                                <Loader2 className="h-6 w-6 animate-spin text-black" />
                            ) : (
                                "Commit Submission"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <Link href="/exams" className="inline-flex items-center space-x-2 text-white/30 hover:text-gold transition-colors font-black uppercase text-[10px] tracking-widest mb-10">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Halls</span>
                </Link>

                <div className="bg-[#151515] rounded-[3rem] border border-gold/10 overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] rounded-full -mr-48 -mt-48" />

                    <div className="p-8 md:p-12 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                            <div>
                                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-4">
                                    <span className="h-1.5 w-1.5 bg-gold rounded-full animate-pulse" />
                                    <span className="text-gold font-black text-[9px] uppercase tracking-widest">Competition Hall</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">{exam.name}</h1>
                            </div>

                            <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/10 min-w-[200px]">
                                <Timer className="h-6 w-6 text-gold mb-2" />
                                <span className="text-2xl font-black text-white">{exam.duration}m</span>
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Time Limit</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            <div className="lg:col-span-2 space-y-12">
                                <section>
                                    <h3 className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Briefing</h3>
                                    <p className="text-white/70 leading-relaxed text-lg font-medium italic border-l-4 border-gold/20 pl-6">
                                        {exam.description || "No briefing provided for this mathematical challenge."}
                                    </p>
                                </section>

                                {exam.announcement && (
                                    <section className="bg-gold/5 border border-gold/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                            <AlertCircle className="h-12 w-12 text-gold" />
                                        </div>
                                        <h3 className="text-gold text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center">
                                            <span className="h-1.5 w-1.5 bg-gold rounded-full mr-2 animate-pulse" />
                                            Official Announcement
                                        </h3>
                                        <div className="text-white/80 font-bold leading-relaxed whitespace-pre-wrap">
                                            {exam.announcement}
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Competition Schedule</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-xs font-bold text-white/50">Starts:</span>
                                        <span className="text-xs font-black text-white">{new Date(exam.startTime).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-xs font-bold text-white/50">Ends:</span>
                                        <span className="text-xs font-black text-white">{new Date(exam.endTime).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 flex flex-col items-center">
                            {!isOngoing ? (
                                isUpcoming ? (
                                    <div className="text-center space-y-4">
                                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-6 py-4 rounded-2xl inline-flex items-center space-x-3 mb-4">
                                            <AlertCircle className="h-5 w-5" />
                                            <span className="font-black text-sm uppercase tracking-wider">Exam Protocol Locked</span>
                                        </div>
                                        <p className="text-white/40 text-sm font-medium">Protocol unlocks at competition start time. Please prepare.</p>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-4 font-black text-red-500">
                                        <div className="bg-red-500/10 border border-red-500/20 px-8 py-5 rounded-2xl text-lg uppercase tracking-widest">
                                            Competition Closed
                                        </div>
                                    </div>
                                )
                            ) : (
                                <button
                                    onClick={() => setStarted(true)}
                                    className="group relative px-12 py-6 bg-gold hover:bg-[#F0C040] text-black rounded-[2.5rem] font-black text-lg transition-all shadow-[0_20px_60px_rgba(201,150,43,0.3)] hover:-translate-y-1 flex items-center space-x-4 uppercase tracking-[0.1em]"
                                >
                                    <Play className="h-6 w-6 fill-black" />
                                    <span>Initiate Exam Protocol</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
