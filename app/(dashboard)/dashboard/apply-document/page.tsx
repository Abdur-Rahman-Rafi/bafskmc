"use client";

import { useState } from "react";
import { FileText, Loader2, CheckCircle2, Send } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ApplyDocumentPage() {
    const { data: session } = useSession();
    const [type, setType] = useState("CERTIFICATE");
    const [reason, setReason] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (!reason) {
            setError("Please provide a reason or details for your application.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/student/apply-document", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, reason })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit application.");
            }

            setSuccess(`Your application for a ${type.toLowerCase()} has been submitted successfully. The administration will review it shortly.`);
            setReason("");
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-[2rem] p-8" style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)", border: "1px solid rgba(201, 150, 43, 0.2)" }}>
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <FileText className="w-48 h-48 text-gold" style={{ color: "#C9962B" }} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-gold/10 rounded-2xl" style={{ backgroundColor: "rgba(201, 150, 43, 0.1)" }}>
                            <FileText className="h-6 w-6" style={{ color: "#C9962B" }} />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Apply for Documents</h1>
                    </div>
                    <p className="text-white/50 text-sm font-medium max-w-xl">
                        Request an official Certificate of Achievement or a Testimonial from the club administration. Your request will be reviewed and emailed to you once approved.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-[#0D0D0D] p-8 rounded-[2rem] border border-white/5 space-y-6">
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3 text-red-500">
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}
                
                {success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-3 text-emerald-500">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="text-sm font-bold">{success}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1 flex items-center">
                        Document Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-semibold appearance-none"
                    >
                        <option value="CERTIFICATE" className="bg-[#1A1A1A]">Certificate of Achievement</option>
                        <option value="TESTIMONIAL" className="bg-[#1A1A1A]">Official Testimonial</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1 flex items-center">
                        Reason / Details
                    </label>
                    <textarea
                        required
                        rows={4}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={`Please describe why you are requesting this ${type.toLowerCase()} (e.g. "I was the best performer in January 2026")`}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-semibold resize-none"
                    />
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                        style={{ background: "linear-gradient(135deg, #C9962B 0%, #8B6914 100%)", color: "#0D0D0D" }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Submitting Request...</span>
                            </>
                        ) : (
                            <>
                                <Send className="h-5 w-5" />
                                <span>Submit Application</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
