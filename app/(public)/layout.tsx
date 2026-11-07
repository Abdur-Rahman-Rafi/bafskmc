import Navbar from "@/components/Navbar";
import NewsTicker from "@/components/NewsTicker";
import Image from "next/image";
import Link from "next/link";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-[#06080F] text-white">
            <NewsTicker />
            <Navbar />

            <main className="flex-grow">
                {children}
            </main>

            <footer className="border-t py-14 bg-[#050811] border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 blur-[120px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center space-x-3.5">
                            <div className="relative h-12 w-12 rounded-2xl overflow-hidden border-2 border-amber-400/40 p-0.5 bg-black/60 flex-shrink-0 shadow-[0_0_20px_rgba(255,184,0,0.2)]">
                                <Image src="/logo.jpg" alt="BAFSKMC" fill className="object-cover rounded-xl" />
                            </div>
                            <div>
                                <p className="font-black text-white text-base tracking-tight flex items-center gap-2">
                                    BAFSK Math Club
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 uppercase tracking-widest">Official</span>
                                </p>
                                <p className="text-xs font-medium text-gray-400">BAF Shaheen College Kurmitola</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <Link href="/news" className="hover:text-amber-300 transition-colors">News</Link>
                            <Link href="/panel" className="hover:text-amber-300 transition-colors">Panel</Link>
                            <Link href="/sr" className="hover:text-amber-300 transition-colors">SR</Link>
                            <Link href="/alumni" className="hover:text-amber-300 transition-colors">Alumni</Link>
                            <Link href="/activities" className="hover:text-amber-300 transition-colors">Activities</Link>
                            <Link href="/resources" className="hover:text-amber-300 transition-colors">Resources</Link>
                            <Link href="/gallery" className="hover:text-amber-300 transition-colors">Gallery</Link>
                            <Link href="/about" className="hover:text-amber-300 transition-colors">About</Link>
                        </div>

                        <div className="flex flex-col items-center md:items-end space-y-1.5 text-center md:text-right">
                            <p className="text-xs font-medium text-gray-500">
                                © {new Date().getFullYear()} BAFSK Math Club. All rights reserved.
                            </p>
                            <div className="text-[10px]">
                                <span className="text-gray-500">Crafted by </span>
                                <span className="font-bold uppercase tracking-wider text-amber-400">Abdur Rahman Rafi</span>
                                <p className="text-gray-500 font-medium tracking-tight">Bachelor in CSE (UIU)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

