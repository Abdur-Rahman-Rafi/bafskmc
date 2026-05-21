import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TrendingUp, Users, Award, Shield } from "lucide-react";

export default async function AdminStatsPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-[2rem] p-8" style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)", border: "1px solid rgba(201, 150, 43, 0.2)" }}>
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <TrendingUp className="w-48 h-48 text-gold" style={{ color: "#C9962B" }} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-gold/10 rounded-2xl" style={{ backgroundColor: "rgba(201, 150, 43, 0.1)" }}>
                            <TrendingUp className="h-6 w-6" style={{ color: "#C9962B" }} />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Stats & Analytics</h1>
                    </div>
                    <p className="text-white/50 text-sm font-medium max-w-xl">
                        A detailed overview of portal metrics, user engagement, and document statistics.
                    </p>
                </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="p-12 text-center bg-[#0D0D0D] rounded-[2rem] border border-white/5">
                <div className="inline-flex items-center justify-center p-4 bg-gold/10 rounded-full mb-4 border border-gold/20">
                    <TrendingUp className="h-8 w-8 text-gold" style={{ color: "#C9962B" }} />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Analytics Dashboard Coming Soon</h2>
                <p className="text-white/50 font-medium max-w-md mx-auto">
                    We are currently building comprehensive charts and metrics to help you track member engagement, document issuance, and portal activity in real-time.
                </p>
            </div>
        </div>
    );
}
