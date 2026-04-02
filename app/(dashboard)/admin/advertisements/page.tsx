"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Edit, AlertCircle, Image as ImageIcon, Link as LinkIcon, Building2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FileUploadZone from "@/components/admin/FileUploadZone";

interface Advertisement {
    id: string;
    companyName: string;
    imageUrl: string;
    targetUrl: string | null;
    isActive: boolean;
    type: string;
    createdAt: string;
}

export default function AdminAdvertisementsPage() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Form states
    const [isAdding, setIsAdding] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [targetUrl, setTargetUrl] = useState("");
    const [type, setType] = useState("UNPAID");

    const fetchAds = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/advertisements");
            if (res.ok) {
                const data = await res.json();
                setAds(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const handleCreateAd = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/advertisements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyName, imageUrl, targetUrl, type, isActive: true })
            });

            if (res.ok) {
                setIsAdding(false);
                setCompanyName("");
                setImageUrl("");
                setTargetUrl("");
                setType("UNPAID");
                fetchAds();
            } else {
                alert("Failed to create advertisement");
            }
        } catch (err) {
            alert("Error creating ad.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/advertisements/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (res.ok) {
                fetchAds();
            }
        } catch (err) {
            console.error("Failed to toggle status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this advertisement?")) return;
        try {
            const res = await fetch(`/api/admin/advertisements/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchAds();
            }
        } catch (err) {
            console.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center">
                        Advertisements <span className="text-gold ml-2">& Sponsors</span>
                    </h1>
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-1">Manage network wide ad deployments</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center justify-center space-x-2 bg-gold text-black px-6 py-3 rounded-xl font-bold transition-all text-sm shadow-xl shadow-gold/20 hover:bg-yellow-400"
                >
                    {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    <span>{isAdding ? "Cancel" : "Add Advertisement"}</span>
                </button>
            </div>

            {/* Create Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#151515] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
                    >
                        <form onSubmit={handleCreateAd} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 shadow-sm">
                                        Company / Brand Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                                        <input
                                            type="text"
                                            required
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="e.g. Walton, 10 Minute School"
                                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white placeholder:text-white/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 shadow-sm">
                                        Target URL (Optional)
                                    </label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                                        <input
                                            type="url"
                                            value={targetUrl}
                                            onChange={(e) => setTargetUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white placeholder:text-white/20"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 shadow-sm">
                                        Advertisement Type
                                    </label>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 cursor-pointer p-4 border rounded-2xl flex items-center justify-center space-x-2 transition-all ${type === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-white/50 hover:border-white/20'}`}>
                                            <input type="radio" className="hidden" checked={type === 'PAID'} onChange={() => setType('PAID')} />
                                            <span className="font-bold text-sm uppercase tracking-widest">Paid Sponsor</span>
                                        </label>
                                        <label className={`flex-1 cursor-pointer p-4 border rounded-2xl flex items-center justify-center space-x-2 transition-all ${type === 'UNPAID' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/5 text-white/50 hover:border-white/20'}`}>
                                            <input type="radio" className="hidden" checked={type === 'UNPAID'} onChange={() => setType('UNPAID')} />
                                            <span className="font-bold text-sm uppercase tracking-widest">Unpaid Partner</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <FileUploadZone
                                        type="image"
                                        label="Ad Image / Poster Banner"
                                        accept="image/*"
                                        initialUrl={imageUrl}
                                        onUploadComplete={(url) => setImageUrl(url)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={actionLoading || !companyName || !imageUrl}
                                    className="bg-gold text-black px-10 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-gold/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deploy Advertisement"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submissions List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                </div>
            ) : ads.length === 0 ? (
                <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                    <ImageIcon className="h-16 w-16 text-white/10 mx-auto mb-4" />
                    <p className="text-white/20 font-black uppercase tracking-widest text-xs">No active advertisements running right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ads.map((ad) => (
                        <div key={ad.id} className="bg-[#151515] border border-white/5 rounded-3xl overflow-hidden relative group shadow-2xl">
                            <div className="aspect-[16/9] w-full bg-white/5 relative overflow-hidden">
                                <img src={ad.imageUrl} alt={ad.companyName} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                    {ad.type}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-black text-white">{ad.companyName}</h3>
                                {ad.targetUrl && (
                                    <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs font-bold flex items-center mt-2 opacity-70 hover:opacity-100 transition-opacity">
                                        <LinkIcon className="h-3 w-3 mr-1" />
                                        {ad.targetUrl}
                                    </a>
                                )}
                                
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => handleToggleStatus(ad.id, ad.isActive)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${ad.isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                                    >
                                        {ad.isActive ? 'LIVE' : 'HIDDEN'}
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleDelete(ad.id)}
                                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
