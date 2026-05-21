"use client";

import { useState } from "react";
import { Award, Mail, Loader2, User, FileText, CheckCircle2 } from "lucide-react";
import FileUploadZone from "@/components/admin/FileUploadZone";

export default function CertificationZone() {
    const [userEmail, setUserEmail] = useState("");
    const [reason, setReason] = useState("Best Performer of the Month");
    const [customReason, setCustomReason] = useState("");
    const [collegeLogoUrl, setCollegeLogoUrl] = useState<string>("");
    const [clubLogoUrl, setClubLogoUrl] = useState<string>("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const reasons = [
        "Best Performer of the Month",
        "Outstanding Leadership",
        "Event Winner",
        "Valuable Contribution",
        "Custom"
    ];

    const handleIssueCertificate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const finalReason = reason === "Custom" ? customReason : reason;

        if (!userEmail || !finalReason) {
            setError("Email and Reason are required.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/admin/issue-certificate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    reason: finalReason,
                    collegeLogoUrl,
                    clubLogoUrl
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to issue certificate.");
            }

            setSuccess("Certificate issued and sent successfully!");
            setUserEmail("");
            setCustomReason("");
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-[2rem] p-8" style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)", border: "1px solid rgba(201, 150, 43, 0.2)" }}>
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Award className="w-48 h-48 text-gold" style={{ color: "#C9962B" }} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-gold/10 rounded-2xl" style={{ backgroundColor: "rgba(201, 150, 43, 0.1)" }}>
                            <Award className="h-6 w-6" style={{ color: "#C9962B" }} />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Certification Zone</h1>
                    </div>
                    <p className="text-white/50 text-sm font-medium max-w-xl">
                        Generate and issue digital certificates to users. The certificate will automatically be sent to the user's email as an attachment.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleIssueCertificate} className="bg-[#0D0D0D] p-8 rounded-[2rem] border border-white/5 space-y-6">
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Email */}
                    <div className="space-y-3">
                        <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1 flex items-center">
                            <User className="h-3 w-3 mr-2" style={{ color: "#C9962B" }} />
                            User Email
                        </label>
                        <input
                            type="email"
                            required
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="student@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-semibold"
                            style={{ focusRingColor: "rgba(201, 150, 43, 0.5)" }}
                        />
                    </div>

                    {/* Reason */}
                    <div className="space-y-3">
                        <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1 flex items-center">
                            <FileText className="h-3 w-3 mr-2" style={{ color: "#C9962B" }} />
                            Reason / Title
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-semibold appearance-none"
                            style={{ focusRingColor: "rgba(201, 150, 43, 0.5)" }}
                        >
                            {reasons.map(r => <option key={r} value={r} className="bg-[#1A1A1A]">{r}</option>)}
                        </select>
                    </div>
                </div>

                {reason === "Custom" && (
                    <div className="space-y-3">
                        <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1 flex items-center">
                            <FileText className="h-3 w-3 mr-2" style={{ color: "#C9962B" }} />
                            Custom Reason
                        </label>
                        <input
                            type="text"
                            required
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            placeholder="Enter custom reason or title"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-semibold"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <FileUploadZone
                        label="College Logo (Optional)"
                        onUploadComplete={(url) => setCollegeLogoUrl(url)}
                        isPublic={true}
                    />
                    <FileUploadZone
                        label="Club Logo (Optional)"
                        onUploadComplete={(url) => setClubLogoUrl(url)}
                        isPublic={true}
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
                                <span>Generating & Sending...</span>
                            </>
                        ) : (
                            <>
                                <Mail className="h-5 w-5" />
                                <span>Issue & Email Certificate</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
