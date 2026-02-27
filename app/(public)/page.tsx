"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight, BookOpen, Trophy, Users, Calendar,
    Sparkles, Facebook, User, Shield,
} from "lucide-react";

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
            className="py-28 border-t"
            style={{ backgroundColor: "#0D0D0D", borderColor: "rgba(201,150,43,0.15)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border mb-6"
                            style={{
                                background: "rgba(201,150,43,0.08)",
                                borderColor: "rgba(201,150,43,0.25)",
                                color: "#F0C040",
                            }}
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full animate-pulse"
                                style={{ background: "#F0C040" }}
                            />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Leadership Council
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black text-white mb-5 tracking-tight">
                            Meet the <span className="shimmer">Panel</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto font-medium leading-relaxed">
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
                                className="rounded-3xl overflow-hidden border animate-pulse"
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
                                className="rounded-3xl overflow-hidden border group relative transition-all duration-300 hover:-translate-y-2"
                                style={{
                                    background: "#151515",
                                    borderColor: "rgba(201,150,43,0.12)",
                                    boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
                                }}
                            >
                                {/* Ambient glow */}
                                <div
                                    className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background:
                                            "radial-gradient(circle, rgba(201,150,43,0.08) 0%, transparent 70%)",
                                    }}
                                />

                                {/* Photo */}
                                <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent" />

                                    {/* Bio slide-up */}
                                    {member.bio && (
                                        <div
                                            className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                                            style={{
                                                background:
                                                    "linear-gradient(to top, rgba(13,13,13,0.97), rgba(13,13,13,0.8))",
                                            }}
                                        >
                                            <p className="text-gray-300 text-sm font-medium leading-relaxed line-clamp-3">
                                                {member.bio}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-7">
                                    <h3 className="text-xl font-black text-white mb-1 tracking-tight group-hover:text-yellow-400 transition-colors">
                                        {member.name}
                                    </h3>
                                    <p
                                        className="text-[10px] font-black uppercase tracking-[0.25em] mb-5"
                                        style={{ color: "#C9962B" }}
                                    >
                                        {member.position}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        {member.session ? (
                                            <span
                                                className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                                                style={{
                                                    background: "rgba(201,150,43,0.08)",
                                                    color: "rgba(201,150,43,0.55)",
                                                    border: "1px solid rgba(201,150,43,0.12)",
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
                                                className="p-2 rounded-xl transition-colors"
                                                style={{
                                                    background: "rgba(59,130,246,0.08)",
                                                    border: "1px solid rgba(59,130,246,0.15)",
                                                    color: "#60a5fa",
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
                        transition={{ delay: 0.3 }}
                        className="text-center mt-14"
                    >
                        <Link
                            href="/panel"
                            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl border font-black text-sm transition-all hover:-translate-y-0.5"
                            style={{ borderColor: "rgba(201,150,43,0.3)", color: "#C9962B" }}
                        >
                            <Shield className="h-4 w-4" />
                            <span>View Full Panel</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                )}
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
            className="py-28 border-t"
            style={{ backgroundColor: "#080808", borderColor: "rgba(201,150,43,0.1)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border mb-6"
                            style={{
                                background: "rgba(201,150,43,0.08)",
                                borderColor: "rgba(201,150,43,0.2)",
                                color: "#D4AF37",
                            }}
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ background: "#D4AF37" }}
                            />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Alumni Legacy
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black text-white mb-5 tracking-tight">
                            Distinguished <span className="shimmer">Alumni</span>
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
                            Celebrating the brilliant minds who once called BAFSK Math Club their home
                            and continue to inspire us with their excellence.
                        </p>
                    </motion.div>
                </div>

                {/* Alumni grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl h-80 animate-pulse bg-white/5 border border-white/5"
                            />
                        ))
                    ) : (
                        members.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="rounded-3xl overflow-hidden border group relative transition-all duration-500 hover:border-gold/30"
                                style={{
                                    background: "#121212",
                                    borderColor: "rgba(255,255,255,0.05)",
                                }}
                            >
                                {/* Photo */}
                                <div className="aspect-[4/5] relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
                                            <User
                                                className="h-16 w-16 opacity-10"
                                                style={{ color: "#F0C040" }}
                                            />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />
                                </div>

                                {/* Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-lg font-black text-white mb-0.5 tracking-tight">
                                        {member.name}
                                    </h3>
                                    <p
                                        className="text-[9px] font-black uppercase tracking-[0.2em] mb-3"
                                        style={{ color: "#C9962B" }}
                                    >
                                        {member.position}
                                    </p>
                                    {member.session && (
                                        <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest border-t border-white/5 pt-3">
                                            {member.session}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
    const features = [
        {
            title: "Active Learning",
            description: "Participate in weekly math workshops and problem-solving sessions.",
            icon: <BookOpen className="h-6 w-6" />,
            iconColor: "#F0C040",
        },
        {
            title: "Exams & Contests",
            description: "Compete in monthly math olympiads and track your progress.",
            icon: <Trophy className="h-6 w-6" />,
            iconColor: "#C9962B",
        },
        {
            title: "Strong Community",
            description: "Join 500+ math enthusiasts and collaborate on complex problems.",
            icon: <Users className="h-6 w-6" />,
            iconColor: "#D4B483",
        },
        {
            title: "Regular Events",
            description: "Never miss an event with our synchronized club calendar.",
            icon: <Calendar className="h-6 w-6" />,
            iconColor: "#A0845C",
        },
    ];

    return (
        <div className="overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
            {/* ── Hero ───────────────────────────────────────────────────────── */}
            <section
                className="relative min-h-[90vh] flex items-center pt-12 pb-20"
                style={{ backgroundColor: "#0D0D0D" }}
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(201,150,43,0.4) 0%, transparent 70%)",
                        }}
                    />
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(0deg,#C9962B 0,#C9962B 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#C9962B 0,#C9962B 1px,transparent 0,transparent 50%)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div
                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold mb-8 border"
                                style={{
                                    background: "rgba(201,150,43,0.12)",
                                    borderColor: "rgba(201,150,43,0.4)",
                                    color: "#F0C040",
                                }}
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Since 2019 — BAF Shaheen College Kurmitola</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-white">
                                BAFSK <span className="shimmer">Math Club</span>
                            </h1>

                            <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
                                A premier community hub for mathematical excellence — from weekly
                                workshops to national olympiads. Where numbers tell the story.
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    href="/register"
                                    className="btn-gold px-8 py-4 text-lg font-black flex items-center justify-center space-x-2 rounded-2xl"
                                >
                                    <span>Join the Club</span>
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="px-8 py-4 text-lg font-bold flex items-center justify-center rounded-2xl transition-all text-gray-300 hover:text-yellow-400"
                                    style={{ border: "1px solid rgba(201,150,43,0.3)" }}
                                >
                                    Learn More
                                </Link>
                            </div>

                            {/* Stats */}
                            <div
                                className="flex items-center space-x-10 mt-12 pt-10 border-t"
                                style={{ borderColor: "rgba(201,150,43,0.2)" }}
                            >
                                {[
                                    { label: "Active Members", value: "500+" },
                                    { label: "Competitions Won", value: "40+" },
                                    { label: "Years Active", value: "6+" },
                                ].map((s) => (
                                    <div key={s.label}>
                                        <p className="text-2xl font-black" style={{ color: "#F0C040" }}>
                                            {s.value}
                                        </p>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                            {s.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Logo showcase */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative flex items-center justify-center"
                        >
                            <div className="relative h-80 w-80 lg:h-96 lg:w-96">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-2 border-dashed"
                                    style={{ borderColor: "rgba(201,150,43,0.3)" }}
                                />
                                <div
                                    className="absolute inset-6 rounded-full"
                                    style={{
                                        background:
                                            "radial-gradient(circle, rgba(201,150,43,0.15) 0%, transparent 70%)",
                                    }}
                                />
                                <div
                                    className="absolute inset-12 rounded-3xl overflow-hidden border-2 shadow-2xl"
                                    style={{
                                        borderColor: "rgba(201,150,43,0.5)",
                                        boxShadow: "0 0 60px rgba(201,150,43,0.25)",
                                    }}
                                >
                                    <Image
                                        src="/logo.jpg"
                                        alt="BAFSKMC Math Club"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <motion.div
                                    animate={{ y: [-6, 6, -6] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl text-xs font-black border shadow-xl"
                                    style={{ background: "#0D0D0D", borderColor: "#C9962B", color: "#F0C040" }}
                                >
                                    🏆 Since 2019
                                </motion.div>
                                <motion.div
                                    animate={{ y: [6, -6, 6] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-4 -left-4 px-4 py-2 rounded-2xl text-xs font-black border shadow-xl"
                                    style={{ background: "#0D0D0D", borderColor: "#8B6914", color: "#C9962B" }}
                                >
                                    ∑ Math Club
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Features ───────────────────────────────────────────────────── */}
            <section
                className="py-24 border-t"
                style={{ backgroundColor: "#111111", borderColor: "rgba(201,150,43,0.15)" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                            Why Join <span className="shimmer">BAFSKMC</span>?
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-medium">
                            A structured environment for students to grow their problem-solving
                            skills and compete at national level.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="p-7 rounded-3xl border transition-all hover:-translate-y-1"
                                style={{ background: "#1A1A1A", borderColor: "rgba(201,150,43,0.2)" }}
                            >
                                <div
                                    className="mb-5 w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={{ background: "rgba(201,150,43,0.1)", color: feature.iconColor }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm font-medium">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Panel Members ──────────────────────────────────────────────── */}
            <PanelMembersSection />

            {/* ── Alumni Section ──────────────────────────────────────────────── */}
            <AlumniSection />

            {/* ── CTA ────────────────────────────────────────────────────────── */}
            <section
                className="py-24 relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, #1A1200 0%, #0D0D0D 50%, #1A0D00 100%)",
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(201,150,43,0.15) 0%, transparent 70%)",
                    }}
                />
                <div className="relative max-w-3xl mx-auto px-4 text-center">
                    <div className="text-5xl mb-6">🎓</div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                        Ready to start your <span className="shimmer">journey</span>?
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                        Join our community today and get access to exclusive study resources,
                        exam portals, and an elite network of mathematical minds.
                    </p>
                    <Link
                        href="/register"
                        className="btn-gold px-12 py-5 text-lg font-black rounded-2xl inline-flex items-center space-x-3"
                    >
                        <span>Create Your Account</span>
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
