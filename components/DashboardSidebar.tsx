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
    Mail,
    Megaphone,
    TrendingUp,
    Quote,
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
        { name: "Panel App", href: "/dashboard/panel-application", icon: <Shield className="h-4 w-4" /> },
        { name: "Exams", href: "/exams", icon: <ClipboardList className="h-4 w-4" /> },
        { name: "News", href: "/dashboard/news", icon: <FileText className="h-4 w-4" /> },
        { name: "Resources", href: "/dashboard/resources", icon: <BookOpen className="h-4 w-4" /> },
        { name: "Activities", href: "/dashboard/activities", icon: <Zap className="h-4 w-4" /> },
        { name: "Gallery", href: "/dashboard/gallery", icon: <Camera className="h-4 w-4" /> },
        { name: "My Payments", href: "/dashboard/payments", icon: <CreditCard className="h-4 w-4" /> },
        { name: "Leaderboard", href: "/dashboard/leaderboard", icon: <Trophy className="h-4 w-4" /> },
        { name: "Apply for Document", href: "/dashboard/apply-document", icon: <FileText className="h-4 w-4" /> },
        { name: "Settings", href: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
    ];

    const adminItems = [
        { name: "Admin Home", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
        { name: "Panel Applications", href: "/admin/panel-applications", icon: <ClipboardList className="h-4 w-4" /> },
        { name: "Broadcast Mail", href: "/admin/broadcast", icon: <Mail className="h-4 w-4" /> },
        { name: "Verify Payments", href: "/admin/payments", icon: <ShieldCheck className="h-4 w-4" /> },
        { name: "Manage News", href: "/admin/news", icon: <FileText className="h-4 w-4" /> },
        { name: "Manage Exams", href: "/admin/exams", icon: <ClipboardList className="h-4 w-4" /> },
        { name: "Manage Quizzes", href: "/admin/quizzes", icon: <ClipboardList className="h-4 w-4" /> },
        { name: "Manage Resources", href: "/admin/resources", icon: <BookOpen className="h-4 w-4" /> },
        { name: "Manage Activities", href: "/admin/activities", icon: <Zap className="h-4 w-4" /> },
        { name: "Highlight Alert", href: "/admin/alerts", icon: <Bell className="h-4 w-4" /> },
        { name: "Manage Members", href: "/admin/members", icon: <Shield className="h-4 w-4" /> },
        { name: "Manage SRs", href: "/admin/sr", icon: <Users className="h-4 w-4" /> },
        { name: "Manage Badges", href: "/admin/achievements", icon: <Award className="h-4 w-4" /> },
        { name: "Manage Leaderboard", href: "/admin/leaderboard", icon: <Trophy className="h-4 w-4" /> },
        { name: "Manage Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
        { name: "Manage Gallery", href: "/admin/gallery", icon: <Camera className="h-4 w-4" /> },
        { name: "Advertisements", href: "/admin/advertisements", icon: <Megaphone className="h-4 w-4" /> },
        { name: "Stats & Analytics", href: "/admin/stats", icon: <TrendingUp className="h-4 w-4" /> },
        { name: "Certifications", href: "/admin/certificates", icon: <Award className="h-4 w-4" /> },
        { name: "Document Requests", href: "/admin/document-requests", icon: <FileText className="h-4 w-4" /> },
        { name: "Leadership Speeches", href: "/admin/speeches", icon: <Quote className="h-4 w-4" /> },
        { name: "Achievement Album", href: "/admin/achievement-corner", icon: <Award className="h-4 w-4" /> },
        { name: "Report to Chairman", href: "/admin/report-chairman", icon: <FileText className="h-4 w-4" /> },
    ];

    const activeItems = showAdminMenu ? adminItems : studentItems;

    return (
        <aside className="w-64 h-full flex flex-col shadow-2xl overflow-y-auto bg-[#06080F] border-r border-amber-400/20 font-sans">
            {/* Logo Header */}
            <div className="p-5 border-b border-amber-400/20 relative">
                {/* Mobile Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-5 p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 md:hidden"
                >
                    <X className="h-4 w-4" />
                </button>
                <Link href="/" className="flex items-center space-x-3 group mb-1">
                    <div className="relative h-11 w-11 rounded-xl overflow-hidden flex-shrink-0 border border-amber-400/40 p-0.5 bg-amber-400/10 shadow-[0_0_15px_rgba(255,184,0,0.15)]">
                        <Image
                            src="/logo.jpg"
                            alt="BAFSKMC"
                            fill
                            className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div>
                        <p className="text-base font-black text-white tracking-tight">BAFSKMC</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/80">Math Club Portal</p>
                    </div>
                </Link>
                {/* Role badge */}
                <div className="mt-3 flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03]">
                    {showAdminMenu ? <Shield className="h-3.5 w-3.5 text-amber-400" /> : <Star className="h-3.5 w-3.5 text-amber-400/70" />}
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-300/90">
                        {showAdminMenu ? "Administration" : "Student Portal"}
                    </span>
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
                {activeItems.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all group text-xs sm:text-sm font-semibold",
                                isActive
                                    ? "bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-300 border border-amber-400/40 shadow-[0_0_20px_rgba(255,184,0,0.15)] font-bold"
                                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <span className={isActive ? "text-amber-400" : "text-slate-400 group-hover:text-amber-400 transition-colors"}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="h-3.5 w-3.5 text-amber-400" />}
                        </Link>
                    );
                })}
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-amber-400/20">
                <div className="flex items-center space-x-3 px-2 mb-4">
                    <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border border-amber-400/40 p-0.5">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="avatar" className="h-full w-full object-cover rounded-full" />
                        ) : (
                            <div className="h-full w-full rounded-full flex items-center justify-center text-xs font-black bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950">
                                {(session?.user?.name?.[0] || "U").toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{session?.user?.name || "User"}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest truncate text-amber-400/80">{session?.user?.role?.toLowerCase()}</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-xl text-xs font-bold transition-all text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </button>
                <div className="mt-6 pt-3 border-t border-white/5 text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-400/60">System Architect</p>
                    <p className="text-[10px] font-black text-slate-400 tracking-tight uppercase">Abdur Rahman Rafi, CSE (UIU)</p>
                </div>
            </div>
        </aside>
    );
}
