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
    <section className="py-16 sm:py-24 relative overflow-hidden bg-[#080C14] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border mb-3 sm:mb-4 backdrop-blur-md bg-amber-500/10 border-amber-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-amber-400">
                Institutional Leadership & Mentorship
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 tracking-tight">
              Guiding <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600">Voices</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto font-medium text-xs sm:text-base leading-relaxed">
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
            className="mb-12 sm:mb-16 relative rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-amber-500/20 backdrop-blur-xl overflow-hidden bg-gradient-to-br from-[#121826] via-[#0E131F] to-[#0A0D16] shadow-2xl"
          >
            <div className="amber-500/5 absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 blur-[100px] sm:blur-[120px] pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 relative z-10">
              {/* Principal Photo & Patron Badge */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 relative">
                  <div className="w-full h-full rounded-2xl sm:rounded-[2rem] overflow-hidden border-2 border-amber-500/40 p-1 bg-black/40 shadow-xl relative group">
                    {principal.imageUrl ? (
                      <img
                        src={principal.imageUrl}
                        alt={principal.name}
                        className="w-full h-full object-cover rounded-xl sm:rounded-[1.7rem] group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-amber-400/40 rounded-xl sm:rounded-[1.7rem]">
                        <User className="w-12 h-12 sm:w-16 sm:h-16" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-2">Principal</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 lg:hidden">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    Patron-in-Chief
                  </span>
                </div>
              </div>

              {/* Principal Content */}
              <div className="flex-1 space-y-4 sm:space-y-5 text-center lg:text-left w-full">
                <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                    <Quote className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-amber-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] block">
                      Message from the Principal
                    </span>
                    <p className="text-[11px] sm:text-xs font-bold text-white/50">
                      BAF-Shaheen College Kurmitola
                    </p>
                  </div>
                </div>

                <div className="relative px-2 sm:px-0">
                  <blockquote className="text-sm sm:text-base md:text-xl font-medium text-white/90 leading-relaxed italic relative">
                    &ldquo;{principal.speech}&rdquo;
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
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

                  <div className="hidden lg:block px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 self-center lg:self-auto shrink-0">
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
            <div className="mb-6 text-center sm:text-left">
              <span className="text-amber-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] block">
                Club Mentors
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Moderators&apos; <span className="text-amber-400">Speeches</span>
              </h3>
            </div>

            <div className={`grid grid-cols-1 ${moderators.length > 1 ? "md:grid-cols-2" : "max-w-3xl mx-auto"} gap-5 sm:gap-6`}>
              {moderators.sort((a, b) => a.priority - b.priority).map((mod, i) => (
                <motion.div
                  key={mod.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-5 sm:p-7 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3.5 sm:gap-4 mb-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border border-amber-500/30 bg-slate-900 shadow-md">
                        {mod.imageUrl ? (
                          <img
                            src={mod.imageUrl}
                            alt={mod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-amber-400/30">
                            <User className="w-7 h-7 sm:w-8 sm:h-8" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-amber-400 font-black text-[9px] sm:text-[10px] uppercase tracking-wider block truncate">
                          {mod.roleTitle || "Club Moderator"}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-white tracking-tight truncate mt-0.5">
                          {mod.name}
                        </h4>
                        {mod.department && (
                          <p className="text-white/40 font-bold text-[11px] sm:text-xs truncate">
                            {mod.department}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-white/80 text-xs sm:text-sm italic leading-relaxed pl-1 sm:pl-2 border-l-2 border-amber-400/30">
                      &ldquo;{mod.speech}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-[9px] sm:text-[10px]">
                    <span className="font-black uppercase tracking-widest text-amber-400/80">
                      BAFSKMC Moderator
                    </span>
                    <span className="font-bold text-white/30 uppercase truncate ml-2">
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
