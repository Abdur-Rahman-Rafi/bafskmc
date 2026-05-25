"use client";

import { useEffect, useState, use } from "react";
import { getQuizSubmissions } from "../../actions";
import { Loader2, AlertTriangle, CheckCircle, ChevronLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { getQuizDetails } from "@/app/(public)/quiz/actions";

export default function AdminQuizSubmissionsPage({ params }: { params: Promise<{ quizId: string }> }) {
    const { quizId } = use(params);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [quizName, setQuizName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [quiz, subs] = await Promise.all([
                    getQuizDetails(quizId),
                    getQuizSubmissions(quizId)
                ]);
                if (quiz) setQuizName(quiz.name);
                setSubmissions(subs);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [quizId]);

    if (loading) {
        return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-gold" /></div>;
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/quizzes" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
                    <ChevronLeft className="w-5 h-5 text-white" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{quizName}</h1>
                    <p className="text-xs font-bold text-gold tracking-widest uppercase">Submissions Viewer</p>
                </div>
            </div>

            <div className="bg-[#151515] rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                                <th className="p-4">Candidate</th>
                                <th className="p-4">Academic Details</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Status & Answers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/30 text-sm font-bold">No submissions yet.</td>
                                </tr>
                            ) : submissions.map((sub) => {
                                const guestData = sub.guestData as any || {};
                                const isCheating = sub.status === "CANCELLED_DUE_TO_CHEATING";
                                const submittedAt = new Date(sub.submittedAt).toLocaleString();

                                return (
                                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 align-top">
                                            <div className="font-bold text-white text-sm">{guestData.name || "Unknown"}</div>
                                            <div className="flex items-center text-[10px] font-medium text-white/40 mt-1 uppercase tracking-widest">
                                                <Calendar className="w-3 h-3 mr-1" /> {submittedAt}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="text-xs text-white/70 font-semibold mb-1">Roll: <span className="text-gold">{guestData.roll || "N/A"}</span></div>
                                            <div className="text-xs text-white/70 font-semibold mb-1">Sec: <span className="text-gold">{guestData.section || "N/A"}</span></div>
                                            <div className="text-xs text-white/70 font-semibold mb-1">Shift: <span className="text-gold">{guestData.shift || "N/A"}</span></div>
                                            {guestData.group && <div className="text-xs text-white/70 font-semibold">Group: <span className="text-gold">{guestData.group}</span></div>}
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="text-xs text-white/70 font-medium">{guestData.mobile || "N/A"}</div>
                                        </td>
                                        <td className="p-4 align-top">
                                            {isCheating ? (
                                                <div className="mb-3">
                                                    <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                                                        <AlertTriangle className="w-3 h-3" /> Flagged for Cheating
                                                    </div>
                                                    <p className="text-xs text-red-400 mt-1 font-medium">{sub.feedback}</p>
                                                </div>
                                            ) : (
                                                <div className="mb-3">
                                                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                                                        <CheckCircle className="w-3 h-3" /> Successfully Submitted
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="bg-black/50 border border-white/5 rounded-xl p-3 max-h-32 overflow-y-auto mt-2">
                                                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Answer Script</div>
                                                <div className="text-xs text-white/80 font-mono whitespace-pre-wrap leading-relaxed">
                                                    {(sub.answers as any)?.text || "No answers provided."}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
