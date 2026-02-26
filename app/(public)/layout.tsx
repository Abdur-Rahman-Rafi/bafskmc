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
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#0D0D0D" }}>
            <NewsTicker />
            <Navbar />

            <main className="flex-grow">{children}</main>

            <footer className="border-t py-12" style={{ backgroundColor: "#111111", borderColor: "rgba(201, 150, 43, 0.2)" }}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="relative h-10 w-10 rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: "rgba(201, 150, 43, 0.4)" }}>
                                <Image src="/logo.jpg" alt="BAFSKMC" fill className="object-cover" />
                            </div>
                            <div>
                                <p className="font-black shimmer text-sm">BAFSK Math Club</p>
                                <p className="text-xs font-medium" style={{ color: "rgba(201,150,43,0.6)" }}>BAF Shaheen College Kurmitola</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <Link href="/news" className="hover:text-yellow-400 transition-colors">News</Link>
                            <Link href="/activities" className="hover:text-yellow-400 transition-colors">Activities</Link>
                            <Link href="/resources" className="hover:text-yellow-400 transition-colors">Resources</Link>
                            <Link href="/about" className="hover:text-yellow-400 transition-colors">About</Link>
                        </div>
                        <div className="flex flex-col items-center md:items-end space-y-1">
                            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                                © {new Date().getFullYear()} BAFSK. All rights reserved.
                            </p>
                            <div className="text-[10px] md:text-right">
                                <span style={{ color: "rgba(255,255,255,0.2)" }}>Developed by </span>
                                <span className="font-bold uppercase tracking-wider" style={{ color: "rgba(201,150,43,0.8)" }}>Abdur Rahman Rafi</span>
                                <p style={{ color: "rgba(255,255,255,0.15)" }} className="font-medium tracking-tighter">Bachelor in CSE (UIU)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

