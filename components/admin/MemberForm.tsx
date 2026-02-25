"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Loader2,
    AlertCircle,
    User,
    Facebook,
    Hash,
    Shield,
    FileText,
    Info,
    Calendar,
    ChevronLeft,
    Fingerprint
} from "lucide-react";
import Link from "next/link";
import FileUploadZone from "./FileUploadZone";
import { motion } from "framer-motion";

interface MemberFormProps {
    initialData?: {
        id: string;
        name: string;
        position: string;
        priority: number;
        fbId: string | null;
        type: string;
        bio: string | null;
        session: string | null;
        image: string | null;
    };
}

export default function MemberForm({ initialData }: MemberFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        position: initialData?.position || "",
        priority: initialData?.priority?.toString() || "0",
        fbId: initialData?.fbId || "",
        type: initialData?.type || "PANEL",
        bio: initialData?.bio || "",
        session: initialData?.session || "",
        image: initialData?.image || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isEdit = !!initialData;
        const url = isEdit ? `/api/members/${initialData.id}` : "/api/members";
        const method = isEdit ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save member profile");

            setShowSuccess(true);
            setTimeout(() => {
                router.push("/admin/members");
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
                    href="/admin/members"
                    className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 shadow-sm rounded-2xl text-white/20 hover:text-gold hover:border-gold/20 transition-all"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                        {initialData ? "Edit" : "Register"} <span className="text-gold">Personnel</span>
                    </h1>
                    <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.2em] mt-1 pl-0.5">Registry Management • Personnel Protocol</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
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
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p>Success! Personnel registry updated. Redirecting...</p>
                    </motion.div>
                )}

                <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <User className="h-4 w-4 mr-3 text-gold/60" />
                                Legal Identity
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="E.G., AHSAN HABIB"
                                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white text-xl italic tracking-tight placeholder:text-white/5"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Fingerprint className="h-4 w-4 mr-3 text-gold/60" />
                                Rank / Designation
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="E.G., PRESIDENT"
                                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white/70 italic tracking-widest text-xs uppercase"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Hash className="h-4 w-4 mr-3 text-gold/60" />
                                Display Priority (Lower = First)
                            </label>
                            <input
                                type="number"
                                required
                                placeholder="E.G., 1"
                                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white placeholder:text-white/5"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Facebook className="h-4 w-4 mr-3 text-gold/60" />
                                Facebook ID (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="E.G., ahsan.habib.123"
                                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white/60 placeholder:text-white/5 text-xs tracking-widest uppercase italic"
                                value={formData.fbId}
                                onChange={(e) => setFormData({ ...formData, fbId: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Shield className="h-4 w-4 mr-3 text-gold/60" />
                                Personnel Category
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white/60 appearance-none text-xs uppercase tracking-widest italic"
                                >
                                    <option value="PANEL" className="bg-[#0D0D0D]">Executive Panel</option>
                                    <option value="ALUMNI" className="bg-[#0D0D0D]">Alumni Association</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="h-2 w-2 border-r-2 border-b-2 border-white/20 rotate-45" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Calendar className="h-4 w-4 mr-3 text-gold/60" />
                                Active Timeline (Session)
                            </label>
                            <input
                                type="text"
                                placeholder="E.G., 2024-2025"
                                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white/60 placeholder:text-white/5 text-xs tracking-widest uppercase italic"
                                value={formData.session}
                                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Info className="h-4 w-4 mr-3 text-gold/60" />
                                Visual Identity (Avatar)
                            </label>
                            <FileUploadZone
                                type="image"
                                label="Personnel Avatar"
                                initialUrl={formData.image}
                                onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <FileText className="h-4 w-4 mr-3 text-gold/60" />
                                Personnel Bio / Dossier
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Provide detailed biographical data and contributions..."
                                className="w-full px-8 py-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] outline-none focus:border-gold/50 transition-all font-medium text-white/50 leading-relaxed placeholder:text-white/5 resize-none"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-6 pt-6 border-t border-white/5">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors py-4 px-6"
                    >
                        Abort Protocol
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gold text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-[#F0C040] shadow-2xl shadow-gold/10 transition-all active:scale-95 disabled:opacity-50 group"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 group-hover:rotate-12 transition-transform" />}
                        <span>{initialData ? "Refine Personnel Profile" : "Execute Registration"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
