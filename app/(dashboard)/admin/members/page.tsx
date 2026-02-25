"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, Loader2, Trash2, Edit, UserCircle, Users, ShieldCheck, Award, ChevronRight, Facebook, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminMembersPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"PANEL" | "ALUMNI">("PANEL");
    const router = useRouter();

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/members");
            const data = await res.json();
            setMembers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch members");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This profile will be purged from the registry.")) return;
        try {
            await fetch(`/api/members/${id}`, { method: "DELETE" });
            fetchMembers();
        } catch (error) {
            console.error("Deletion protocol failed");
        }
    };

    const filteredMembers = members.filter(m => m.type === activeTab);

    return (
        <div className="space-y-12 pb-20">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        COMMUNITY <span className="text-gold">REGISTRY</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Executive Hierarchy • Alumni Association Management
                    </p>
                </div>
                <Link
                    href="/admin/members/new"
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black shadow-2xl shadow-gold/20 transition-all active:scale-95 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Register Member</span>
                </Link>
            </div>

            {/* Registry Hub */}
            <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden min-h-[600px]">
                {/* Node Selector (Tabs) */}
                <div className="flex bg-white/[0.02] border-b border-white/5 p-3">
                    <button
                        onClick={() => setActiveTab("PANEL")}
                        className={`flex-1 flex items-center justify-center space-x-3 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${activeTab === "PANEL"
                            ? "bg-gold text-black shadow-xl"
                            : "text-white/20 hover:text-white/40 hover:bg-white/5"
                            }`}
                    >
                        <ShieldCheck className={`h-4 w-4 ${activeTab === "PANEL" ? "animate-pulse" : ""}`} />
                        <span>Executive Panel</span>
                        {activeTab === "PANEL" && (
                            <motion.div layoutId="tab-glow" className="absolute inset-0 bg-white/20 blur-xl" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("ALUMNI")}
                        className={`flex-1 flex items-center justify-center space-x-3 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${activeTab === "ALUMNI"
                            ? "bg-gold text-black shadow-xl"
                            : "text-white/20 hover:text-white/40 hover:bg-white/5"
                            }`}
                    >
                        <Award className={`h-4 w-4 ${activeTab === "ALUMNI" ? "animate-pulse" : ""}`} />
                        <span>Alumni Association</span>
                        {activeTab === "ALUMNI" && (
                            <motion.div layoutId="tab-glow" className="absolute inset-0 bg-white/20 blur-xl" />
                        )}
                    </button>
                </div>

                <div className="p-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                            <Loader2 className="h-12 w-12 text-gold animate-spin" />
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Accessing Member Archives...</p>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="py-24 text-center bg-[#0D0D0D]/30 rounded-[2.5rem] border border-dashed border-white/5">
                            <div className="bg-white/5 h-20 w-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                                <Users className="h-8 w-8 text-white/10" />
                            </div>
                            <h3 className="text-xl font-black text-white/40 uppercase italic">Archive Empty</h3>
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2">
                                No records found in the {activeTab === "PANEL" ? "Executive" : "Alumni"} node.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredMembers.map((member, idx) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] p-8 hover:border-gold/30 transition-all group relative overflow-hidden shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl pointer-events-none" />

                                    <div className="flex items-start justify-between mb-6">
                                        <div className="h-20 w-20 bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden relative shadow-xl group-hover:border-gold/20 transition-all">
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-white/5 text-gold/30 font-black text-2xl">
                                                    {member.name ? member.name[0] : "?"}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/admin/members/edit?id=${member.id}`}
                                                    className="p-3 bg-white/5 text-white/20 hover:text-gold hover:bg-gold/10 hover:border-gold/20 rounded-xl border border-white/5 transition-all"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member.id)}
                                                    className="p-3 bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 rounded-xl border border-white/5 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            {member.fbId && (
                                                <a
                                                    href={`https://facebook.com/${member.fbId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-blue-500/5 text-blue-500 hover:bg-blue-500/10 rounded-xl border border-blue-500/10 transition-all flex items-center justify-center"
                                                >
                                                    <Facebook className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="px-2 py-0.5 bg-white/5 rounded-md flex items-center space-x-1 border border-white/5">
                                            <Hash className="h-2.5 w-2.5 text-gold/40" />
                                            <span className="text-[9px] font-black text-white/40">{member.priority}</span>
                                        </div>
                                        <h4 className="text-xl font-black text-white italic group-hover:text-gold transition-colors tracking-tight">{member.name}</h4>
                                    </div>

                                    <p className="text-gold/60 font-black text-[10px] uppercase tracking-[0.15em] mb-4">
                                        {member.position || "Member"}
                                    </p>
                                    <p className="text-white/30 text-xs font-bold leading-relaxed line-clamp-2 h-10 group-hover:text-white/60 transition-colors">
                                        {member.bio || "System protocol: No biography data currently registered for this profile."}
                                    </p>

                                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Enrollment</span>
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic">Session {member.session || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-white/10 group-hover:text-gold transition-colors">
                                            <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
                                            <ChevronRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
