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
        <div className="flex flex-col min-h-screen bg-[#080C14] text-white">
            <NewsTicker />
            <Navbar />

            <main className="flex-grow">
                {children}
            </main>

            <footer className="border-t py-14 bg-[#050811] border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-amber-500/40 flex-shrink-0 shadow-[0_0_15px_rgba(240,192,64,0.15)]">
                                <Image src="/logo.jpg" alt="BAFSKMC" fill className="object-cover" />
                            </div>
                            <div>
                                <p className="font-black shimmer text-sm">BAFSK Math Club</p>
                                <p className="text-xs font-medium text-amber-400/70">BAF Shaheen College Kurmitola</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-gray-400">
                            <Link href="/news" className="hover:text-yellow-400 transition-colors">News</Link>
                            <Link href="/panel" className="hover:text-yellow-400 transition-colors">Panel</Link>
                            <Link href="/sr" className="hover:text-yellow-400 transition-colors">SR</Link>
                            <Link href="/alumni" className="hover:text-yellow-400 transition-colors">Alumni</Link>
                            <Link href="/activities" className="hover:text-yellow-400 transition-colors">Activities</Link>
                            <Link href="/resources" className="hover:text-yellow-400 transition-colors">Resources</Link>
                            <Link href="/about" className="hover:text-yellow-400 transition-colors">About</Link>
                        </div>
                        <div className="flex flex-col items-center md:items-end space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                                © {new Date().getFullYear()} BAFSK. All rights reserved.
                            </p>
                            <div className="text-[10px] md:text-right">
                                <span className="text-gray-600">Developed by </span>
                                <span className="font-bold uppercase tracking-wider text-amber-400/80">Abdur Rahman Rafi</span>
                                <p className="text-gray-600 font-medium tracking-tighter">Bachelor in CSE (UIU)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

