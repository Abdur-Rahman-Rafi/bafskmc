"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Trophy, Users, Calendar, Sparkles } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
    const features = [
        {
            title: "Active Learning",
            description: "Participate in weekly math workshops and problem-solving sessions.",
            icon: <BookOpen className="h-6 w-6" />,
            color: "from-yellow-900/60 to-yellow-800/30",
            iconColor: "#F0C040",
        },
        {
            title: "Exams & Contests",
            description: "Compete in monthly math olympiads and track your progress.",
            icon: <Trophy className="h-6 w-6" />,
            color: "from-amber-900/60 to-amber-800/30",
            iconColor: "#C9962B",
        },
        {
            title: "Strong Community",
            description: "Join 500+ math enthusiasts and collaborate on complex problems.",
            icon: <Users className="h-6 w-6" />,
            color: "from-stone-800/60 to-stone-700/30",
            iconColor: "#D4B483",
        },
        {
            title: "Regular Events",
            description: "Never miss an event with our synchronized club calendar.",
            icon: <Calendar className="h-6 w-6" />,
            color: "from-zinc-800/60 to-zinc-700/30",
            iconColor: "#A0845C",
        },
    ];

    return (
        <div className="overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-12 pb-20" style={{ backgroundColor: "#0D0D0D" }}>
                {/* Background radial gold glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
                        style={{ background: "radial-gradient(circle, rgba(201,150,43,0.4) 0%, transparent 70%)" }} />
                    <div className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: "repeating-linear-gradient(0deg,#C9962B 0,#C9962B 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#C9962B 0,#C9962B 1px,transparent 0,transparent 50%)", backgroundSize: "60px 60px" }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold mb-8 border"
                                style={{ background: "rgba(201,150,43,0.12)", borderColor: "rgba(201,150,43,0.4)", color: "#F0C040" }}>
                                <Sparkles className="h-4 w-4" />
                                <span>Since 2019 — BAF Shaheen College Kurmitola</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-white">
                                BAFSK{" "}
                                <span className="shimmer">Math Club</span>
                            </h1>

                            <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed font-medium">
                                A premier community hub for mathematical excellence — from weekly workshops to national olympiads. Where numbers tell the story.
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link href="/register" className="btn-gold px-8 py-4 text-lg font-black flex items-center justify-center space-x-2 rounded-2xl">
                                    <span>Join the Club</span>
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <Link href="/about"
                                    className="px-8 py-4 text-lg font-bold flex items-center justify-center rounded-2xl transition-all text-gray-300 hover:text-yellow-400"
                                    style={{ border: "1px solid rgba(201,150,43,0.3)" }}>
                                    Learn More
                                </Link>
                            </div>

                            {/* Stats row */}
                            <div className="flex items-center space-x-10 mt-12 pt-10 border-t" style={{ borderColor: "rgba(201,150,43,0.2)" }}>
                                {[
                                    { label: "Active Members", value: "500+" },
                                    { label: "Competitions Won", value: "40+" },
                                    { label: "Years Active", value: "6+" },
                                ].map((s) => (
                                    <div key={s.label}>
                                        <p className="text-2xl font-black" style={{ color: "#F0C040" }}>{s.value}</p>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Logo Showcase */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative flex items-center justify-center"
                        >
                            <div className="relative h-80 w-80 lg:h-96 lg:w-96">
                                {/* Outer rotating gold ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-2 border-dashed"
                                    style={{ borderColor: "rgba(201,150,43,0.3)" }}
                                />
                                {/* Inner glow */}
                                <div className="absolute inset-6 rounded-full"
                                    style={{ background: "radial-gradient(circle, rgba(201,150,43,0.15) 0%, transparent 70%)" }} />

                                {/* Logo */}
                                <div className="absolute inset-12 rounded-3xl overflow-hidden border-2 shadow-2xl"
                                    style={{ borderColor: "rgba(201,150,43,0.5)", boxShadow: "0 0 60px rgba(201,150,43,0.25)" }}>
                                    <Image
                                        src="/logo.jpg"
                                        alt="BAFSKMC Math Club"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Floating badge */}
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

            {/* Features Section */}
            <section className="py-24 border-t" style={{ backgroundColor: "#111111", borderColor: "rgba(201,150,43,0.15)" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Why Join <span className="shimmer">BAFSKMC</span>?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-medium">
                            A structured environment for students to grow their problem-solving skills and compete at national level.
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
                                <div className="mb-5 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(201,150,43,0.1)", color: feature.iconColor }}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm font-medium">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1A1200 0%, #0D0D0D 50%, #1A0D00 100%)" }}>
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,150,43,0.15) 0%, transparent 70%)" }} />
                <div className="relative max-w-3xl mx-auto px-4 text-center">
                    <div className="text-5xl mb-6">🎓</div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Ready to start your <span className="shimmer">journey</span>?</h2>
                    <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                        Join our community today and get access to exclusive study resources, exam portals, and an elite network of mathematical minds.
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
