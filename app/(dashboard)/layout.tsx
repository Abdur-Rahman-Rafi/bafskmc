"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { useSession } from "next-auth/react";
import { User, Bell, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0D0D0D]">
            {/* Sidebar with Mobile Support */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out md:static md:block`}>
                <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-[#111111]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center space-x-4">
                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gold md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-gold/30 flex-shrink-0">
                                <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-lg md:text-xl font-black text-white tracking-tight italic leading-none mb-1">
                                    BAFSKMC <span className="text-gold">PORTAL</span>
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">System Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-6">
                        <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10 group cursor-pointer">
                            <div className="h-8 w-8 rounded-lg overflow-hidden border border-gold/30 flex-shrink-0">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                                        <User className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                            <div className="hidden lg:flex flex-col items-start pr-2">
                                <p className="text-xs font-black text-white leading-tight">{session?.user?.name || "Member"}</p>
                                <p className="text-[9px] font-bold text-gold uppercase tracking-tighter">{session?.user?.role || "Student"}</p>
                            </div>
                            <ChevronDown className="h-3 w-3 text-white/20" />
                        </div>

                        <button className="p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-xl text-white/30 hover:text-gold hover:border-gold/30 transition-all relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-gold rounded-full border border-[#111111]" />
                        </button>
                    </div>
                </header>
                <main className="p-4 md:p-8 pb-16 relative overflow-x-hidden">
                    <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gold/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
                    <div className="relative z-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
