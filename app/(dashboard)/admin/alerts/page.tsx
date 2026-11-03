"use client";

import { useEffect, useState } from "react";
import {
    Bell,
    Save,
    Loader2,
    CheckCircle,
    AlertCircle,
    Trophy,
    Megaphone,
    Sparkles,
    Eye,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminAlertsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const [form, setForm] = useState({
        enabled: true,
        type: "COMPETITION" as "COMPETITION" | "NEWS" | "GENERAL",
        badge: "NEW COMPETITION",
        title: "National Math Olympiad 2026 — Registration Now Open!",
        description: "Prepare your analytical skills and represent BAFSKMC at the upcoming nationwide championship.",
        link: "/news",
        buttonText: "Register Now",
        theme: "gold" as "gold" | "cyan" | "crimson"
    });

    useEffect(() => {
        fetch("/api/alert")
            .then((res) => res.json())
            .then((data) => {
                if (data && typeof data.enabled === "boolean") {
                    setForm({
                        enabled: data.enabled,
                        type: data.type || "COMPETITION",
                        badge: data.badge || (data.type === "COMPETITION" ? "NEW COMPETITION" : "NEWS ALERT"),
                        title: data.title || "",
                        description: data.description || "",
                        link: data.link || "/news",
                        buttonText: data.buttonText || "Check It Out",
                        theme: data.theme || "gold"
                    });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed to save alert configuration");

            setStatus("success");
            setTimeout(() => setStatus("idle"), 3500);
        } catch {
            setStatus("error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10 pb-24">
            {/* Command Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                    HOME <span className="text-gold">HIGHLIGHT ALERT</span>
                </h1>
                <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                    Manage Competition & News Announcements Highlighted on the Homepage
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-10 w-10 text-gold animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Form Controls (7 cols) */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSave} className="bg-[#151515] rounded-[2.5rem] border border-white/5 p-8 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                            {/* Status Notification */}
                            {status === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-400 font-bold text-sm"
                                >
                                    <CheckCircle className="h-5 w-5 shrink-0" />
                                    <span>Success! Homepage highlight alert updated and published.</span>
                                </motion.div>
                            )}

                            {status === "error" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center space-x-3 text-red-400 font-bold text-sm"
                                >
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <span>Failed to update alert configuration. Please try again.</span>
                                </motion.div>
                            )}

                            {/* Enable/Disable Toggle */}
                            <div className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
                                <div>
                                    <p className="text-sm font-black text-white uppercase tracking-wider">Alert Active State</p>
                                    <p className="text-xs text-white/40 font-medium mt-0.5">
                                        When enabled, this banner will be highlighted at the top of the homepage.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, enabled: !form.enabled })}
                                    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${form.enabled ? 'bg-gold' : 'bg-white/20'}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${form.enabled ? 'translate-x-6' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>

                            {/* Type Selector */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                                    Alert Classification
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setForm({
                                            ...form,
                                            type: "COMPETITION",
                                            badge: form.badge.includes("NEWS") ? "NEW COMPETITION" : form.badge,
                                            theme: "gold"
                                        })}
                                        className={`p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${form.type === "COMPETITION" ? "bg-amber-500/15 border-amber-500 text-amber-300 font-black" : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"}`}
                                    >
                                        <Trophy className="h-4 w-4" />
                                        <span className="text-xs uppercase tracking-wider">Competition Alert</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({
                                            ...form,
                                            type: "NEWS",
                                            badge: form.badge.includes("COMPETITION") ? "LATEST NEWS" : form.badge,
                                            theme: "cyan"
                                        })}
                                        className={`p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${form.type === "NEWS" ? "bg-sky-500/15 border-sky-500 text-sky-300 font-black" : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"}`}
                                    >
                                        <Megaphone className="h-4 w-4" />
                                        <span className="text-xs uppercase tracking-wider">News / Notice</span>
                                    </button>
                                </div>
                            </div>

                            {/* Badge Tag & Theme */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                                        Badge Label
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.badge}
                                        onChange={(e) => setForm({ ...form, badge: e.target.value })}
                                        placeholder="e.g. NEW COMPETITION"
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 text-white font-bold text-sm tracking-wide"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                                        Glow Accent Theme
                                    </label>
                                    <select
                                        value={form.theme}
                                        onChange={(e) => setForm({ ...form, theme: e.target.value as any })}
                                        className="w-full px-5 py-4 bg-[#151515] border border-white/10 rounded-xl outline-none focus:border-gold/50 text-white font-bold text-sm"
                                    >
                                        <option value="gold">Gold & Amber (High-Tech)</option>
                                        <option value="cyan">Cyber Cyan (Modern News)</option>
                                        <option value="crimson">Crimson Urgent (Hot Notice)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Alert Headline */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                                    Alert Headline (Title)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. BAFSKMC Annual Math Olympiad 2026 announced!"
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 text-white font-black text-base placeholder:text-white/20"
                                />
                            </div>

                            {/* Brief Description */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                                    Short Summary / Subtitle (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Enter additional details, dates, or eligibility requirements..."
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 text-white/80 font-medium text-sm placeholder:text-white/20 resize-none leading-relaxed"
                                />
                            </div>

                            {/* Link & Button Text */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                                        Target Destination Link
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.link}
                                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                                        placeholder="e.g. /news, /exams, or external URL"
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 text-white font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">
                                        Button Text
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.buttonText}
                                        onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                                        placeholder="e.g. Register Now"
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 text-white font-bold text-sm"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="pt-4 border-t border-white/5">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-5 bg-gold hover:bg-[#F0C040] text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-xl shadow-gold/20 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Save className="h-5 w-5" />
                                    )}
                                    <span>{saving ? "Publishing Alert..." : "Publish to Homepage"}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Live Preview (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#151515] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center space-x-3 text-gold mb-6 pb-4 border-b border-white/5">
                                <Eye className="h-5 w-5" />
                                <h2 className="text-base font-black text-white uppercase tracking-wider">Live Preview</h2>
                            </div>

                            <p className="text-xs text-white/40 font-medium mb-6">
                                Here is an approximation of how your highlight alert will render on the student homepage:
                            </p>

                            {/* Mock Render */}
                            <div className="p-4 rounded-2xl border border-white/10 bg-[#0B1120] space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-black">
                                            {form.badge || "ALERT"}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-white/30 font-mono">
                                        {form.enabled ? "ACTIVE" : "INACTIVE"}
                                    </span>
                                </div>

                                <div>
                                    <p className="font-black text-white text-sm leading-snug">
                                        {form.title || "Alert headline appears here..."}
                                    </p>
                                    {form.description && (
                                        <p className="text-xs text-gray-400 font-medium mt-1">
                                            {form.description}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <span className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black rounded-xl inline-flex items-center gap-1.5 shadow-md">
                                        <span>{form.buttonText || "Action"}</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-white/40 space-y-2">
                                <p className="font-bold text-white/60">💡 Quick Admin Tips:</p>
                                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                                    <li>Toggle &apos;Alert Active State&apos; off anytime to hide the banner instantly without losing your text.</li>
                                    <li>Link can point to an internal page like <code>/news</code> or an external registration form.</li>
                                    <li>Students can dismiss the alert for their current browsing session.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
