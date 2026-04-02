"use client";

import { useState } from "react";
import { Loader2, Mail, Send, CheckCircle, AlertCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function BroadcastMailPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSendBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!confirm("Are you absolutely sure you want to email ALL registered students? This cannot be undone.")) return;

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch("/api/admin/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send broadcast.");
            }

            setSuccessMessage(data.message);
            setSubject("");
            setMessage("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 pb-20">
            {/* Header section */}
            <div>
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center">
                    Broadcast <span className="text-gold ml-2">Mail</span>
                </h1>
                <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-1">Mass communication protocol</p>
            </div>

            {/* Form Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#151515] border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-white/5">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Users className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Global Announcement</h2>
                        <p className="text-sm text-white/50">Send an automated, one-tap email directly to every student in the database.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-4 text-red-500 font-bold text-sm">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-4 text-emerald-400 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <p>{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSendBroadcast} className="space-y-6 relative z-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 shadow-sm">
                            Email Subject Line
                        </label>
                        <input
                            type="text"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Important Update regarding Mock Exams"
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white placeholder:text-white/20"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 shadow-sm">
                            Email Body Message
                        </label>
                        <textarea
                            required
                            rows={8}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type the full announcement content here. This will be sent as a formatted HTML email..."
                            className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all text-white/80 font-medium placeholder:text-white/20 resize-none leading-relaxed"
                        />
                        <p className="text-white/20 text-xs italic pl-2 mt-2">Line breaks will be preserved.</p>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !subject || !message}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center space-x-3 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group w-full md:w-auto justify-center hover:shadow-blue-500/40"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            )}
                            <span>Send Global Broadcast</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
