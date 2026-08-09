"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Calendar, Link as LinkIcon, Clock, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AppStatus {
    id: string;
    name: string;
    status: string;
    vivaTime: string | null;
    vivaLink: string | null;
}

export default function StudentPanelApplicationStatus() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusData, setStatusData] = useState<AppStatus | null>(null);
    const [resultData, setResultData] = useState<any>(null);
    const [emailSending, setEmailSending] = useState(false);
    const [configData, setConfigData] = useState<{ startDate: string; deadline: string } | null>(null);
    const [waitTime, setWaitTime] = useState<string>("");

    useEffect(() => {
        if (!session?.user?.email) return;

        const fetchStatus = async () => {
            try {
                // Fetch both config and status in parallel
                const [statusRes, configRes] = await Promise.all([
                    fetch(`/api/apply-panel/status?email=${encodeURIComponent(session.user.email as string)}`),
                    fetch(`/api/apply-panel`)
                ]);

                if (configRes.ok) {
                    const configData = await configRes.json();
                    setConfigData({ startDate: configData.startDate, deadline: configData.deadline });
                }

                // Attempt to fetch results (only available if evaluated)
                const resultRes = await fetch('/api/student/panel-result');
                if (resultRes.ok) {
                    const rData = await resultRes.json();
                    setResultData(rData);
                }

                if (!statusRes.ok) {
                    if (statusRes.status === 404) {
                        setError("No application found under your account email.");
                    } else {
                        throw new Error("Failed to load application status.");
                    }
                    setStatusData(null);
                    return;
                }
                const data = await statusRes.json();
                setStatusData(data);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [session]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (statusData?.vivaTime && statusData.status !== "COMPLETED" && statusData.status !== "REJECTED") {
            const updateWaitTime = () => {
                const now = new Date().getTime();
                const vTime = new Date(statusData.vivaTime!).getTime();
                const diff = vTime - now;

                if (diff <= 0) {
                    setWaitTime("Your Viva is starting now! Please join the link.");
                } else {
                    const minutes = Math.floor(diff / 60000);
                    const hours = Math.floor(minutes / 60);
                    const remainingMins = minutes % 60;
                    if (hours > 24) {
                        setWaitTime(`Viva is in ${Math.floor(hours / 24)} days.`);
                    } else if (hours > 0) {
                        setWaitTime(`Wait time: ~${hours}h ${remainingMins}m`);
                    } else {
                        setWaitTime(`Wait time: ~${minutes} minutes`);
                    }
                }
            };
            updateWaitTime();
            interval = setInterval(updateWaitTime, 60000);
        }
        return () => clearInterval(interval);
    }, [statusData]);

    const sendEmail = async () => {
        setEmailSending(true);
        try {
            const res = await fetch('/api/student/panel-result/email', { method: 'POST' });
            if (res.ok) {
                alert('Email sent successfully! Check your inbox.');
            } else {
                alert('Failed to send email.');
            }
        } catch (err) {
            alert('Error sending email.');
        } finally {
            setEmailSending(false);
        }
    };

    const sortedProgress = resultData ? [...(resultData.progress || [])].sort((a: any, b: any) => a.hop.order - b.hop.order) : [];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">
                    Panel <span className="text-gold">Application</span>
                </h1>
                <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-1">Review your executive application & Viva status</p>
            </div>

            {configData && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                     <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex items-center space-x-4">
                         <div className="p-3 bg-emerald-500/10 rounded-xl">
                             <Calendar className="h-5 w-5 text-emerald-500" />
                         </div>
                         <div>
                             <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Application Opened</p>
                             <p className="text-white font-bold text-sm tracking-tight">{new Date(configData.startDate).toLocaleDateString()}</p>
                         </div>
                     </div>
                     <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex items-center space-x-4">
                         <div className="p-3 bg-red-500/10 rounded-xl">
                             <Clock className="h-5 w-5 text-red-500" />
                         </div>
                         <div>
                             <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Submission Deadline</p>
                             <p className="text-white font-bold text-sm tracking-tight">{new Date(configData.deadline).toLocaleDateString()}</p>
                         </div>
                     </div>
                 </div>
            )}

            {error && !statusData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 text-center bg-[#151515] border border-white/5 shadow-2xl rounded-[2rem]">
                    <Shield className="h-12 w-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/60 font-medium mb-6">You haven't submitted a Panel Application yet, or it was submitted using a different email address.</p>
                    <Link href="/apply-panel" className="inline-flex items-center space-x-2 bg-gold text-black px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:bg-yellow-400">
                        <span>Apply Now</span>
                    </Link>
                </motion.div>
            )}

            {statusData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#151515] border border-gold/20 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-gold/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 border-b border-white/5 pb-8 gap-4">
                        <div>
                            <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Applicant Identity</p>
                            <h2 className="text-2xl font-black text-white">{statusData.name}</h2>
                            <p className="text-white/60 text-sm mt-1">{session?.user?.email}</p>
                        </div>
                        <div className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border ${
                            statusData.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
                            statusData.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
                            statusData.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
                            statusData.status === 'VIVA_SCHEDULED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' :
                            'bg-gold/10 text-gold border-gold/20 shadow-[0_0_15px_rgba(201,150,43,0.1)]'
                        }`}>
                            {statusData.status.replace("_", " ")}
                        </div>
                    </div>

                    {statusData.status === 'COMPLETED' || statusData.status === 'ACCEPTED' ? (
                        <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex flex-col items-center text-center space-y-4">
                            <CheckCircle className="h-16 w-16 text-emerald-500" />
                            <div>
                                <h3 className="text-emerald-400 font-bold text-xl">Application Processed Successfully!</h3>
                                <p className="text-white/60 font-medium mt-2 max-w-lg mx-auto">Your application and viva have been recorded. Here is your evaluation result:</p>
                            </div>
                        </div>
                    ) : statusData.vivaTime ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                                    <div className="flex items-center space-x-3 text-gold mb-3">
                                        <div className="p-2 bg-gold/10 rounded-lg">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-white/50">Scheduled Viva Time</span>
                                    </div>
                                    <p className="text-white font-bold text-lg">{new Date(statusData.vivaTime).toLocaleString()}</p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/5 blur-2xl" />
                                    <div className="relative">
                                        <div className="flex items-center space-x-3 text-blue-400 mb-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-white/50">Current Wait Time</span>
                                        </div>
                                        <p className="text-white font-bold text-lg">{waitTime || "Calculating..."}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {statusData.vivaLink && (
                                <div className="p-8 bg-gold/5 border border-gold/20 rounded-3xl">
                                    <h3 className="text-sm font-bold text-gold mb-6 flex items-center">
                                        <LinkIcon className="h-5 w-5 mr-3" />
                                        Official Viva Meeting Link (Zoom/Google Meet)
                                    </h3>
                                    <a href={statusData.vivaLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-5 bg-gold text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#F0C040] transition-colors shadow-xl shadow-gold/10 hover:shadow-gold/30 hover:-translate-y-1">
                                        <LinkIcon className="h-4 w-4 mr-2" />
                                        Connect to Viva Meeting
                                    </a>
                                    <p className="text-center text-white/40 text-[10px] uppercase tracking-[0.2em] mt-5 font-bold">Please ensure your camera is working before joining exactly at your scheduled time.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-16 text-center bg-white/[0.02] border border-white/5 rounded-3xl">
                            <Clock className="h-12 w-12 text-white/10 mx-auto mb-6" />
                            <h3 className="text-lg font-bold text-white mb-2">Application Under Review</h3>
                            <p className="text-white/50 text-sm max-w-md mx-auto">Your application has been received and is currently being assessed. Your Viva schedule will appear here once an admin assigns it.</p>
                        </div>
                    )}

                    {/* Result Section (Only shown if results exist) */}
                    {resultData && (
                        <div className="mt-12 pt-12 border-t border-white/5 space-y-8">
                            <div className="flex flex-col md:flex-row items-center justify-between bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                                <div>
                                    <h3 className="text-2xl font-black text-white">Evaluation Results</h3>
                                    <p className="text-white/50 text-sm mt-1">Detailed breakdown of your panel application.</p>
                                </div>
                                <div className="mt-4 md:mt-0 bg-gold/10 px-6 py-3 rounded-xl border border-gold/20 text-center">
                                    <p className="text-[10px] text-gold font-black uppercase tracking-widest">Chosen Panel</p>
                                    <p className="text-xl font-black text-white mt-1">{resultData.chosenPanel || 'Pending'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Progress Tracker */}
                                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
                                        <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                                            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg mr-3">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            Progress Tracker
                                        </h4>
                                        <div className="space-y-6">
                                            {sortedProgress.length === 0 ? (
                                                <p className="text-white/40 italic text-sm">No progress recorded yet.</p>
                                            ) : (
                                                sortedProgress.map((p: any, idx: number) => (
                                                    <div key={p.id} className="relative flex items-center">
                                                        {idx !== sortedProgress.length - 1 && (
                                                            <div className={`absolute top-8 left-4 -ml-px h-full w-0.5 ${p.isCompleted ? 'bg-gold' : 'bg-white/10'}`} aria-hidden="true" />
                                                        )}
                                                        <div className={`relative flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full border-2 ${p.isCompleted ? 'border-gold bg-gold/20' : 'border-white/10 bg-[#151515]'}`}>
                                                            {p.isCompleted ? (
                                                                <CheckCircle className="h-4 w-4 text-gold" />
                                                            ) : (
                                                                <div className="h-2 w-2 bg-white/20 rounded-full" />
                                                            )}
                                                        </div>
                                                        <div className="ml-4 min-w-0 flex-1 flex justify-between items-center">
                                                            <p className={`text-sm font-bold ${p.isCompleted ? 'text-white' : 'text-white/40'}`}>
                                                                {p.hop.title}
                                                            </p>
                                                            {p.isCompleted ? (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                                    Completed
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/10">
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Club Comment */}
                                    {resultData.clubComment && (
                                        <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-3xl">
                                            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">Message from the Club</h4>
                                            <p className="text-white/80 leading-relaxed italic">"{resultData.clubComment}"</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-8">
                                    {/* Marks Summary */}
                                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-2xl rounded-full" />
                                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Total Score</h4>
                                        <div className="flex items-baseline mb-6">
                                            <span className="text-5xl font-black text-white tracking-tighter">{resultData.totalMarks || 0}</span>
                                            <span className="ml-2 text-sm text-gold font-bold uppercase">pts</span>
                                        </div>
                                        
                                        <div className="pt-6 border-t border-white/5">
                                            <h5 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Individual Marks</h5>
                                            <ul className="space-y-4">
                                                {resultData.judgeMarks && resultData.judgeMarks.length > 0 ? (
                                                    resultData.judgeMarks.map((jm: any) => (
                                                        <li key={jm.id} className="flex justify-between items-center text-sm">
                                                            <span className="text-white/60 font-medium">{jm.judge.name}</span>
                                                            <span className="font-bold bg-white/5 px-3 py-1 rounded-lg text-white border border-white/10">{jm.mark}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-sm text-white/30 italic">No marks available</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-center">
                                        <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-sm font-bold text-white mb-2">Get Your Report</h4>
                                        <p className="text-xs text-white/40 mb-6">Receive a detailed copy of your panel application result directly in your inbox.</p>
                                        <button 
                                            onClick={sendEmail}
                                            disabled={emailSending}
                                            className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-black bg-gold hover:bg-[#F0C040] transition-colors shadow-xl shadow-gold/10 ${emailSending ? 'opacity-75 cursor-not-allowed' : ''}`}
                                        >
                                            {emailSending ? 'Sending...' : 'Send Report via Email'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
