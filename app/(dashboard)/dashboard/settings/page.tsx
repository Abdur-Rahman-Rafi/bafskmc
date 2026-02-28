"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Camera, Save, Loader2, Phone, BookOpen,
    FileText, Briefcase, CheckCircle2, AlertCircle, Upload
} from "lucide-react";

export default function StudentSettingsPage() {
    const { data: session, update } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        studentClass: "",
        section: "",
        roll: "",
        bio: "",
        experience: "",
        image: "",
    });

    useEffect(() => {
        fetch("/api/profile")
            .then(r => r.json())
            .then(data => {
                setProfile(data);
                setForm({
                    name: data.name || "",
                    phone: data.phone || "",
                    studentClass: data.class || "",
                    section: data.section || "",
                    roll: data.roll || "",
                    bio: data.bio || "",
                    experience: data.experience || "",
                    image: data.image || "",
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate image
        if (!file.type.startsWith("image/")) {
            showToast("error", "Please select an image file (JPG, PNG, etc.)");
            return;
        }

        setUploadingPic(true);
        const fd = new FormData();
        fd.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (res.ok) {
                setForm(f => ({ ...f, image: data.url }));
                showToast("success", "Profile photo uploaded!");
            } else {
                showToast("error", data.error || "Upload failed");
            }
        } catch {
            showToast("error", "Upload failed");
        } finally {
            setUploadingPic(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                showToast("success", "Profile saved successfully!");
                await update();
            } else {
                const d = await res.json();
                showToast("error", d.error || "Failed to save");
            }
        } catch {
            showToast("error", "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 max-w-3xl">
            {/* Dashboard Alerts */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                        className={`fixed top-8 right-8 z-[100] flex items-center space-x-4 px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl border ${toast.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                    >
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${toast.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] opacity-40 mb-0.5">System Message</span>
                            <span>{toast.msg}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                    MY <span className="text-gold">PROFILE</span>
                </h1>
                <p className="text-white/30 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                    Account Settings • Personal Information
                </p>
            </div>

            {/* Profile Picture */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#151515] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />
                <div className="flex items-center space-x-4 mb-8">
                    <Camera className="h-5 w-5 text-gold" />
                    <h2 className="text-white font-black uppercase tracking-widest text-sm">Profile Photo</h2>
                </div>

                <div className="flex items-center space-x-8">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="h-28 w-28 rounded-[1.5rem] border-2 border-gold/30 overflow-hidden bg-white/5 flex-shrink-0 shadow-2xl">
                            {form.image ? (
                                <img src={form.image} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-4xl font-black text-gold/40">
                                    {form.name?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>
                        {uploadingPic && (
                            <div className="absolute inset-0 bg-black/60 rounded-[1.5rem] flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-gold animate-spin" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="text-white/50 text-sm font-bold mb-4">
                            Upload a profile photo. JPG, PNG, or WebP. Max 10MB.
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePicUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPic}
                            className="flex items-center space-x-3 px-6 py-4 bg-gold text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gold/20 hover:bg-[#F0C040] transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Upload className="h-4 w-4" />
                            <span>{uploadingPic ? "Uploading..." : "Upload Photo"}</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Personal Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-[#151515] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />
                <div className="flex items-center space-x-4 mb-8">
                    <User className="h-5 w-5 text-gold" />
                    <h2 className="text-white font-black uppercase tracking-widest text-sm">Personal Information</h2>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Full Name</label>
                            <input
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Phone</label>
                            <input
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                                placeholder="+8801..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Bio</label>
                        <textarea
                            value={form.bio}
                            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                            rows={3}
                            placeholder="Tell us a bit about yourself..."
                            className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm resize-none"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Academic Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#151515] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />
                <div className="flex items-center space-x-4 mb-8">
                    <BookOpen className="h-5 w-5 text-gold" />
                    <h2 className="text-white font-black uppercase tracking-widest text-sm">Academic Information</h2>
                </div>

                <div className="grid grid-cols-3 gap-5">
                    <div>
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Class</label>
                        <input
                            value={form.studentClass}
                            onChange={e => setForm(f => ({ ...f, studentClass: e.target.value }))}
                            className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm text-center"
                            placeholder="e.g. 10"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Section</label>
                        <input
                            value={form.section}
                            onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                            className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm text-center"
                            placeholder="e.g. A"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Roll</label>
                        <input
                            value={form.roll}
                            onChange={e => setForm(f => ({ ...f, roll: e.target.value }))}
                            className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm text-center"
                            placeholder="e.g. 42"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Experience */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[#151515] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />
                <div className="flex items-center space-x-4 mb-8">
                    <Briefcase className="h-5 w-5 text-gold" />
                    <h2 className="text-white font-black uppercase tracking-widest text-sm">Experience & Achievements</h2>
                </div>

                <textarea
                    value={form.experience}
                    onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                    rows={6}
                    placeholder="Share your math competition experience, olympiad history, achievements, etc..."
                    className="w-full px-5 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm resize-none leading-relaxed"
                />
            </motion.div>

            {/* Save Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={handleSave}
                disabled={saving}
                className="w-full py-6 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-gold/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 group"
            >
                {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Save className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                )}
                <span>{saving ? "Saving..." : "Save Profile"}</span>
            </motion.button>
        </div>
    );
}
