"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Megaphone, ArrowRight, X, Sparkles } from "lucide-react";
import Link from "next/link";

interface AlertConfig {
    enabled: boolean;
    type: "COMPETITION" | "NEWS" | "GENERAL";
    badge: string;
    title: string;
    description?: string;
    link: string;
    buttonText: string;
    theme?: "gold" | "cyan" | "crimson";
}

export default function HomeHighlightAlert() {
    const [alert, setAlert] = useState<AlertConfig | null>(null);
    const [dismissed, setDismissed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check session storage for dismissal
        if (typeof window !== "undefined") {
            const isDismissed = sessionStorage.getItem("bafskmc_alert_dismissed");
            if (isDismissed) {
                setDismissed(true);
            }
        }

        fetch("/api/alert")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.enabled) {
                    setAlert(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        if (typeof window !== "undefined") {
            sessionStorage.setItem("bafskmc_alert_dismissed", "true");
        }
    };

    if (loading || dismissed || !alert || !alert.enabled) {
        return null;
    }

    const isCompetition = alert.type === "COMPETITION";
    const theme = alert.theme || (isCompetition ? "gold" : "cyan");

    const themeStyles = {
        gold: {
            border: "border-amber-500/30",
            bg: "bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-slate-900/80",
            badgeBg: "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]",
            glow: "shadow-[0_10px_35px_-5px_rgba(245,158,11,0.15)]",
            btn: "bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:shadow-[0_0_25px_rgba(251,191,36,0.5)]",
            pulse: "bg-amber-400",
        },
        cyan: {
            border: "border-sky-500/30",
            bg: "bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-slate-900/80",
            badgeBg: "bg-sky-400 text-black shadow-[0_0_15px_rgba(56,189,248,0.4)]",
            glow: "shadow-[0_10px_35px_-5px_rgba(56,189,248,0.15)]",
            btn: "bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]",
            pulse: "bg-sky-400",
        },
        crimson: {
            border: "border-rose-500/30",
            bg: "bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-slate-900/80",
            badgeBg: "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]",
            glow: "shadow-[0_10px_35px_-5px_rgba(244,63,94,0.15)]",
            btn: "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:shadow-[0_0_25px_rgba(244,63,94,0.5)]",
            pulse: "bg-rose-500",
        },
    }[theme];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full relative z-40 px-4 sm:px-6 lg:px-8 pt-4 pb-2"
            >
                <div
                    className={`max-w-7xl mx-auto rounded-2xl md:rounded-3xl p-4 md:p-5 border backdrop-blur-xl relative overflow-hidden transition-all ${themeStyles.border} ${themeStyles.bg} ${themeStyles.glow}`}
                >
                    {/* Ambient light streak */}
                    <div className="absolute top-0 right-1/4 w-96 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none transform -skew-x-12" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                        {/* Left: Badge + Content */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 w-full md:w-auto">
                            {/* Type Badge */}
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${themeStyles.pulse}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${themeStyles.pulse}`}></span>
                                </span>
                                <div
                                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${themeStyles.badgeBg}`}
                                >
                                    {isCompetition ? (
                                        <Trophy className="h-3 w-3" />
                                    ) : (
                                        <Megaphone className="h-3 w-3" />
                                    )}
                                    <span>{alert.badge || (isCompetition ? "Competition Alert" : "News Alert")}</span>
                                </div>
                            </div>

                            {/* Headline & Description */}
                            <div className="flex flex-col">
                                <h3 className="text-sm md:text-base font-black text-white tracking-tight flex items-center gap-2">
                                    <span>{alert.title}</span>
                                    <Sparkles className="h-3.5 w-3.5 text-amber-400 hidden lg:inline-block" />
                                </h3>
                                {alert.description && (
                                    <p className="text-xs text-gray-400 font-medium line-clamp-1 mt-0.5">
                                        {alert.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right: Action CTA & Close Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                            {(() => {
                                const targetUrl = alert.link?.trim() || "/news";
                                const isExternal = /^https?:\/\//i.test(targetUrl);
                                const className = `px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 shadow-lg active:scale-95 ${themeStyles.btn}`;
                                
                                return isExternal ? (
                                    <a
                                        href={targetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={className}
                                    >
                                        <span>{alert.buttonText || "Check It Out"}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </a>
                                ) : (
                                    <Link
                                        href={targetUrl}
                                        className={className}
                                    >
                                        <span>{alert.buttonText || "Check It Out"}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                );
                            })()}

                            <button
                                onClick={handleDismiss}
                                aria-label="Dismiss alert"
                                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
