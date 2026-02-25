"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Loader2, Facebook } from "lucide-react";

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

export default function PanelPage() {
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
                        <span className="h-1.5 w-1.5 bg-gold rounded-full animate-pulse" />
                        <span className="text-gold font-black text-[10px] uppercase tracking-[0.3em]">Leadership Council</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight italic">
                        Executive <span className="text-gold">Panel</span>
                    </h1>
                    <p className="text-lg text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
                        Meet the dedicated minds leading the BAFSK Math Club towards excellence and innovation.
                    </p>
                </div>

                {members.length === 0 ? (
                    <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <Shield className="h-16 w-16 text-white/10 mx-auto mb-4" />
                        <p className="text-white/20 font-black uppercase tracking-widest text-xs">The panel list is currently being finalized.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {members.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="bg-[#151515] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 hover:border-gold/30 transition-all group relative"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 blur-[80px] pointer-events-none" />

                                <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10">
                                            <User className="h-24 w-24" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                                    {member.bio && (
                                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                            <p className="text-white/80 text-sm font-medium line-clamp-3 leading-relaxed">{member.bio}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 relative">
                                    <h3 className="text-2xl font-black text-white mb-1 group-hover:text-gold transition-colors tracking-tight">{member.name}</h3>
                                    <p className="text-gold font-black text-[10px] uppercase tracking-[0.25em] mb-4">{member.position}</p>
                                    <div className="flex items-center justify-between">
                                        {member.session && (
                                            <div className="inline-block px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-white/30 border border-white/5 uppercase tracking-widest">
                                                Session {member.session}
                                            </div>
                                        )}
                                        {member.fbId && (
                                            <a
                                                href={`https://facebook.com/${member.fbId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/10 text-blue-400 transition-all"
                                                onClick={e => e.stopPropagation()}
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
            </div>
        </div>
    );
}
