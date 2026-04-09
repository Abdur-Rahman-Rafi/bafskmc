"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCircle2, AlertCircle, Info, Clock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link: string | null;
    createdAt: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Set up polling or just fetch on mount
        const interval = setInterval(fetchNotifications, 60000); // Every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ readAll: true })
            });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read");
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "SUCCESS": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "WARNING": return <AlertCircle className="h-4 w-4 text-amber-500" />;
            case "URGENT": return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-xl transition-all relative group ${isOpen ? "text-gold border-gold/30" : "text-white/30 hover:text-gold hover:border-gold/30"}`}
            >
                <Bell className={`h-4 w-4 ${unreadCount > 0 ? "animate-swing" : ""}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 bg-gold rounded-full border-2 border-[#111111]" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-[320px] md:w-[400px] bg-[#151515] border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Inbox</h3>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter mt-0.5">Notification Protocol</p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[9px] font-black text-gold uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                            {notifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Bell className="h-10 w-10 text-white/5 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Signal Terminal Empty</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`p-5 transition-all hover:bg-white/[0.03] relative group ${!n.isRead ? "bg-gold/[0.02]" : ""}`}
                                            onClick={() => !n.isRead && markAsRead(n.id)}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className={`mt-1 p-2 rounded-lg bg-white/5 border border-white/10 shadow-inner`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className={`text-xs font-black uppercase tracking-tight truncate ${!n.isRead ? "text-white" : "text-white/40"}`}>
                                                            {n.title}
                                                        </h4>
                                                        {!n.isRead && (
                                                            <div className="h-1.5 w-1.5 bg-gold rounded-full shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className={`text-[11px] leading-relaxed line-clamp-2 ${!n.isRead ? "text-white/60" : "text-white/20"}`}>
                                                        {n.message}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center space-x-2 text-white/10">
                                                            <Clock className="h-3 w-3" />
                                                            <span className="text-[9px] font-bold uppercase">
                                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        
                                                        {n.link && (
                                                            <Link 
                                                                href={n.link}
                                                                className="flex items-center space-x-1 text-[9px] font-black text-gold/60 hover:text-gold uppercase tracking-widest transition-colors"
                                                            >
                                                                <span>View</span>
                                                                <ExternalLink className="h-2.5 w-2.5" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
                            <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em]">BAFSKMC Neural Link v1.0</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
