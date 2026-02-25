"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, Loader2, Facebook } from "lucide-react";

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

export default function AlumniPage() {
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6">
                        <GraduationCap className="h-3.5 w-3.5 text-gold" />
                        <span className="text-gold font-black text-[10px] uppercase tracking-[0.3em]">Alumni Network</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight italic">
                        Alumni <span className="text-gold">Association</span>
                    </h1>
                    <p className="text-lg text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
                        Our alumni network connects graduates and continues the legacy of mathematical excellence beyond BAFSKMC.
                    </p>
                </div>

                {members.length === 0 ? (
                    <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <GraduationCap className="h-16 w-16 text-white/10 mx-auto mb-4" />
                        <p className="text-white/20 font-black uppercase tracking-widest text-xs">The alumni directory is currently being populated.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {members.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-[#151515] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-gold/30 transition-all group text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl pointer-events-none" />

                                <div className="h-24 w-24 bg-white/5 rounded-full mx-auto mb-5 flex items-center justify-center border border-white/10 group-hover:border-gold/40 transition-colors overflow-hidden shadow-xl">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Users className="h-10 w-10 text-white/10" />
                                    )}
                                </div>
                                <h3 className="text-lg font-black text-white mb-1 group-hover:text-gold transition-colors tracking-tight">{member.name}</h3>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">{member.position}</p>
                                <div className="text-[9px] font-black text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20 inline-block uppercase tracking-widest mb-3">
                                    Class of {member.session || "N/A"}
                                </div>
                                {member.fbId && (
                                    <div className="flex justify-center mt-2">
                                        <a
                                            href={`https://facebook.com/${member.fbId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/10 text-blue-400/60 hover:text-blue-400 transition-all"
                                        >
                                            <Facebook className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
