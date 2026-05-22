import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
    TrendingUp, 
    Users, 
    Award, 
    Shield, 
    FileText, 
    ClipboardList,
    CreditCard,
    Zap,
    Clock
} from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminStatsPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    // Fetch aggregate statistics concurrently
    const [
        totalUsers,
        totalStudents,
        totalAdmins,
        
        totalExams,
        totalSubmissions,
        
        totalDocumentRequests,
        pendingDocumentRequests,
        
        totalPanelApplications,
        pendingPanelApplications,
        
        totalPayments,
        pendingPayments,
        totalRevenueResult
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "ADMIN" } }),
        
        prisma.exam.count(),
        prisma.submission.count(),
        
        prisma.documentRequest.count(),
        prisma.documentRequest.count({ where: { status: "PENDING" } }),
        
        prisma.panelApplication.count(),
        prisma.panelApplication.count({ where: { status: "PENDING" } }),
        
        prisma.payment.count(),
        prisma.payment.count({ where: { status: "PENDING" } }),
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: "VERIFIED" }
        })
    ]);

    const totalRevenue = totalRevenueResult._sum.amount || 0;

    const statCards = [
        { title: "Total Users", value: totalUsers, sub: `${totalStudents} Students, ${totalAdmins} Admins`, icon: <Users className="h-5 w-5 text-gold" style={{ color: "#C9962B" }} /> },
        { title: "Total Revenue", value: `৳${totalRevenue}`, sub: "From Verified Payments", icon: <CreditCard className="h-5 w-5 text-emerald-400" /> },
        { title: "Pending Payments", value: pendingPayments, sub: `Out of ${totalPayments} total payments`, icon: <Clock className="h-5 w-5 text-orange-400" /> },
        { title: "Document Requests", value: pendingDocumentRequests, sub: `${totalDocumentRequests} total requests`, icon: <FileText className="h-5 w-5 text-blue-400" /> },
        { title: "Panel Applications", value: pendingPanelApplications, sub: `${totalPanelApplications} total applications`, icon: <Shield className="h-5 w-5 text-purple-400" /> },
        { title: "Total Exams", value: totalExams, sub: `${totalSubmissions} student submissions`, icon: <ClipboardList className="h-5 w-5 text-red-400" /> },
    ];

    // Get recent document requests
    const recentRequests = await prisma.documentRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

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
                        A detailed overview of portal metrics, user engagement, and administrative workload.
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-[#0D0D0D] rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tight">{stat.value}</h3>
                        <p className="text-sm font-bold text-white mt-2">{stat.title}</p>
                        <p className="text-xs font-semibold text-white/40 mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Document Requests */}
                <div className="bg-[#0D0D0D] rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-lg font-black text-white flex items-center">
                            <FileText className="h-4 w-4 mr-2" style={{ color: "#C9962B" }} />
                            Recent Document Requests
                        </h3>
                    </div>
                    <div className="p-2">
                        {recentRequests.length === 0 ? (
                            <p className="p-6 text-sm text-white/40 text-center font-semibold">No recent requests.</p>
                        ) : (
                            <div className="space-y-2">
                                {recentRequests.map(req => (
                                    <div key={req.id} className="p-4 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white">{req.user.name}</p>
                                            <p className="text-xs text-white/40">{req.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${req.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                                {req.status}
                                            </span>
                                            <p className="text-[10px] text-white/30 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-[#0D0D0D] rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-lg font-black text-white flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-emerald-500" />
                            Recent Payments
                        </h3>
                    </div>
                    <div className="p-2">
                        {recentPayments.length === 0 ? (
                            <p className="p-6 text-sm text-white/40 text-center font-semibold">No recent payments.</p>
                        ) : (
                            <div className="space-y-2">
                                {recentPayments.map(pay => (
                                    <div key={pay.id} className="p-4 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white">{pay.user.name}</p>
                                            <p className="text-xs text-white/40">৳{pay.amount} via {pay.method}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${pay.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : pay.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                {pay.status}
                                            </span>
                                            <p className="text-[10px] text-white/30 mt-1">{new Date(pay.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
