"use client";

import { useState } from "react";
import { Loader2, Mail, Send, CheckCircle, AlertCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function BroadcastMailPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [audience, setAudience] = useState<"ALL" | "NEW" | "SPECIFIC">("ALL");
    const [specificEmail, setSpecificEmail] = useState("");
    const [senderMode, setSenderMode] = useState<"BAFSKMC" | "BAFSKMC Communications" | "CUSTOM">("BAFSKMC Communications");
    const [customSenderName, setCustomSenderName] = useState("");
    const [newSince, setNewSince] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().slice(0, 10);
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSendBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let confirmMsg = "Are you sure you want to send this email?";
        if (audience === "ALL") {
            confirmMsg = "Are you absolutely sure you want to email ALL registered students? This cannot be undone.";
        } else if (audience === "NEW") {
            confirmMsg = "Are you sure you want to email only the NEW students? This cannot be undone.";
        } else if (audience === "SPECIFIC") {
            confirmMsg = `Are you sure you want to email ${specificEmail}? This cannot be undone.`;
        }

        if (!confirm(confirmMsg)) return;

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch("/api/admin/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    subject, 
                    message,
                    audience,
                    newSince: audience === "NEW" ? new Date(newSince).toISOString() : null,
                    senderName: senderMode === "CUSTOM" ? customSenderName : senderMode,
                    specificEmail: audience === "SPECIFIC" ? specificEmail : null
                })
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
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 shadow-sm">
                            Target Audience
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className={`cursor-pointer p-4 border rounded-2xl flex items-center space-x-3 transition-all ${audience === 'ALL' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                <input type="radio" className="hidden" checked={audience === 'ALL'} onChange={() => setAudience('ALL')} />
                                <div className={`w-4 h-4 rounded-full border-2 flex shrink-0 items-center justify-center ${audience === 'ALL' ? 'border-blue-400' : 'border-white/20'}`}>
                                    {audience === 'ALL' && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                                </div>
                                <span className={`font-bold text-xs ${audience === 'ALL' ? 'text-blue-400' : 'text-white'}`}>All Students</span>
                            </label>
                            
                            <label className={`cursor-pointer p-4 border rounded-2xl flex items-center space-x-3 transition-all ${audience === 'NEW' ? 'bg-gold/10 border-gold/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                <input type="radio" className="hidden" checked={audience === 'NEW'} onChange={() => setAudience('NEW')} />
                                <div className={`w-4 h-4 rounded-full border-2 flex shrink-0 items-center justify-center ${audience === 'NEW' ? 'border-gold' : 'border-white/20'}`}>
                                    {audience === 'NEW' && <div className="w-2 h-2 rounded-full bg-gold" />}
                                </div>
                                <span className={`font-bold text-xs ${audience === 'NEW' ? 'text-gold' : 'text-white'}`}>New Enrolls</span>
                            </label>

                            <label className={`cursor-pointer p-4 border rounded-2xl flex items-center space-x-3 transition-all ${audience === 'SPECIFIC' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                <input type="radio" className="hidden" checked={audience === 'SPECIFIC'} onChange={() => setAudience('SPECIFIC')} />
                                <div className={`w-4 h-4 rounded-full border-2 flex shrink-0 items-center justify-center ${audience === 'SPECIFIC' ? 'border-purple-400' : 'border-white/20'}`}>
                                    {audience === 'SPECIFIC' && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                                </div>
                                <span className={`font-bold text-xs ${audience === 'SPECIFIC' ? 'text-purple-400' : 'text-white'}`}>Specific Email</span>
                            </label>
                        </div>

                        
                        {audience === 'NEW' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 pl-1">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Registered After Date</label>
                                <input
                                    type="date"
                                    value={newSince}
                                    onChange={(e) => setNewSince(e.target.value)}
                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 transition-all font-bold text-white text-sm [color-scheme:dark]"
                                />
                                <p className="text-white/30 text-xs mt-2 italic">Only students who registered strictly on or after this date will receive the email.</p>
                            </motion.div>
                        )}
                        {audience === 'SPECIFIC' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 pl-1">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Recipient Email Address</label>
                                <input
                                    type="email"
                                    required={audience === "SPECIFIC"}
                                    value={specificEmail}
                                    onChange={(e) => setSpecificEmail(e.target.value)}
                                    placeholder="student@example.com"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 transition-all font-bold text-white text-sm"
                                />
                            </motion.div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 shadow-sm">
                            Sender Alias (From Name)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['BAFSKMC', 'BAFSKMC Communications', 'CUSTOM'].map(mode => (
                                <label key={mode} className={`cursor-pointer p-4 border rounded-2xl flex items-center space-x-3 transition-all ${senderMode === mode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                    <input type="radio" className="hidden" checked={senderMode === mode} onChange={() => setSenderMode(mode as any)} />
                                    <div className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${senderMode === mode ? 'border-emerald-400' : 'border-white/20'}`}>
                                        {senderMode === mode && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                                    </div>
                                    <span className={`font-bold text-xs truncate ${senderMode === mode ? 'text-emerald-400' : 'text-white'}`}>{mode === 'CUSTOM' ? 'Custom Name' : mode}</span>
                                </label>
                            ))}
                        </div>
                        {senderMode === 'CUSTOM' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 pl-1">
                                <input
                                    type="text"
                                    required={senderMode === "CUSTOM"}
                                    value={customSenderName}
                                    onChange={(e) => setCustomSenderName(e.target.value)}
                                    placeholder="Enter Custom Sender Name"
                                    className="w-full px-4 py-3 bg-white/5 border border-emerald-500/30 rounded-xl outline-none focus:border-emerald-500/70 transition-all font-bold text-emerald-100 text-sm"
                                />
                            </motion.div>
                        )}
                    </div>

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
