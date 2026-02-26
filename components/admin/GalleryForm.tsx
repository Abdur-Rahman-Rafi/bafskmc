"use client";

import { useState } from "react";
import { Camera, X, Check, Loader2 } from "lucide-react";
import UploadZone from "./UploadZone";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: any;
}

export default function GalleryForm({ onSuccess, onCancel, initialData }: GalleryFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
    const [category, setCategory] = useState(initialData?.category || "Events");
    const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl) return setError("Please upload an image first");

        setSubmitting(true);
        setError("");

        try {
            const method = initialData ? "PATCH" : "POST";
            const url = initialData ? `/api/gallery/${initialData.id}` : "/api/gallery";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, imageUrl, category, date }),
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                setError(data.error || "Submission failed");
            }
        } catch (err) {
            setError("Connection protocol error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#151515] border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                        {initialData ? "UPDATE" : "ADD"} <span className="text-gold">MEMORY</span>
                    </h2>
                    <p className="text-white/30 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Gallery Asset Management
                    </p>
                </div>
                <button onClick={onCancel} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 transition-all">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {error && (
                <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 ml-1">Memory Image</label>
                        <UploadZone onUploadComplete={setImageUrl} initialImage={imageUrl} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 ml-1">Moment Title</label>
                            <input
                                type="text"
                                required
                                placeholder="E.G., MATH OLYMPIAD 2024"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-gold/30 transition-all font-bold placeholder:text-white/10 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 ml-1">Collection Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-gold/30 transition-all font-bold text-sm appearance-none"
                            >
                                <option value="Events">Events</option>
                                <option value="Workshops">Workshops</option>
                                <option value="Community">Community</option>
                                <option value="Planning">Planning</option>
                                <option value="Academic">Academic</option>
                                <option value="General">General</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 ml-1">Occurrence Date</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-gold/30 transition-all font-bold text-sm"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white/40 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Abort
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-[2] py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-gold/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
                    >
                        {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Commit to Gallery</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
