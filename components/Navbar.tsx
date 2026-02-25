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
        { name: "Alumni", href: "/alumni" },
        { name: "Activities", href: "/activities" },
        { name: "Resources", href: "/resources" },
        { name: "Gallery", href: "/gallery" },
        { name: "About", href: "/about" },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: "#0D0D0D", borderColor: "rgba(201, 150, 43, 0.3)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative h-12 w-12 overflow-hidden rounded-xl flex-shrink-0 border" style={{ borderColor: "rgba(201, 150, 43, 0.4)" }}>
                                <Image
                                    src="/logo.jpg"
                                    alt="BAFSK Math Club"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div>
                                <p className="text-base font-black tracking-tight shimmer whitespace-nowrap">BAFSK</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(201, 150, 43, 0.7)" }}>Math Club</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-gray-300 hover:text-yellow-400 hover:bg-white/5"
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
                                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                                    style={{ color: "#C9962B", border: "1px solid rgba(201, 150, 43, 0.3)" }}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:text-yellow-400 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-gold px-5 py-2.5 rounded-xl text-sm"
                                >
                                    Join Club
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t px-4 py-4 space-y-1" style={{ backgroundColor: "#111111", borderColor: "rgba(201, 150, 43, 0.2)" }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center h-11 px-4 rounded-xl text-sm font-semibold text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="border-t pt-4 mt-4 space-y-2" style={{ borderColor: "rgba(201, 150, 43, 0.2)" }}>
                        {session ? (
                            <>
                                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 h-11 px-4 rounded-xl text-sm font-bold" style={{ color: "#C9962B" }}>
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <button onClick={() => signOut()} className="flex items-center space-x-2 h-11 px-4 rounded-xl text-sm font-bold text-red-400 w-full">
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsOpen(false)} className="flex h-11 items-center px-4 rounded-xl text-sm font-bold text-gray-300">Sign In</Link>
                                <Link href="/register" onClick={() => setIsOpen(false)} className="btn-gold flex h-11 items-center justify-center px-4 rounded-xl text-sm">Join Club</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
