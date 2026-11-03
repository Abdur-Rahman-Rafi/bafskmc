"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Loader2,
    AlertCircle,
    User,
    Facebook,
    Hash,
    Shield,
    BookOpen,
    Layers,
    ChevronLeft
} from "lucide-react";
import Link from "next/link";
import FileUploadZone from "./FileUploadZone";
import { motion } from "framer-motion";
import { SectionRep } from "@/app/api/sr/route";

interface SRFormProps {
    initialData?: SectionRep;
}

export default function SRForm({ initialData }: SRFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        class: initialData?.class || "Class 11",
        section: initialData?.section || "",
        priority: initialData?.priority?.toString() || "1",
        fbId: initialData?.fbId || "",
        image: initialData?.image || "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                class: initialData.class || "Class 11",
                section: initialData.section || "",
                priority: initialData.priority?.toString() || "1",
                fbId: initialData.fbId || "",
                image: initialData.image || "",
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isEdit = !!initialData;
        const url = isEdit ? `/api/sr/${initialData.id}` : "/api/sr";
        const method = isEdit ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to save Section Representative");
            }

            setShowSuccess(true);
            setTimeout(() => {
                router.push("/admin/sr");
                router.refresh();
            }, 1200);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-24">
            {/* Command Header */}
            <div className="flex items-center space-x-6">
                <Link
                    href="/admin/sr"
                    className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white/30 hover:text-gold hover:border-gold/30 transition-all"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
                        {initialData ? "Refine" : "Register"} <span className="text-gold">Section Representative</span>
                    </h1>
                    <p className="text-white/30 font-black uppercase text-[10px] tracking-[0.2em] mt-1">
                        Classroom Ambassador Network • Profile Registry
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-400 text-sm font-bold"
                    >
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </motion.div>
                )}

                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-emerald-400 text-sm font-bold"
                    >
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <p>Success! SR record synchronized. Redirecting to registry...</p>
                    </motion.div>
                )}

                <div className="bg-[#151515] rounded-[2.5rem] border border-white/5 shadow-2xl p-8 md:p-10 space-y-8 relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <User className="h-3.5 w-3.5 mr-2 text-gold/70" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Mahir Faysal"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 font-bold text-white text-base placeholder:text-white/10 transition-all"
                            />
                        </div>

                        {/* Class */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <BookOpen className="h-3.5 w-3.5 mr-2 text-gold/70" />
                                Academic Class
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Class 11, Class 12, Class 10"
                                value={formData.class}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 font-bold text-white text-base placeholder:text-white/10 transition-all"
                            />
                        </div>

                        {/* Section */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <Layers className="h-3.5 w-3.5 mr-2 text-gold/70" />
                                Section Name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Titan, Mars, Jupiter, Venus, Alpha"
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 font-bold text-white text-base placeholder:text-white/10 transition-all"
                            />
                        </div>

                        {/* Display Priority */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <Hash className="h-3.5 w-3.5 mr-2 text-gold/70" />
                                Priority Order (Lower = Shown First)
                            </label>
                            <input
                                type="number"
                                required
                                placeholder="e.g. 1"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 font-bold text-white text-base placeholder:text-white/10 transition-all"
                            />
                        </div>

                        {/* Facebook ID */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <Facebook className="h-3.5 w-3.5 mr-2 text-gold/70" />
                                Facebook Username or ID (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. mahir.faysal.10"
                                value={formData.fbId}
                                onChange={(e) => setFormData({ ...formData, fbId: e.target.value })}
                                className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 font-bold text-white/80 text-sm placeholder:text-white/10 transition-all font-mono"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2 space-y-3">
                            <FileUploadZone
                                type="image"
                                label="SR Portrait / Photograph"
                                initialUrl={formData.image}
                                onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit buttons */}
                <div className="flex items-center justify-end space-x-6 pt-4 border-t border-white/5">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-xs font-black text-white/30 uppercase tracking-widest hover:text-white transition-colors py-4 px-6"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gold text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-[#F0C040] shadow-xl shadow-gold/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        <span>{initialData ? "Update SR Profile" : "Register SR"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
