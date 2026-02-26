"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    FileText,
    Trophy,
    Users,
    Award,
    Settings,
    LogOut,
    ChevronRight,
    ClipboardList,
    BookOpen,
    Shield,
    ShieldCheck,
    Camera,
    Zap,
    Palette,
    CreditCard,
    Bell,
    Star,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function DashboardSidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const isAdmin = session?.user?.role === "ADMIN";
    const isModerator = session?.user?.role === "MODERATOR";
    const isPowerUser = isAdmin || isModerator;

    // Admin always sees admin menu. Students always see student menu.
    const showAdminMenu = isPowerUser;

    const studentItems = [
        { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
        { name: "My Results", href: "/dashboard/results", icon: <Trophy className="h-4 w-4" /> },
        { name: "Exams", href: "/exams", icon: <ClipboardList className="h-4 w-4" /> },
        { name: "News", href: "/dashboard/news", icon: <FileText className="h-4 w-4" /> },
        { name: "Resources", href: "/dashboard/resources", icon: <BookOpen className="h-4 w-4" /> },
        { name: "Activities", href: "/dashboard/activities", icon: <Zap className="h-4 w-4" /> },
        { name: "Gallery", href: "/dashboard/gallery", icon: <Camera className="h-4 w-4" /> },
        { name: "My Payments", href: "/dashboard/payments", icon: <CreditCard className="h-4 w-4" /> },
        { name: "Leaderboard", href: "/dashboard/leaderboard", icon: <Trophy className="h-4 w-4" /> },
        { name: "Settings", href: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
    ];

    const adminItems = [
        { name: "Admin Home", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
        { name: "Verify Payments", href: "/admin/payments", icon: <ShieldCheck className="h-4 w-4" /> },
        { name: "Manage News", href: "/admin/news", icon: <FileText className="h-4 w-4" /> },
        { name: "Manage Exams", href: "/admin/exams", icon: <ClipboardList className="h-4 w-4" /> },
        { name: "Manage Resources", href: "/admin/resources", icon: <BookOpen className="h-4 w-4" /> },
        { name: "Manage Activities", href: "/admin/activities", icon: <Zap className="h-4 w-4" /> },
        { name: "Manage Members", href: "/admin/members", icon: <Shield className="h-4 w-4" /> },
        { name: "Manage Badges", href: "/admin/achievements", icon: <Award className="h-4 w-4" /> },
        { name: "Manage Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
        { name: "Manage Gallery", href: "/admin/gallery", icon: <Camera className="h-4 w-4" /> },
        { name: "Branding & Logo", href: "/admin/branding", icon: <Palette className="h-4 w-4" /> },
    ];

    const activeItems = showAdminMenu ? adminItems : studentItems;

    return (
        <aside className="w-64 h-full flex flex-col shadow-2xl overflow-y-auto" style={{ backgroundColor: "#0D0D0D", borderRight: "1px solid rgba(201, 150, 43, 0.25)" }}>
            {/* Logo Header */}
            <div className="p-5 border-b relative" style={{ borderColor: "rgba(201, 150, 43, 0.2)" }}>
                {/* Mobile Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-5 p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 md:hidden"
                >
                    <X className="h-4 w-4" />
                </button>
                <Link href="/" className="flex items-center space-x-3 group mb-1">
                    <div className="relative h-11 w-11 rounded-xl overflow-hidden flex-shrink-0 border" style={{ borderColor: "rgba(201, 150, 43, 0.5)" }}>
                        <Image
                            src="/logo.jpg"
                            alt="BAFSKMC"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div>
                        <p className="text-base font-black text-white tracking-tight shimmer">BAFSKMC</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(201, 150, 43, 0.7)" }}>Math Club Portal</p>
                    </div>
                </Link>
                {/* Role badge */}
                <div className="mt-3 flex items-center space-x-2 px-3 py-2 rounded-xl" style={{ background: showAdminMenu ? "rgba(201,150,43,0.08)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    {showAdminMenu ? <Shield className="h-3 w-3" style={{ color: "#C9962B" }} /> : <Star className="h-3 w-3 text-white/20" />}
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: showAdminMenu ? "#C9962B" : "rgba(255,255,255,0.2)" }}>
                        {showAdminMenu ? "Administration" : "Student Portal"}
                    </span>
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
                {activeItems.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group text-sm font-semibold")}
                            style={isActive
                                ? { background: "linear-gradient(135deg, rgba(201,150,43,0.25), rgba(201,150,43,0.1))", color: "#F0C040", border: "1px solid rgba(201,150,43,0.4)" }
                                : { color: "rgba(255,255,255,0.5)", border: "1px solid transparent" }
                            }
                            onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.color = "#C9962B"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,150,43,0.06)"; } }}
                            onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; } }}
                        >
                            <div className="flex items-center space-x-3">
                                {item.icon}
                                <span>{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                        </Link>
                    );
                })}
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t" style={{ borderColor: "rgba(201, 150, 43, 0.2)" }}>
                <div className="flex items-center space-x-3 px-2 mb-4">
                    <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border" style={{ borderColor: "rgba(201,150,43,0.4)" }}>
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs font-black" style={{ background: "linear-gradient(135deg, #C9962B, #8B6914)", color: "#0D0D0D" }}>
                                {(session?.user?.name?.[0] || "U").toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{session?.user?.name || "User"}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest truncate" style={{ color: "rgba(201,150,43,0.7)" }}>{session?.user?.role?.toLowerCase()}</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </button>
                <div className="mt-8 pt-4 border-t border-white/5 text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: "rgba(201,150,43,0.4)" }}>System Architect</p>
                    <p className="text-[10px] font-black text-white/30 tracking-tight uppercase">Abdur Rahman Rafi, CSE (UIU)</p>
                </div>
            </div>
        </aside>
    );
}
