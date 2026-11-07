"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "News", href: "/news" },
        { name: "Panel", href: "/panel" },
        { name: "SR", href: "/sr" },
        { name: "Alumni", href: "/alumni" },
        { name: "Activities", href: "/activities" },
        { name: "Resources", href: "/resources" },
        { name: "Gallery", href: "/gallery" },
        { name: "About", href: "/about" },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300 bg-[#06080F]/85 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative h-11 w-11 sm:h-12 sm:w-12 overflow-hidden rounded-2xl flex-shrink-0 border-2 border-amber-400/50 p-0.5 bg-black/60 shadow-[0_0_20px_rgba(255,184,0,0.25)] group-hover:scale-105 group-hover:border-amber-300 transition-all duration-300">
                                <Image
                                    src="/logo.jpg"
                                    alt="BAFSK Math Club"
                                    fill
                                    className="object-cover rounded-xl"
                                />
                            </div>
                            <div>
                                <p className="text-base font-black tracking-tight text-white group-hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1.5">
                                    BAFSK <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/30 uppercase tracking-widest font-mono">MATH</span>
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Shaheen College</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center space-x-1 bg-white/[0.03] border border-white/5 rounded-2xl p-1.5 backdrop-blur-md">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-gray-300 hover:text-amber-300 hover:bg-white/5 hover:shadow-inner"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        {session ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 shadow-md shadow-amber-400/10"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-gold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 uppercase tracking-wider"
                                >
                                    <span>Join Club</span>
                                    <span className="text-[10px] font-mono">✦</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-amber-400 transition-colors"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden border-t px-4 py-5 space-y-1 backdrop-blur-3xl bg-[#06080F]/98 border-white/10 shadow-2xl">
                    <div className="grid grid-cols-2 gap-1 mb-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center h-10 px-3.5 rounded-xl text-xs font-bold text-gray-300 hover:text-amber-300 hover:bg-white/5 transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="border-t pt-4 space-y-2 border-white/10">
                        {session ? (
                            <>
                                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 h-11 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <button onClick={() => signOut()} className="flex items-center space-x-2 h-11 px-4 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 w-full">
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 pt-1">
                                <Link href="/login" onClick={() => setIsOpen(false)} className="flex h-11 items-center justify-center px-4 rounded-xl text-xs font-black uppercase tracking-wider text-gray-300 bg-white/5 border border-white/10">Sign In</Link>
                                <Link href="/register" onClick={() => setIsOpen(false)} className="btn-gold flex h-11 items-center justify-center px-4 rounded-xl text-xs uppercase tracking-wider">Join Math Club ✦</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
