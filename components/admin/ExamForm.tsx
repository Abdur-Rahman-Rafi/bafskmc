"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Loader2,
    AlertCircle,
    Type,
    Calendar,
    Clock,
    Watch,
    FileText,
    ChevronLeft,
    Cpu,
    CheckCircle2,
    Upload
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import FileUploadZone from "./FileUploadZone";

interface ExamFormProps {
    initialData?: {
        id: string;
        name: string;
        description: string;
        regStartTime: string;
        regEndTime: string;
        startTime: string;
        endTime: string;
        duration: number;
        questionFileUrl?: string;
    };
}

export default function ExamForm({ initialData }: ExamFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        regStartTime: initialData?.regStartTime ? new Date(initialData.regStartTime).toISOString().slice(0, 16) : "",
        regEndTime: initialData?.regEndTime ? new Date(initialData.regEndTime).toISOString().slice(0, 16) : "",
        startTime: initialData?.startTime ? new Date(initialData.startTime).toISOString().slice(0, 16) : "",
        endTime: initialData?.endTime ? new Date(initialData.endTime).toISOString().slice(0, 16) : "",
        duration: initialData?.duration || 30,
        questionFileUrl: initialData?.questionFileUrl || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.questionFileUrl) {
            setError("Please upload the question paper (PDF/Image) to continue.");
            setLoading(false);
            return;
        }

        const isEdit = !!initialData;
        const url = isEdit ? `/api/exams/${initialData.id}` : "/api/exams";
        const method = isEdit ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    regStartTime: new Date(formData.regStartTime).toISOString(),
                    regEndTime: new Date(formData.regEndTime).toISOString(),
                    startTime: new Date(formData.startTime).toISOString(),
                    endTime: new Date(formData.endTime).toISOString(),
                }),
            });

            if (!res.ok) throw new Error("Failed to save exam details");

            setShowSuccess(true);
            setTimeout(() => {
                router.push("/admin/exams");
                router.refresh();
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Command Header */}
            <div className="flex items-center space-x-6">
                <Link
                    href="/admin/exams"
                    className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 shadow-sm rounded-2xl text-white/20 hover:text-gold hover:border-gold/20 transition-all"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                        {initialData ? "Refine" : "Initialize"} <span className="text-gold">Trial</span>
                    </h1>
                    <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.2em] mt-1 pl-0.5">Enforcement Protocol • Assessment Oracle</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-16">
                {/* 1. Base Configuration */}
                <div className="space-y-10 group">
                    <div className="flex items-center space-x-4">
                        <div className="h-px bg-white/5 flex-1" />
                        <div className="flex items-center space-x-3 text-gold/40 group-hover:text-gold transition-colors">
                            <Cpu className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Core Parameters</span>
                        </div>
                        <div className="h-px bg-white/5 flex-1" />
                    </div>

                    <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center space-x-4 text-red-500 text-sm font-bold"
                            >
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}

                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center space-x-4 text-emerald-500 text-sm font-bold"
                            >
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                                <p>Success! The trial protocol has been initialized and synchronized.</p>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                    <Type className="h-4 w-4 mr-3 text-gold/60" />
                                    Operation Designation
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="E.G., WEEKLY CALCULUS CHALLENGE #01"
                                    className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white text-xl italic tracking-tight placeholder:text-white/5"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Chronological Window: Registration */}
                            <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] group/window">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="h-2 w-2 rounded-full bg-gold/40" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Enrollment Window</span>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-widest pl-1">Inception</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold transition-all font-bold text-white text-xs"
                                            value={formData.regStartTime}
                                            onChange={(e) => setFormData({ ...formData, regStartTime: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-widest pl-1">Termination</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold transition-all font-bold text-white text-xs"
                                            value={formData.regEndTime}
                                            onChange={(e) => setFormData({ ...formData, regEndTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Chronological Window: Trial */}
                            <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] group/window">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500/40" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest text-emerald-500/60">Execution Window</span>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-widest pl-1">Ignition</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold transition-all font-bold text-white text-xs"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-widest pl-1">Closure</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold transition-all font-bold text-white text-xs"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                        <Watch className="h-4 w-4 mr-3 text-gold/60" />
                                        Temporal Limit (Min)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white text-xl italic tracking-tight placeholder:text-white/5"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                        <FileText className="h-4 w-4 mr-3 text-gold/60" />
                                        Protocol Directives
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="ESTABLISH RULES AND SCORING METRICS..."
                                        className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-medium text-white/50 leading-relaxed placeholder:text-white/5 resize-none text-xs"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Question Paper Upload */}
                <div className="space-y-10 group">
                    <div className="flex items-center space-x-4">
                        <div className="h-px bg-white/5 flex-1" />
                        <div className="flex items-center space-x-3 text-gold/40 group-hover:text-gold transition-colors">
                            <Upload className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Question Repository</span>
                        </div>
                        <div className="h-px bg-white/5 flex-1" />
                    </div>

                    <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 space-y-10 relative overflow-hidden">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <FileText className="h-4 w-4 mr-3 text-gold/60" />
                                Question Protocol (PDF / IMAGE)
                            </label>
                            <FileUploadZone
                                type="file"
                                label="Upload Question Paper"
                                initialUrl={formData.questionFileUrl}
                                onUploadComplete={(url) => setFormData({ ...formData, questionFileUrl: url })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-6 pt-10 border-t border-white/5">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors py-4 px-6"
                    >
                        Abort Trial Inception
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gold text-black px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-[#F0C040] shadow-2xl shadow-gold/10 transition-all active:scale-95 disabled:opacity-5 group"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 group-hover:rotate-12 transition-transform" />}
                        <span>{initialData ? "Refine Trial Protocols" : "Initiate Global Trial"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
