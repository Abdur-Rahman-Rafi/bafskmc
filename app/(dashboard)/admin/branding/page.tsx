"use client";

import { useState, useEffect } from "react";
import {
    Save,
    GraduationCap,
    Loader2,
    CheckCircle,
    AlertCircle,
    Palette,
    Eye,
    Zap
} from "lucide-react";
import UploadZone from "@/components/admin/UploadZone";

export default function AdminBrandingPage() {
    const [logoUrl, setLogoUrl] = useState("");
    const [siteName, setSiteName] = useState("BAFSK");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        Promise.all([
            fetch("/api/config?key=logo_url").then((r) => r.json()),
            fetch("/api/config?key=site_name").then((r) => r.json()),
        ]).then(([logoData, nameData]) => {
            if (logoData?.value) setLogoUrl(logoData.value);
            if (nameData?.value) setSiteName(nameData.value);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setStatus("idle");
        try {
            await Promise.all([
                fetch("/api/config", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: "logo_url", value: logoUrl }),
                }),
                fetch("/api/config", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: "site_name", value: siteName }),
                }),
            ]);
            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
        } catch {
            setStatus("error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter">
                    BRANDING & <span className="text-gold">IDENTITY</span>
                </h1>
                <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                    Club Visual DNA Management • Design System Control
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 text-gold animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Configuration Panel */}
                    <div className="space-y-8">
                        <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 space-y-8">
                            <div className="flex items-center space-x-3 text-gold mb-2">
                                <Palette className="h-5 w-5" />
                                <h2 className="text-xl font-black text-white uppercase tracking-wider italic">Core Parameters</h2>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-white/30 uppercase tracking-[0.2em] pl-1">Site Designation</label>
                                <input
                                    type="text"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    placeholder="BAFSK"
                                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold transition-all font-black text-white text-lg tracking-tight placeholder:text-white/10"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-white/30 uppercase tracking-[0.2em] pl-1">Primary Insignia (Logo)</label>
                                <UploadZone
                                    onUploadComplete={(url) => setLogoUrl(url)}
                                    initialImage={logoUrl}
                                />
                                <p className="text-[10px] text-white/20 font-bold leading-relaxed px-1">
                                    High-resolution PNG or SVG with alpha channel recommended for premium dashboard rendering.
                                </p>
                            </div>
                        </div>

                        {/* Save Trigger */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center space-x-4 bg-gold text-black py-6 rounded-3xl font-black text-sm hover:bg-[#F0C040] transition-all active:scale-95 shadow-2xl shadow-gold/20 disabled:opacity-50 group"
                        >
                            {saving ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : status === "success" ? (
                                <CheckCircle className="h-5 w-5" />
                            ) : (
                                <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            )}
                            <span className="uppercase tracking-[0.2em]">
                                {saving ? "Synchronizing DNA..." : status === "success" ? "System Updated" : "Deploy Branding"}
                            </span>
                        </button>
                    </div>

                    {/* Preview Engine */}
                    <div className="space-y-8">
                        <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 blur-3xl pointer-events-none" />

                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center space-x-3 text-gold">
                                    <Eye className="h-5 w-5" />
                                    <h2 className="text-xl font-black text-white uppercase tracking-wider italic">Live Render</h2>
                                </div>
                                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Real-time Simulation</span>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {/* Navigation Interface */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-1 italic">Header Interface</p>
                                    <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-5 flex items-center space-x-4 shadow-xl">
                                        <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {logoUrl ? (
                                                <img src={logoUrl} alt="Logo" className="h-10 w-10 object-contain p-1" />
                                            ) : (
                                                <GraduationCap className="h-6 w-6 text-gold" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-xl italic tracking-tighter leading-none">
                                                {siteName || "BAFSK"} <span className="text-gold">PORTAL</span>
                                            </span>
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Status: Operational</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Interface */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-1 italic">Sidebar Architecture</p>
                                    <div className="bg-[#0D0D0D] border-r border-gold/20 rounded-2xl p-6 flex flex-col items-center space-y-4 w-48 shadow-2xl">
                                        <div className="h-16 w-16 bg-white/5 border border-gold/30 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                                            {logoUrl ? (
                                                <img src={logoUrl} alt="Logo" className="h-12 w-12 object-contain p-1" />
                                            ) : (
                                                <GraduationCap className="h-8 w-8 text-gold" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-black text-lg tracking-tighter shimmer leading-none">{siteName || "BAFSK"}</p>
                                            <p className="text-[8px] font-black text-gold/60 uppercase tracking-widest mt-1">Math Club</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Integration Note */}
                        <div className="bg-gold/5 border border-gold/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4">
                                <Zap className="h-6 w-6 text-gold/20 group-hover:text-gold transition-colors" />
                            </div>
                            <div className="flex space-x-4">
                                <AlertCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-black text-white text-sm uppercase tracking-widest italic">Protocol Information</p>
                                    <p className="text-white/40 text-xs font-bold mt-2 leading-relaxed">
                                        Changes to branding parameters are injected globally via the Config API. Modern browsers will reflect updates instantly, while edge nodes may require up to 60 seconds to propagate cache resets.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
