"use client";

import { useState } from "react";
import { Send, AlertCircle, Loader2 } from "lucide-react";

export default function ReportChairmanPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/admin/report-chairman", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send report");
            }

            setSuccess(true);
            setTitle("");
            setContent("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Report to Chairman</h1>
                <p className="text-white/50 text-sm mt-1">
                    Send a direct, confidential report to the Chairman of the Alumni Association. A PDF report will be automatically generated and emailed.
                </p>
            </div>

            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 shadow-xl">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-red-400">
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start space-x-3 text-green-400">
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">Report has been generated and successfully sent to the Chairman.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                            Report Subject
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Activity Status for May 2026"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">
                            Report Details
                        </label>
                        <textarea
                            required
                            placeholder="Provide a detailed description..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3 bg-gold hover:bg-gold/90 text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            <span>{loading ? "Generating & Sending..." : "Send Report"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
