"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Calendar, Link as LinkIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AppStatus {
    id: string;
    name: string;
    status: string;
    vivaTime: string | null;
    vivaLink: string | null;
}

export default function ApplicationStatusPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusData, setStatusData] = useState<AppStatus | null>(null);
    const [waitTime, setWaitTime] = useState<string>("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setStatusData(null);

        try {
            const res = await fetch(`/api/apply-panel/status?email=${encodeURIComponent(email)}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Application not found");
            }
            const data = await res.json();
            setStatusData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="bg-[#0D0D0D] min-h-screen pt-32 pb-20">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-white italic tracking-tight mb-4">
                        Applicant <span className="text-gold">Status</span>
                    </h1>
                    <p className="text-white/50 text-sm">Enter your registered email to check your Panel Application and Viva status.</p>
                </div>

                <form onSubmit={handleSearch} className="relative mb-12">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-white/30" />
                    </div>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        className="w-full pl-14 pr-32 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white placeholder:text-white/20 shadow-2xl"
                    />
                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="absolute right-2 top-2 bottom-2 bg-gold text-black px-8 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#F0C040] transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Check"}
                    </button>
                </form>

                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-4 text-red-500 text-sm font-bold mb-8">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </motion.div>
                )}

                {statusData && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#151515] border border-gold/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-gold/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] pointer-events-none" />
                        
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                            <div>
                                <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Applicant</p>
                                <h2 className="text-2xl font-black text-white">{statusData.name}</h2>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                                statusData.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                statusData.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                statusData.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                statusData.status === 'VIVA_SCHEDULED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-gold/10 text-gold border-gold/20'
                            }`}>
                                {statusData.status.replace("_", " ")}
                            </div>
                        </div>

                        {statusData.status === 'COMPLETED' || statusData.status === 'ACCEPTED' ? (
                            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col items-center text-center space-y-4">
                                <CheckCircle className="h-12 w-12 text-emerald-500" />
                                <div>
                                    <h3 className="text-emerald-400 font-bold text-lg">Application Successful!</h3>
                                    <p className="text-white/60 text-sm mt-2">Your application and viva have been processed. Congratulations, or thank you for participating!</p>
                                </div>
                            </div>
                        ) : statusData.vivaTime ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="flex items-center space-x-3 text-gold mb-2">
                                            <Calendar className="h-5 w-5" />
                                            <span className="text-xs font-black uppercase tracking-widest">Scheduled Viva</span>
                                        </div>
                                        <p className="text-white font-medium">{new Date(statusData.vivaTime).toLocaleString()}</p>
                                    </div>
                                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="flex items-center space-x-3 text-blue-400 mb-2">
                                            <Clock className="h-5 w-5" />
                                            <span className="text-xs font-black uppercase tracking-widest">Wait Time</span>
                                        </div>
                                        <p className="text-white font-medium">{waitTime || "Calculating..."}</p>
                                    </div>
                                </div>
                                
                                {statusData.vivaLink && (
                                    <div className="p-6 bg-gold/5 border border-gold/20 rounded-2xl">
                                        <h3 className="text-sm font-bold text-gold mb-4 flex items-center">
                                            <LinkIcon className="h-4 w-4 mr-2" />
                                            Viva Meeting Link
                                        </h3>
                                        <a href={statusData.vivaLink} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-gold text-black text-center rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#F0C040] transition-colors">
                                            Join Meeting Now
                                        </a>
                                        <p className="text-center text-white/40 text-[10px] uppercase tracking-widest mt-4">Please join exactly at your scheduled time.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl">
                                <Clock className="h-8 w-8 text-white/20 mx-auto mb-4" />
                                <p className="text-white/60 text-sm">Your application is currently under review. Please check back later for your Viva schedule.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
