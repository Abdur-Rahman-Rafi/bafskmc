"use client";

import { motion } from "framer-motion";
import { 
    Target, 
    Lightbulb, 
    Users, 
    Trophy, 
    Rocket, 
    Compass, 
    Sparkles, 
    BookOpen,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="bg-[#06080F] min-h-screen text-white pt-32 pb-24 overflow-hidden font-sans relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-500/15 via-sky-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />
            
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-28">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-400/30 rounded-full text-[10px] font-black text-amber-300 uppercase tracking-[0.25em] mb-8 shadow-[0_0_20px_rgba(255,184,0,0.15)]">
                        <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                        <span>The Legacy of Logical Brilliance</span>
                    </motion.div>
                    
                    <motion.h1 variants={fadeIn} className="text-4xl sm:text-6xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.95]">
                        Defining <br/><span className="text-gradient-gold">Excellence</span> in Mathematics.
                    </motion.h1>
                    
                    <motion.p variants={fadeIn} className="text-slate-300/80 font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed tracking-wide">
                        BAFSK Math Club is the premier institution for mathematical exploration, 
                        where elite analytical minds convene to redefine boundaries and conquer national Olympiads.
                    </motion.p>
                </motion.div>
            </div>

            {/* Core Directives / Mission & Vision */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 relative z-10">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Mission */}
                    <motion.div variants={fadeIn} className="math-glass-card p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden group hover:border-amber-400/40 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 blur-[100px] pointer-events-none group-hover:bg-amber-400/20 transition-all" />
                        <div className="h-16 w-16 sm:h-20 sm:w-20 bg-amber-400/10 border border-amber-400/25 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-amber-400 mb-8 sm:mb-10 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,184,0,0.25)] transition-all duration-500">
                            <Target className="h-8 w-8 sm:h-10 sm:w-10" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4 sm:mb-6 text-white">Our Mission</h2>
                        <p className="text-slate-300/80 leading-relaxed font-medium text-sm tracking-wide">
                            To cultivate a hyper-focused environment where students break their cognitive limits. 
                            We equip individuals with advanced analytical frameworks, bridging the gap between standard academics 
                            and advanced competitive mathematics.
                        </p>
                    </motion.div>

                    {/* Vision */}
                    <motion.div variants={fadeIn} className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 text-slate-950 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-[0_20px_50px_rgba(255,184,0,0.25)] group border border-amber-200/50">
                        <div className="absolute -right-20 -top-20 opacity-15 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                            <Compass className="h-96 w-96 text-black" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 bg-slate-950/10 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-slate-950 mb-8 sm:mb-10 group-hover:scale-110 transition-transform duration-500 backdrop-blur-md border border-slate-950/15">
                                <Lightbulb className="h-8 w-8 sm:h-10 sm:w-10" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4 sm:mb-6">Our Vision</h2>
                            <p className="text-slate-900/90 leading-relaxed font-bold text-sm tracking-wide">
                                To dominate the national stage and establish BAFSK as a central powerhouse of absolute mathematical brilliance. 
                                We envision a self-sustaining ecosystem of mentorship and continuous intellectual growth.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Strategic Pillars */}
            <div className="border-y border-white/5 bg-[#080B14]/70 py-24 sm:py-32 mb-28 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 sm:mb-20">
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-3">The Four <span className="text-gradient-gold">Pillars</span></h2>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.25em]">Our operational methodology</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <BookOpen className="h-6 w-6" />, title: "Curriculum", desc: "Rigorous training beyond conventional syllabus constraints." },
                            { icon: <Trophy className="h-6 w-6" />, title: "Combats", desc: "Constant exposure to internal and national math Olympiads." },
                            { icon: <Users className="h-6 w-6" />, title: "Synergy", desc: "A tightly-knit network of high-achieving alumni and peers." },
                            { icon: <Rocket className="h-6 w-6" />, title: "Innovation", desc: "Fostering creative problem-solving and algorithmic thinking." },
                        ].map((pillar, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="math-glass-card p-6 sm:p-8 rounded-[2rem] border border-white/10 hover:border-amber-400/30 transition-all duration-300 group"
                            >
                                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center text-amber-400 mb-6 group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-amber-500 group-hover:text-black transition-all duration-300">
                                    {pillar.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2 text-white">{pillar.title}</h3>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden math-glass-card rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 md:p-20 text-center border border-amber-400/20 shadow-[0_0_50px_rgba(255,184,0,0.1)]"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] bg-gradient-to-r from-amber-500/15 via-sky-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-5">
                            Ready to face the <span className="text-gradient-gold">Challenge?</span>
                        </h2>
                        <p className="text-slate-300/80 max-w-xl mx-auto mb-8 sm:mb-10 text-xs sm:text-sm font-semibold leading-relaxed">
                            Do not remain idle. Step into the arena, expand your logical processing, and solidify your legacy within the club.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto btn-gold text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-2">
                                <span>Join the Roster</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/activities" className="w-full sm:w-auto btn-glass text-xs uppercase tracking-[0.2em] flex items-center justify-center">
                                View Operations
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
