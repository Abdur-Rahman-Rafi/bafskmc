"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, User } from "lucide-react";

interface PrincipalSpeech {
  enabled: boolean;
  name: string;
  designation: string;
  subTitle?: string;
  speech: string;
  imageUrl?: string;
}

interface ModeratorSpeech {
  id: string;
  name: string;
  roleTitle: string;
  department?: string;
  speech: string;
  imageUrl?: string;
  priority: number;
}

export default function InstitutionalSpeechSection() {
  const [principal, setPrincipal] = useState<PrincipalSpeech | null>(null);
  const [moderators, setModerators] = useState<ModeratorSpeech[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/speeches")
      .then((res) => res.json())
      .then((data) => {
        if (data?.principal) setPrincipal(data.principal);
        if (Array.isArray(data?.moderators)) setModerators(data.moderators);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || (!principal?.enabled && moderators.length === 0)) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-[#080C14] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border mb-4 backdrop-blur-md bg-amber-500/10 border-amber-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
                Institutional Leadership & Mentorship
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              Guiding <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600">Voices</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto font-medium text-base">
              Words of guidance from the Patron-in-Chief and Faculty Moderators of BAF-Shaheen College Kurmitola.
            </p>
          </motion.div>
        </div>


        {principal?.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 relative rounded-[2.5rem] p-8 md:p-12 border border-amber-500/20 backdrop-blur-xl overflow-hidden bg-gradient-to-br from-[#121826] via-[#0E131F] to-[#0A0D16] shadow-2xl"
          >
            <div className="amber-500/5 absolute top-0 right-0 w-96 h-96 blur-[120px] pointer-events-none" />
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
              <div className="w-52 h-52 md:w-64 md:h-64 shrink-0 relative">
                <div className="w-full h-full rounded-[2rem] overflow-hidden border-2 border-amber-500/40 p-1 bg-black/40 shadow-xl">
                  {principal.imageUrl ? (
                    <img
                      src={principal.imageUrl}
                      alt={principal.name}
                      className="w-full h-full object-cover rounded-[1.8rem] hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-amber-400/40 rounded-[1.8rem]">
                      <User className="w-16 h-16" />
                      <span className="text-[10px] font-black uppercase tracking-widest mt-2">Principal</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-5 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-amber-400 font-black text-[10px] uppercase tracking-[0.2em]">
                      Message from the Principal
                    </span>
                    <p className="text-xs font-bold text-white/50">
                      BAF-Shaheen College Kurmitola
                    </p>
                  </div>
                </div>

                <blockquote className="text-lg details-quote md:text-xl font-medium text-white/90 leading-relaxed italic">
                  \"{principal.speech}\"
                </blockquote>

                <div className="pt-4 border-t white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {principal.name}
                    </h3>
                    <p className="text-amber-400 font-bold text-xs uppercase tracking-widest mt-0.5">
                      {principal.designation}
                    </p>
                    {principal.subTitle && (
                      <p className="text-white/40 font-medium text-xs mt-0.5">
                        {principal.subTitle}
                      </p>
                    )}
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 self-center lg:self-auto">
                    <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">
                      Patron-in-Chief
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}


        {moderators.length > 0 && (
          <div className="space-y-6">
            <div className="mb-6">
              <span className="text-amber-400 font-black text-[10px] uppercase tracking-[0.3em]">
                Club Mentors
              </span>
              <h3 className="text-3xl font-black text-white tracking-tight">
                Moderators\' <span className="text-amber-400">Speeches</span>
              </h3>
            </div>

            <div className={`grid grid-cols-1 ${moderators.length > 1 ? "md:grid-cols-2" : "max-w-3xl mx-auto"} gap-6`}>
              {moderators.sort((a, b) => a.priority - b.priority).map((mod, i) => (
                <motion.div
                  key={mod.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 rounded-[2remu backdrop-blur-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-amber-500/30 bg-slate-900">
                        {mod.imageUrl ? (
                          <img
                            src={mod.imageUrl}
                            alt={mod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-amber-400/30">
                            <User className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-amber-400 font-black text-[10px] uppercase tracking-widest">
                          {mod.roleTitle || "Club Moderator"}
                        </span>
                        <h4 className="text-lg font-black text-white tracking-tight mt-0.5">
                          {mod.name}
                        </h4>
                        {mod.department && (
                          <p className="text-white/40 font-bold text-xs">
                            {mod.department}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-white/80 text-sm italic leading-relaxed">
                      \"${mod.speech}\"
                    </p>
                  </div>


                  <div className="mt-6 pt-4 border-t white/5 flex items-center justify-between text-[10px]">
                    <span className="font-black uppercase tracking-widest text-amber-400/80">
                      BAFSKMC Moderator
                    </span>
                    <span className="font-bold text-white/30 uppercase">
                      BAF Shaheen College Kurmitola
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
