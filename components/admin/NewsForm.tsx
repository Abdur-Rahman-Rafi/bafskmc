"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    ArrowLeft,
    Loader2,
    AlertCircle,
    FileText,
    Type,
    Sparkles,
    Eye,
    ChevronLeft,
    CheckCircle2,
    Paperclip,
    Layout
} from "lucide-react";
import Link from "next/link";
import FileUploadZone from "./FileUploadZone";
import { motion } from "framer-motion";

interface NewsFormProps {
    initialData?: {
        id: string;
        title: string;
        content: string;
        imageUrl?: string;
        fileUrl?: string;
        type?: "ARTICLE" | "NOTICE";
    };
}

export default function NewsForm({ initialData }: NewsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        content: initialData?.content || "",
        imageUrl: initialData?.imageUrl || "",
        fileUrl: initialData?.fileUrl || "",
        type: initialData?.type || "ARTICLE",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isEdit = !!initialData;
        const url = isEdit ? `/api/news/${initialData.id}` : "/api/news";
        const method = isEdit ? "PATCH" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save article");

            setShowSuccess(true);
            setTimeout(() => {
                router.push("/admin/news");
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
                    href="/admin/news"
                    className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 shadow-sm rounded-2xl text-white/20 hover:text-gold hover:border-gold/20 transition-all"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                        {initialData ? "Refine" : "Create"} <span className="text-gold">Bulletin</span>
                    </h1>
                    <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.2em] mt-1 pl-0.5">Editorial Interface • Public Records Update</p>
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
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                        <p>Success! The bulletin has been broadcasted successfully.</p>
                    </motion.div>
                )}

                <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                            <Type className="h-4 w-4 mr-3 text-gold/60" />
                            Headline Intelligence
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="TRANSMIT ARTICLE TITLE..."
                            className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white text-xl italic tracking-tight placeholder:text-white/5"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Layout className="h-4 w-4 mr-3 text-gold/60" />
                                Bulletin Category
                            </label>
                            <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: "ARTICLE" })}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${formData.type === "ARTICLE" ? "bg-gold text-black shadow-lg shadow-gold/20" : "text-white/30 hover:text-white/50"}`}
                                >
                                    Article
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: "NOTICE" })}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${formData.type === "NOTICE" ? "bg-gold text-black shadow-lg shadow-gold/20" : "text-white/30 hover:text-white/50"}`}
                                >
                                    Notice
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <Sparkles className="h-4 w-4 mr-3 text-gold/60" />
                                Visual Asset (Featured)
                            </label>
                            <FileUploadZone
                                type="image"
                                label="Featured Image (Optional)"
                                accept="image/*"
                                initialUrl={formData.imageUrl}
                                onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                            />
                        </div>
                    </div>

                    {formData.type === "NOTICE" && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <Paperclip className="h-4 w-4 mr-3 text-gold/60" />
                                Operational Notice Attachment (PDF, JPG, etc.)
                            </label>
                            <FileUploadZone
                                type="document"
                                label="Upload Notice Document"
                                initialUrl={formData.fileUrl}
                                onUploadComplete={(url) => setFormData({ ...formData, fileUrl: url })}
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                            <FileText className="h-4 w-4 mr-3 text-gold/60" />
                            Article Body Transmission
                        </label>
                        <textarea
                            required
                            rows={12}
                            placeholder="Detail the report contents here. Use markdown for enhanced structural integrity..."
                            className="w-full px-8 py-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] outline-none focus:border-gold/50 transition-all font-medium text-white/50 leading-relaxed placeholder:text-white/5 resize-none"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
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
                        <span>{initialData ? "Refine Bulletin" : "Broadcast Article"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
