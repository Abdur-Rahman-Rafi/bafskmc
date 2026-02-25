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
    CheckCircle2,
    Calendar,
    MapPin,
    Plus,
    X,
    Paperclip
} from "lucide-react";
import Link from "next/link";
import FileUploadZone from "./FileUploadZone";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityFormProps {
    initialData?: {
        id: string;
        title: string;
        description: string | null;
        category: string;
        date: any;
        location: string | null;
        coverUrl: string | null;
        files: any;
    };
}

export default function ActivityForm({ initialData }: ActivityFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        category: initialData?.category || "Workshop",
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        location: initialData?.location || "",
        coverUrl: initialData?.coverUrl || "",
        files: (initialData?.files as any[]) || [],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isEdit = !!initialData;
        const url = isEdit ? `/api/activities/${initialData.id}` : "/api/activities";
        const method = isEdit ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                const errorMessage = data.details ? `${data.error}: ${data.details}` : (data.error || "Failed to save activity");
                throw new Error(errorMessage);
            }

            setShowSuccess(true);
            setTimeout(() => {
                router.push("/admin/activities");
                router.refresh();
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addFile = (file: { url: string, name: string, size: number, type: string }) => {
        setFormData(prev => ({
            ...prev,
            files: [...prev.files, file]
        }));
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Command Header */}
            <div className="flex items-center space-x-6">
                <Link
                    href="/admin/activities"
                    className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 shadow-sm rounded-2xl text-white/20 hover:text-gold hover:border-gold/20 transition-all"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                        {initialData ? "Modify" : "Create"} <span className="text-gold">Activity</span>
                    </h1>
                    <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.2em] mt-1 pl-0.5">Club Events • Live Updates • Logistics</p>
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
                        <p>Success! The activity has been logged in the system.</p>
                    </motion.div>
                )}

                <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Type className="h-4 w-4 mr-3 text-gold/60" />
                                Activity Title
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="E.G., NATIONAL MATH OLYMPIAD 2026"
                                className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white text-xl italic tracking-tight placeholder:text-white/5"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <Layers className="h-4 w-4 mr-3 text-gold/60" />
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white appearance-none text-xs uppercase tracking-widest italic"
                                >
                                    <option value="Workshop" className="bg-[#0D0D0D]">Workshop</option>
                                    <option value="Competition" className="bg-[#0D0D0D]">Competition</option>
                                    <option value="Seminar" className="bg-[#0D0D0D]">Seminar</option>
                                    <option value="Social Event" className="bg-[#0D0D0D]">Social Event</option>
                                    <option value="Meeting" className="bg-[#0D0D0D]">Meeting</option>
                                    <option value="Other" className="bg-[#0D0D0D]">Other</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="h-2 w-2 border-r-2 border-b-2 border-white/20 rotate-45" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <Calendar className="h-4 w-4 mr-3 text-gold/60" />
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white text-xs uppercase tracking-widest italic"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1 flex items-center">
                                <MapPin className="h-4 w-4 mr-3 text-gold/60" />
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="E.G., MAIN AUDITORIUM / ONLINE"
                                className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-black text-white text-xs uppercase tracking-widest placeholder:text-white/5"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <FileUploadZone
                                type="image"
                                label="Cover Photo / Banner (Direct Upload)"
                                accept="image/*"
                                initialUrl={formData.coverUrl || undefined}
                                onUploadComplete={(url: string) => setFormData({ ...formData, coverUrl: url })}
                            />
                        </div>

                        {/* Multi-File Upload Section */}
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Paperclip className="h-4 w-4 mr-3 text-gold/60" />
                                Attachments (PDF, DOCX, Images, etc.)
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AnimatePresence>
                                    {formData.files.map((file: any, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group"
                                        >
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <div className="p-2 bg-gold/10 rounded-lg">
                                                    <FileText className="h-4 w-4 text-gold" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-bold text-white truncate">{file.name}</p>
                                                    <p className="text-[8px] text-white/40 uppercase font-black tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(idx)}
                                                className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <FileUploadZone
                                    type="document"
                                    label="Add New Attachment"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*"
                                    onUploadComplete={(url: string, name?: string, size?: number, type?: string) => {
                                        if (url) {
                                            addFile({ url, name: name || "File", size: size || 0, type: type || "unknown" });
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1 flex items-center mb-2">
                                <Database className="h-4 w-4 mr-3 text-gold/60" />
                                Event Details / Description
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Describe the activity, agenda, and important notes..."
                                className="w-full px-8 py-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] outline-none focus:border-gold/50 transition-all font-medium text-white/70 leading-relaxed placeholder:text-white/5 resize-none"
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
                        className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] hover:text-white transition-colors py-4 px-6"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gold text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-[#F0C040] shadow-2xl shadow-gold/10 transition-all active:scale-95 disabled:opacity-50 group"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 group-hover:rotate-12 transition-transform" />}
                        <span>{initialData ? "Update Activity" : "Deploy Activity"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
