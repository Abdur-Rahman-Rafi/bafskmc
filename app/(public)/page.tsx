"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight, BookOpen, Trophy, Users, Calendar,
    Sparkles, Facebook, User, Shield, Target,
    Compass, History, Award, Zap, ChevronDown
} from "lucide-react";
import MathBackground from "@/components/MathBackground";
import HomeHighlightAlert from "@/components/HomeHighlightAlert";
import RecentActivitiesAlbum from "@/components/RecentActivitiesAlbum";
import InstitutionalSpeechSection from "@/components/InstitutionalSpeechSection";
import AchievementCornerAlbum from "@/components/AchievementCornerAlbum";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Member {
    id: string;
    name: string;
    position: string;
    image: string | null;
    bio: string | null;
    session: string | null;
    fbId: string | null;
    priority: number;
}

// ── Panel Members Section ─────────────────────────────────────────────────────
function PanelMembersSection() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/members?type=PANEL")
            .then((res) => res.json())
            .then((data) => {
                setMembers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (!loading && members.length === 0) return null;

    return (
        <section
            className="py-28 relative overflow-hidden bg-[#080C14] border-t border-white/5"
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-md"
                            style={{
                                background: "rgba(201,150,43,0.1)",
                                borderColor: "rgba(201,150,43,0.3)",
                                color: "#F0C040",
                            }}
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_8px_#F0C040]"
                                style={{ background: "#F0C040" }}
                            />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Leadership Council
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">
                            Meet the <span className="shimmer text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500">Panel</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto font-medium leading-relaxed text-lg">
                            The dedicated minds steering BAFSK Math Club towards excellence,
                            innovation, and national recognition.
                        </p>
                    </motion.div>
                </div>

                {/* Loading skeletons */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-[2rem] overflow-hidden border animate-pulse"
                                style={{ background: "#151515", borderColor: "rgba(201,150,43,0.1)" }}
                            >
                                <div className="aspect-[4/3]" style={{ background: "#222" }} />
                                <div className="p-7 space-y-3">
                                    <div className="h-5 rounded-full w-2/3" style={{ background: "#2a2a2a" }} />
                                    <div className="h-3 rounded-full w-1/3" style={{ background: "#222" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {members.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                className="rounded-[2rem] overflow-hidden border group relative transition-all duration-500 hover:-translate-y-2 backdrop-blur-xl"
                                style={{
                                    background: "linear-gradient(145deg, rgba(30,30,30,0.7) 0%, rgba(15,15,15,0.9) 100%)",
                                    borderColor: "rgba(201,150,43,0.2)",
                                    boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
                                }}
                            >
                                {/* Ambient glow */}
                                <div
                                    className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px]"
                                    style={{
                                        background: "rgba(201,150,43,0.15)",
                                    }}
                                />

                                {/* Photo */}
                                <div className="aspect-[4/3] relative overflow-hidden bg-black/60">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User
                                                className="h-20 w-20"
                                                style={{ color: "rgba(201,150,43,0.2)" }}
                                            />
                                        </div>
                                    )}

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />

                                    {/* Bio slide-up */}
                                    {member.bio && (
                                        <div
                                            className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out backdrop-blur-md"
                                            style={{
                                                background: "linear-gradient(to top, rgba(10,10,10,0.95), rgba(10,10,10,0.7))",
                                            }}
                                        >
                                            <p className="text-gray-300 text-sm font-medium leading-relaxed line-clamp-3">
                                                {member.bio}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-7 relative z-10">
                                    <h3 className="text-2xl font-black text-white mb-1 tracking-tight group-hover:text-yellow-400 transition-colors">
                                        {member.name}
                                    </h3>
                                    <p
                                        className="text-[11px] font-black uppercase tracking-[0.25em] mb-6"
                                        style={{ color: "#C9962B" }}
                                    >
                                        {member.position}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        {member.session ? (
                                            <span
                                                className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md"
                                                style={{
                                                    background: "rgba(201,150,43,0.1)",
                                                    color: "rgba(255,215,0,0.8)",
                                                    border: "1px solid rgba(201,150,43,0.2)",
                                                }}
                                            >
                                                Session {member.session}
                                            </span>
                                        ) : (
                                            <span />
                                        )}

                                        {member.fbId && (
                                            <a
                                                href={`https://facebook.com/${member.fbId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                                                style={{
                                                    background: "rgba(59,130,246,0.1)",
                                                    border: "1px solid rgba(59,130,246,0.2)",
                                                    color: "#60a5fa",
                                                    boxShadow: "0 4px 12px rgba(59,130,246,0.15)",
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                title={`${member.name} on Facebook`}
                                            >
                                                <Facebook className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* View all link */}
                {!loading && members.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-center mt-16"
                    >
                        <Link
                            href="/panel"
                            className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl border font-black text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(201,150,43,0.3)] backdrop-blur-sm"
                            style={{ 
                                background: "rgba(201,150,43,0.05)",
                                borderColor: "rgba(201,150,43,0.4)", 
                                color: "#F0C040" 
                            }}
                        >
                            <Shield className="h-4 w-4" />
                            <span className="uppercase tracking-widest">View Full Panel</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

// ── Recruitment Advertisement Section ─────────────────────────────────────────
function RecruitmentAdvertisement({ configData }: { configData: { startDate: string; deadline: string } | null }) {
    if (!configData) return null; // Only show if recruitment data is successfully fetched

    return (
        <section className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-[3rem] p-10 md:p-16 border shadow-2xl overflow-hidden backdrop-blur-xl"
                    style={{ 
                        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(201, 150, 43, 0.05) 50%, rgba(15,15,15,0.9) 100%)",
                        borderColor: "rgba(239, 68, 68, 0.3)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 80px rgba(239, 68, 68, 0.05)"
                    }}
                >
                    {/* Festive Elements Overlay */}
                    <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none" style={{ 
                        background: "radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 60%)",
                        transform: "translate(30%, -30%)"
                    }} />
                    <div className="absolute top-10 right-10 opacity-10 text-red-500 text-6xl md:text-8xl font-black transform rotate-12 select-none pointer-events-none whitespace-nowrap">
                        শুভ নববর্ষ
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                        <div className="lg:col-span-3">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-6" style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.4)", color: "#ef4444" }}>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Sparkles className="h-3 w-3" />
                                    Boishakhi Recruitment Drive
                                </span>
                            </div>
                            
                            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                                Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 shimmer">Panel Member</span>
                            </h2>
                            <p className="text-gray-300 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-2xl border-l-2 border-red-500/50 pl-4">
                                Embrace the spirit of the New Year by stepping up as a leader. We are looking for passionate, driven individuals to steer the BAFSK Math Club towards greatness. Shape the future of mathematics in our college.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href="/apply-panel"
                                    className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#C9962B] to-[#F0C040] text-black text-sm font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-[0_0_30px_rgba(201,150,43,0.3)] hover:shadow-[0_0_40px_rgba(201,150,43,0.5)] hover:-translate-y-1 text-center"
                                >
                                    Apply Now
                                </Link>
                                <div className="flex items-center justify-center space-x-4 px-6 py-4 rounded-xl border" style={{ borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                                    <div>
                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 opacity-80">Application Deadline</p>
                                        <p className="text-red-400 font-bold tracking-widest">{new Date(configData.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <div className="p-6 rounded-3xl border bg-black/40 backdrop-blur-md transition-all hover:bg-black/60" style={{ borderColor: "rgba(201,150,43,0.15)" }}>
                                <Target className="h-8 w-8 mb-4 text-[#F0C040]" />
                                <h4 className="text-white font-bold mb-2">Leadership Training</h4>
                                <p className="text-sm font-medium text-gray-500">Master executive event management and collaborative leadership skills directly under veteran guidance.</p>
                            </div>
                            <div className="p-6 rounded-3xl border bg-black/40 backdrop-blur-md transition-all hover:bg-black/60" style={{ borderColor: "rgba(201,150,43,0.15)" }}>
                                <Shield className="h-8 w-8 mb-4 text-[#C9962B]" />
                                <h4 className="text-white font-bold mb-2">Club Authority</h4>
                                <p className="text-sm font-medium text-gray-500">Dictate the roadmap for upcoming nationwide olympiads, strategic workshops, and official seminars.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ── Alumni Section ────────────────────────────────────────────────────────────
function AlumniSection() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/members?type=ALUMNI")
            .then((res) => res.json())
            .then((data) => {
                setMembers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (!loading && members.length === 0) return null;

    return (
        <section
            className="py-28 relative overflow-hidden bg-[#060A10] border-t border-white/5"
        >
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-md"
                            style={{
                                background: "rgba(240,192,64,0.08)",
                                borderColor: "rgba(240,192,64,0.25)",
                                color: "#F0C040",
                            }}
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_#F0C040] bg-amber-400"
                            />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Alumni Legacy
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black text-white mb-5 tracking-tight">
                            Distinguished <span className="shimmer text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">Alumni</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto font-medium leading-relaxed text-lg">
                            Celebrating the brilliant minds who once called BAFSK Math Club their home
                            and continue to inspire us with their excellence.
                        </p>
                    </motion.div>
                </div>

                {/* Alumni grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-3xl h-80 animate-pulse bg-slate-900/50 border border-white/5"
                            />
                        ))
                    ) : (
                        members.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className="math-glass-card rounded-[2.5rem] p-6 relative overflow-hidden flex flex-col justify-between group text-center"
                            >
                                <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

                                <div>
                                    {/* Photo */}
                                    <div className="h-28 w-28 rounded-full mx-auto mb-5 p-1 bg-gradient-to-tr from-amber-500/30 to-sky-400/30 group-hover:from-amber-400 group-hover:to-yellow-300 transition-all duration-500 shadow-xl">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-black/70 relative">
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-amber-300 font-black text-2xl">
                                                    {member.name ? member.name.charAt(0) : "A"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <h3 className="text-xl font-black text-white mb-1 tracking-tight group-hover:text-yellow-400 transition-colors line-clamp-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/90 mb-4 line-clamp-1">
                                        {member.position}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                        {member.session ? `Session ${member.session}` : "Alumnus"}
                                    </span>
                                    {member.fbId && (
                                        <a
                                            href={`https://facebook.com/${member.fbId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`${member.name} on Facebook`}
                                            className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all"
                                        >
                                            <Facebook className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* View Full Alumni Directory link */}
                {!loading && members.length > 0 && (
                    <div className="text-center mt-16">
                        <Link
                            href="/alumni"
                            className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/10 group"
                        >
                            <span>Explore Alumni Directory</span>
                            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

// ── Section Representatives Section ──────────────────────────────────────────
interface SectionRep {
    id: string;
    name: string;
    section: string;
    class: string;
    image: string | null;
    priority: number;
    fbId?: string | null;
}

function SectionRepresentativesSection() {
    const [reps, setReps] = useState<SectionRep[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/sr")
            .then((res) => res.json())
            .then((data) => {
                setReps(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (!loading && reps.length === 0) return null;

    const displayReps = reps.slice(0, 8);

    return (
        <section
            className="py-28 relative overflow-hidden bg-[#070B12] border-t border-white/5"
        >
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none transform -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-md"
                            style={{
                                background: "rgba(56,189,248,0.08)",
                                borderColor: "rgba(56,189,248,0.25)",
                                color: "#38BDF8",
                            }}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38BDF8] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Classroom Network
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">
                            Section <span className="shimmer text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">Representatives</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto font-medium leading-relaxed text-lg">
                            Empowering every section and classroom with peer mathematical leadership, workshop updates, and Olympiad coordination.
                        </p>
                    </motion.div>
                </div>

                {/* SR Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-[2rem] h-72 animate-pulse bg-slate-900/50 border border-white/5"
                            />
                        ))
                    ) : (
                        displayReps.map((sr, idx) => (
                            <motion.div
                                key={sr.id}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="math-glass-card rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between group"
                            >
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-5 bg-black/60 border border-white/10 group-hover:border-amber-400/30 transition-all">
                                    {sr.image ? (
                                        <img
                                            src={sr.image}
                                            alt={sr.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black text-amber-300 font-black text-2xl">
                                            {sr.name ? sr.name.charAt(0) : "S"}
                                        </div>
                                    )}
                                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-black/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                                            {sr.class}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-black/80 text-sky-300 border border-sky-400/30 backdrop-blur-md">
                                            Sec: {sr.section}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-white group-hover:text-yellow-400 transition-colors tracking-tight line-clamp-1 mb-1">
                                            {sr.name}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400/90">
                                            {sr.class} • Section {sr.section}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400/80">
                                            Representative
                                        </span>
                                        {sr.fbId && (
                                            <a
                                                href={`https://facebook.com/${sr.fbId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={`${sr.name} on Facebook`}
                                                className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all"
                                            >
                                                <Facebook className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* View All SRs link */}
                {!loading && reps.length > 0 && (
                    <div className="text-center mt-14">
                        <Link
                            href="/sr"
                            className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl border border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10 text-sky-300 font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/10 group"
                        >
                            <Users className="h-4 w-4" />
                            <span>View All Section Representatives ({reps.length})</span>
                            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
    const [recruitmentConfig, setRecruitmentConfig] = useState<{ startDate: string; deadline: string; isOpen: boolean } | null>(null);

    useEffect(() => {
        fetch("/api/apply-panel")
            .then(res => res.json())
            .then(data => {
                if (data.isOpen) {
                    setRecruitmentConfig({ startDate: data.startDate, deadline: data.deadline, isOpen: data.isOpen });
                }
            })
            .catch(console.error);
            
        // Trigger Advertisement after a short delay
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('show-ad'));
        }, 1500);
        
        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            title: "Active Learning",
            description: "Participate in weekly math workshops and dynamic problem-solving sessions designed to push your limits.",
            icon: <BookOpen className="h-7 w-7" />,
            iconColor: "#F0C040",
            bgGradient: "from-yellow-900/20 to-transparent",
        },
        {
            title: "Exams & Contests",
            description: "Compete in monthly math olympiads, track your progress, and prepare for national-level competitions.",
            icon: <Trophy className="h-7 w-7" />,
            iconColor: "#C9962B",
            bgGradient: "from-amber-900/20 to-transparent",
        },
        {
            title: "Strong Community",
            description: "Join over 500 passionate math enthusiasts. Collaborate on complex problems and build lifelong connections.",
            icon: <Users className="h-7 w-7" />,
            iconColor: "#D4B483",
            bgGradient: "from-orange-900/20 to-transparent",
        },
        {
            title: "Regular Events",
            description: "Never miss an event with our synchronized club calendar featuring seminars, bootcamps, and more.",
            icon: <Calendar className="h-7 w-7" />,
            iconColor: "#A0845C",
            bgGradient: "from-stone-800/40 to-transparent",
        },
    ];

    return (
        <div className="overflow-hidden bg-[#080C14] text-white font-sans relative">
            {/* ── Highlight Alert (Admin Managed) ── */}
            <HomeHighlightAlert />

            {/* ── Hero ───────────────────────────────────────────────────────── */}
            <section
                className="relative min-h-screen flex items-center pt-16 pb-24 overflow-hidden"
            >
                {/* Floating Math Animations Background */}
                <MathBackground />

                {/* Dynamic Backgrounds */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay"></div>
                    
                    {/* Animated gradient orbs */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full bg-yellow-600/10 blur-[120px]"
                    />
                    <motion.div
                        animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 -right-32 w-[700px] h-[700px] rounded-full bg-amber-700/10 blur-[130px]"
                    />

                    {/* Festive Boishakh Overlay */}
                    {recruitmentConfig && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0 z-0">
                            <div className="absolute top-10 left-4 md:left-20 opacity-[0.03] text-red-500 text-7xl md:text-9xl font-black transform -rotate-12 select-none tracking-widest">
                                শুভ নববর্ষ
                            </div>
                            <div className="absolute bottom-10 right-4 md:right-20 opacity-[0.03] text-red-500 text-5xl md:text-7xl font-black transform rotate-12 select-none tracking-widest">
                                বৈশাখ ১৪৩১
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-black mb-8 border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,184,0,0.15)] text-amber-300"
                            >
                                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                                <span className="uppercase tracking-[0.25em]">BAF Shaheen College Kurmitola</span>
                            </motion.div>

                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-[1.08] sm:leading-[1.05] mb-5 sm:mb-6 text-white uppercase drop-shadow-2xl">
                                Discover the <br />
                                <span className="text-gradient-gold">
                                    Beauty of Math
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-300/90 mb-10 max-w-xl leading-relaxed font-medium">
                                Step into a high-octane arena where logic meets creativity. We are the premier community hub for mathematical excellence, nurturing problem solvers and Olympiad medalists.
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    href="/register"
                                    className="btn-gold text-sm uppercase tracking-[0.2em] flex items-center justify-center space-x-2.5 group"
                                >
                                    <span>Join the Club</span>
                                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="#who-we-are"
                                    className="btn-glass text-sm uppercase tracking-[0.2em] flex items-center justify-center"
                                >
                                    Who We Are
                                </Link>
                            </div>

                            {/* Stats */}
                            <div
                                className="flex items-center space-x-8 sm:space-x-12 mt-16 pt-10 border-t border-white/10"
                            >
                                {[
                                    { label: "Active Members", value: "500+" },
                                    { label: "Competitions Won", value: "40+" },
                                    { label: "Years Active", value: "6+" },
                                ].map((s, i) => (
                                    <motion.div 
                                        key={s.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                                    >
                                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-md">
                                            {s.value}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                            {s.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Logo showcase */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            className="relative flex items-center justify-center mt-10 lg:mt-0"
                        >
                            <div className="relative h-[320px] w-[320px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                                {/* Decorative rings */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border border-dashed border-yellow-500/30"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-8 rounded-full border border-yellow-500/20"
                                />
                                
                                <div
                                    className="absolute inset-4 sm:inset-12 rounded-full backdrop-blur-3xl"
                                    style={{
                                        background: "radial-gradient(circle, rgba(201,150,43,0.15) 0%, rgba(0,0,0,0) 70%)",
                                    }}
                                />
                                
                                <div
                                    className="absolute inset-10 sm:inset-16 rounded-[3rem] overflow-hidden border border-yellow-500/30 shadow-[0_0_80px_rgba(201,150,43,0.2)]"
                                >
                                    <Image
                                        src="/logo.jpg"
                                        alt="BAFSKMC Math Club"
                                        fill
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent mix-blend-overlay"></div>
                                </div>

                                {/* Floating badges */}
                                <motion.div
                                    animate={{ y: [-8, 8, -8] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-6 sm:top-10 right-0 sm:-right-8 px-3.5 py-2 sm:px-5 sm:py-3 rounded-2xl text-[10px] sm:text-xs font-black border shadow-2xl backdrop-blur-xl z-20"
                                    style={{ background: "rgba(15,15,15,0.9)", borderColor: "rgba(201,150,43,0.4)", color: "#F0C040" }}
                                >
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                                        <span>Since 2019</span>
                                    </div>
                                </motion.div>
                                <motion.div
                                    animate={{ y: [8, -8, 8] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-6 sm:bottom-10 left-0 sm:-left-8 px-3.5 py-2 sm:px-5 sm:py-3 rounded-2xl text-[10px] sm:text-xs font-black border shadow-2xl backdrop-blur-xl z-20"
                                    style={{ background: "rgba(15,15,15,0.9)", borderColor: "rgba(201,150,43,0.4)", color: "#F0C040" }}
                                >
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                                        <span>Igniting Minds</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
                >
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-5 h-5 text-yellow-500/50" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ── Institutional Speeches (Principal & Moderators) ───────────── */}
            <InstitutionalSpeechSection />

            {/* ── Recent Activities Album (Highlighted at Upper Portion) ─────── */}
            <RecentActivitiesAlbum />

            {/* ── Achievement Corner / Multi-Image Album ───────────────────────── */}
            <AchievementCornerAlbum />

            {/* ── Who We Are (Intro Section) ─────────────────────────────────── */}
            <section id="who-we-are" className="py-24 relative bg-[#0B1120] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-5 relative">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center space-x-2 mb-6">
                                    <Compass className="h-5 w-5 text-amber-400" />
                                    <span className="text-amber-400 font-bold uppercase tracking-widest text-sm">Our Identity</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                                    More than just <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">numbers.</span>
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                    The BAFSK Math Club was founded with a singular vision: to demystify mathematics and transform it from a daunting subject into a captivating playground of logic and creativity.
                                </p>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    We are a collective of thinkers, dreamers, and problem solvers dedicated to pushing the boundaries of what students can achieve at the high school and college levels.
                                </p>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="p-8 rounded-[2rem] math-glass-card relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Target className="w-24 h-24 text-amber-400" />
                                </div>
                                <Target className="w-10 h-10 text-amber-400 mb-6 relative z-10" />
                                <h3 className="text-2xl font-black text-white mb-4 relative z-10">Our Mission</h3>
                                <p className="text-gray-400 leading-relaxed font-medium relative z-10">
                                    To foster a deep-rooted love for mathematics by providing an engaging, collaborative, and challenging environment where every student can unlock their true analytical potential.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="p-8 rounded-[2rem] math-glass-card relative overflow-hidden group sm:translate-y-12"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <History className="w-24 h-24 text-amber-400" />
                                </div>
                                <History className="w-10 h-10 text-amber-400 mb-6 relative z-10" />
                                <h3 className="text-2xl font-black text-white mb-4 relative z-10">Our History</h3>
                                <p className="text-gray-400 leading-relaxed font-medium relative z-10">
                                    Established in 2019, we have rapidly grown into one of the most prestigious academic clubs in the institution, bringing home countless accolades from national olympiads.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ───────────────────────────────────────────────────── */}
            <section
                className="py-32 relative bg-[#080C14] border-t border-white/5"
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">
                                Why Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">BAFSKMC</span>?
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto font-medium text-lg">
                                A meticulously structured environment for students to grow their problem-solving
                                skills, collaborate with peers, and compete at the highest national levels.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="p-8 rounded-[2rem] math-glass-card relative overflow-hidden group"
                            >
                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                
                                <div
                                    className="mb-8 w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110 shadow-inner"
                                    style={{ 
                                        background: "rgba(240,192,64,0.1)", 
                                        color: feature.iconColor,
                                        boxShadow: "inset 0 0 0 1px rgba(240,192,64,0.2)"
                                    }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-black text-white mb-3 relative z-10">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm font-medium relative z-10">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Dynamic Recruitment Poster ──────────────────────────────────── */}
            <RecruitmentAdvertisement configData={recruitmentConfig} />

            {/* ── Panel Members ──────────────────────────────────────────────── */}
            <PanelMembersSection />

            {/* ── Section Representatives ─────────────────────────────────────── */}
            <SectionRepresentativesSection />

            {/* ── Alumni Section ──────────────────────────────────────────────── */}
            <AlumniSection />

            {/* ── CTA ────────────────────────────────────────────────────────── */}
            <section
                className="py-28 relative overflow-hidden border-t border-amber-400/20 bg-[#06080F]"
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse at center, rgba(255,184,0,0.12) 0%, transparent 70%)",
                    }}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-3xl mx-auto px-4 text-center z-10"
                >
                    <div className="text-5xl sm:text-6xl mb-6 animate-bounce">🎓</div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight uppercase">
                        Ready to start your <span className="text-gradient-gold">journey</span>?
                    </h2>
                    <p className="text-slate-300/80 text-base sm:text-lg mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                        Join our community today and gain direct access to Olympiad resources, contest platforms, and an elite network of mathematical minds.
                    </p>
                    <Link
                        href="/register"
                        className="btn-gold text-sm uppercase tracking-[0.2em] inline-flex items-center space-x-2.5 shadow-2xl group"
                    >
                        <span>Create Your Account</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
