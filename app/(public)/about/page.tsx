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
        <div className="bg-[#0D0D0D] min-h-screen text-white pt-32 pb-20 overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gold/10 blur-[150px] rounded-full pointer-events-none" />
            
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-32">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-8">
                        <Sparkles className="h-4 w-4" />
                        <span>The Legacy of Logical Brilliance</span>
                    </motion.div>
                    
                    <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
                        Defining <br/><span className="text-gold">Excellence</span> in Mathematics.
                    </motion.h1>
                    
                    <motion.p variants={fadeIn} className="text-white/40 font-bold text-sm md:text-base max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
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
                    <motion.div variants={fadeIn} className="bg-[#151515] p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-gold/30 transition-colors">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none group-hover:bg-gold/10 transition-colors" />
                        <div className="h-20 w-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-gold mb-10 group-hover:scale-110 transition-transform duration-500">
                            <Target className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Our Mission</h2>
                        <p className="text-white/40 leading-loose font-medium text-sm tracking-wide">
                            To cultivate a hyper-focused environment where students break their cognitive limits. 
                            We equip individuals with advanced analytical frameworks, bridging the gap between standard academics 
                            and advanced competitive mathematics.
                        </p>
                    </motion.div>

                    {/* Vision */}
                    <motion.div variants={fadeIn} className="bg-gold p-12 rounded-[3.5rem] text-black shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <Compass className="h-96 w-96 text-black" />
                        </div>
                        <div className="relative z-10">
                            <div className="h-20 w-20 bg-black/10 rounded-[2rem] flex items-center justify-center text-black mb-10 group-hover:scale-110 transition-transform duration-500 backdrop-blur-md border border-black/10">
                                <Lightbulb className="h-10 w-10" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Our Vision</h2>
                            <p className="text-black/70 leading-loose font-bold text-sm tracking-wide">
                                To dominate the national stage and establish BAFSK as a central powerhouse of absolute mathematical brilliance. 
                                We envision a self-sustaining ecosystem of mentorship and continuous intellectual growth.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Strategic Pillars */}
            <div className="border-y border-white/5 bg-[#0A0A0A] py-32 mb-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">The Four <span className="text-gold">Pillars</span></h2>
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">Our operational methodology</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <BookOpen />, title: "Curriculum", desc: "Rigorous training beyond conventional syllabus constraints." },
                            { icon: <Trophy />, title: "Combats", desc: "Constant exposure to internal and national math Olympiads." },
                            { icon: <Users />, title: "Synergy", desc: "A tightly-knit network of high-achieving alumni and peers." },
                            { icon: <Rocket />, title: "Innovation", desc: "Fostering creative problem-solving and algorithmic thinking." },
                        ].map((pillar, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#151515] p-8 rounded-[2rem] border border-white/5 hover:border-gold/20 transition-all group"
                            >
                                <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-black transition-colors">
                                    {pillar.icon}
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3">{pillar.title}</h3>
                                <p className="text-white/40 text-xs font-medium leading-relaxed">{pillar.desc}</p>
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
                    className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-[4rem] p-12 md:p-20 text-center border border-gold/10 shadow-2xl"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                            Ready to face the <span className="text-gold">Challenge?</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto mb-10 text-xs font-black uppercase tracking-widest leading-loose">
                            Do not remain idle. Step into the arena, expand your logical processing, and solidify your legacy within the club.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-gold text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gold/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2">
                                <span>Join the Roster</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/activities" className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 hover:border-gold/30 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 active:scale-95 transition-all">
                                View Operations
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
