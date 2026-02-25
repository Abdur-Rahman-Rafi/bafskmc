"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Loader2,
    AlertCircle,
    FileText,
    Type,
    Layers,
    ChevronLeft,
    Database,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import FileUploadZone from "./FileUploadZone";
import { motion } from "framer-motion";

interface ResourceFormProps {
    initialData?: {
        id: string;
        title: string;
        description: string | null;
        fileUrl: string;
        imageUrl: string | null;
        category: string;
    };
}

export default function ResourceForm({ initialData }: ResourceFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        fileUrl: initialData?.fileUrl || "",
        imageUrl: initialData?.imageUrl || "",
        category: initialData?.category || "Calculus",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isEdit = !!initialData;
        const url = isEdit ? `/api/resources/${initialData.id}` : "/api/resources";
        const method = isEdit ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save resource");

            setShowSuccess(true);
            setTimeout(() => {
                router.push("/admin/resources");
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
                    href="/admin/resources"
                    className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 shadow-sm rounded-2xl text-white/20 hover:text-gold hover:border-gold/20 transition-all"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                        {initialData ? "Edit" : "Archive"} <span className="text-gold">Asset</span>
                    </h1>
                    <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.2em] mt-1 pl-0.5">Library Expansion • Information Sovereignty</p>
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
                        <p>Success! The asset has been archived in the matrix database.</p>
                    </motion.div>
                )}

                <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Type className="h-4 w-4 mr-3 text-gold/60" />
                                Resource Designation
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="E.G., DIFFERENTIAL EQUATIONS MASTERCLASS"
                                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white text-xl italic tracking-tight placeholder:text-white/5"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <Layers className="h-4 w-4 mr-3 text-gold/60" />
                                Classification
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white/60 appearance-none text-xs uppercase tracking-widest italic"
                                >
                                    <option value="Calculus" className="bg-[#0D0D0D]">Calculus</option>
                                    <option value="Algebra" className="bg-[#0D0D0D]">Algebra</option>
                                    <option value="Geometry" className="bg-[#0D0D0D]">Geometry</option>
                                    <option value="Combinatorics" className="bg-[#0D0D0D]">Combinatorics</option>
                                    <option value="Past Papers" className="bg-[#0D0D0D]">Past Papers</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="h-2 w-2 border-r-2 border-b-2 border-white/20 rotate-45" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <FileUploadZone
                                type="image"
                                label="Preview Image (Optional)"
                                accept="image/*"
                                initialUrl={formData.imageUrl}
                                onUploadComplete={(url: string) => setFormData({ ...formData, imageUrl: url })}
                            />
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <FileUploadZone
                                type="document"
                                label="Resource File (PDF, DOC, DOCX, PPT, etc.) *"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*"
                                initialUrl={formData.fileUrl}
                                onUploadComplete={(url: string) => setFormData({ ...formData, fileUrl: url })}
                            />
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Database className="h-4 w-4 mr-3 text-gold/60" />
                                Archive Metadata (Description)
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Detail the technical specifications and coverage of this repository..."
                                className="w-full px-8 py-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] outline-none focus:border-gold/50 transition-all font-medium text-white/50 leading-relaxed placeholder:text-white/5 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                        Cancel Transmission
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gold text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-[#F0C040] shadow-2xl shadow-gold/10 transition-all active:scale-95 disabled:opacity-50 group"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 group-hover:rotate-12 transition-transform" />}
                        <span>{initialData ? "Update Matrix" : "Upload to Archive"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
