import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminDocumentRequestsPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    let requests: any[] = [];
    let dbError = false;

    try {
        requests = await prisma.documentRequest.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (e) {
        console.error("Failed to fetch document requests", e);
        dbError = true;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-[2rem] p-8" style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)", border: "1px solid rgba(201, 150, 43, 0.2)" }}>
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <FileText className="w-48 h-48 text-gold" style={{ color: "#C9962B" }} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-gold/10 rounded-2xl" style={{ backgroundColor: "rgba(201, 150, 43, 0.1)" }}>
                            <FileText className="h-6 w-6" style={{ color: "#C9962B" }} />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Student Document Requests</h1>
                    </div>
                    <p className="text-white/50 text-sm font-medium max-w-xl">
                        Review certificates and testimonials requested by students.
                    </p>
                </div>
            </div>

            {dbError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold">
                    The database table for Document Requests is not yet available. Please make sure to run 'npx prisma db push' to sync your database schema.
                </div>
            )}

            {!dbError && requests.length === 0 && (
                <div className="text-center p-12 bg-[#0D0D0D] rounded-[2rem] border border-white/5">
                    <p className="text-white/40 font-bold uppercase tracking-widest text-sm">No Document Requests Found</p>
                </div>
            )}

            {!dbError && requests.length > 0 && (
                <div className="bg-[#0D0D0D] rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-xs font-black text-white/30 uppercase tracking-widest bg-white/5">
                                    <th className="p-5 font-medium">Student</th>
                                    <th className="p-5 font-medium">Type</th>
                                    <th className="p-5 font-medium">Details / Reason</th>
                                    <th className="p-5 font-medium">Date</th>
                                    <th className="p-5 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gold/20 border border-gold/40 flex items-center justify-center text-xs font-bold text-gold">
                                                    {(req.user.name?.[0] || req.user.email?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{req.user.name}</p>
                                                    <p className="text-xs text-white/40">{req.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-full border border-gold/20">
                                                {req.type}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-white/70 max-w-xs truncate" title={req.reason}>
                                                {req.reason}
                                            </p>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-white/50 whitespace-nowrap">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="p-5 text-right">
                                            <Link 
                                                href={`/admin/certificates?email=${encodeURIComponent(req.user.email)}&reason=${encodeURIComponent(req.reason)}`}
                                                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-gold/20 hover:text-gold text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                                            >
                                                <span>Issue</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
