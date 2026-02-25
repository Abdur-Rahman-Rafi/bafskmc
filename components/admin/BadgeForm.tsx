"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Type,
    Trophy,
    User,
    Zap,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import FileUploadZone from "./FileUploadZone";
import { motion } from "framer-motion";

interface BadgeFormProps {
    initialData?: {
        id: string;
        title: string;
        description: string;
        badgeUrl: string;
        userId: string;
        points?: number;
    };
    userId?: string; // Pre-selected recipient
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function BadgeForm({ initialData, userId, onSuccess, onCancel }: BadgeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        badgeUrl: initialData?.badgeUrl || "",
        userId: initialData?.userId || userId || "",
        points: initialData?.points || 50,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isEdit = !!initialData;
        const url = isEdit ? `/api/achievements/${initialData.id}` : "/api/achievements";
        const method = isEdit ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    points: Number(formData.points)
                }),
            });

            if (!res.ok) throw new Error("Failed to save achievement details");

            setShowSuccess(true);
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push("/admin/achievements");
                    router.refresh();
                }
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            {!onSuccess && (
                <div className="flex items-center space-x-6">
                    <Link
                        href="/admin/achievements"
                        className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 shadow-sm rounded-2xl text-white/20 hover:text-gold hover:border-gold/20 transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                            {initialData ? "Edit" : "New"} <span className="text-gold">Award</span>
                        </h1>
                        <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.2em] mt-1 pl-0.5">Recognition Protocol Initialization</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center space-x-4 text-red-500 text-sm font-bold"
                    >
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="tracking-tight">{error}</p>
                    </motion.div>
                )}

                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center space-x-4 text-emerald-500 text-sm font-bold"
                    >
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <p className="tracking-tight">Success! Achievement protocol confirmed. Finalizing data...</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center">
                            <Trophy className="h-3 w-3 mr-2 text-gold/60" />
                            Official Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., MATHEMATICAL GLADIATOR"
                            className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white placeholder:text-white/10 italic text-lg"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center">
                            <User className="h-3 w-3 mr-2 text-gold/60" />
                            Target Student (User ID)
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="RECIPIENT_ID_001"
                            className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white placeholder:text-white/10"
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center">
                            <Zap className="h-3 w-3 mr-2 text-gold/60" />
                            Points / XP
                        </label>
                        <input
                            type="number"
                            required
                            className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white"
                            value={formData.points}
                            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                        <FileUploadZone
                            type="image"
                            label="Visual Insignia (Badge Icon)"
                            accept="image/*"
                            initialUrl={formData.badgeUrl}
                            onUploadComplete={(url: string) => setFormData({ ...formData, badgeUrl: url })}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center">
                            <Type className="h-3 w-3 mr-2 text-gold/60" />
                            Honor Citation (Description)
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe the exceptional performance warranting this honor..."
                            className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-[2rem] outline-none focus:border-gold/50 transition-all font-medium text-white/50 leading-relaxed placeholder:text-white/10 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-6 pt-6 border-t border-white/5">
                    <button
                        type="button"
                        onClick={onCancel || (() => router.back())}
                        className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors py-4 px-6"
                    >
                        Abort Sequence
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gold text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-[#F0C040] shadow-2xl shadow-gold/10 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        <span>{initialData ? "Update Record" : "Confirm Award"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
