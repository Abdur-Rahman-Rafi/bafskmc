"use client";

import { useEffect, useState } from "react";
import {
    Plus, Calendar, Clock, Loader2, Trash2, Edit, ClipboardList,
    Target, Users, Megaphone, CheckCircle, Save, ChevronDown, ChevronUp,
    FileText, User, Award, Star, X, Check, ExternalLink, Download, LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Tab = "exams" | "announcements" | "submissions";

interface Submission {
    id: string;
    score: number | null;
    feedback: string | null;
    submittedAt: string;
    answers: any;
    submissionFileUrl: string | null;
    student: {
        id: string;
        name: string;
        email: string;
        class: string;
        roll: string;
        image: string | null;
    };
}

export default function AdminExamsPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("exams");
    const [selectedExam, setSelectedExam] = useState<any>(null);

    // Announcement state
    const [announcement, setAnnouncement] = useState("");
    const [savingAnnouncement, setSavingAnnouncement] = useState(false);
    const [announcementSaved, setAnnouncementSaved] = useState(false);

    // Submissions state
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [gradingId, setGradingId] = useState<string | null>(null);
    const [grades, setGrades] = useState<Record<string, { score: string; feedback: string }>>({});
    const [expandedSub, setExpandedSub] = useState<string | null>(null);
    const [gradeSuccessId, setGradeSuccessId] = useState<string | null>(null);

    useEffect(() => { fetchExams(); }, []);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/exams");
            const data = await res.json();
            setExams(Array.isArray(data) ? data : []);
        } catch { } finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this exam and all its data?")) return;
        await fetch(`/api/exams/${id}`, { method: "DELETE" });
        fetchExams();
        if (selectedExam?.id === id) setSelectedExam(null);
    };

    const selectExam = (exam: any, tab: Tab) => {
        setSelectedExam(exam);
        setActiveTab(tab);
        setAnnouncement(exam.announcement || "");
        setAnnouncementSaved(false);
        if (tab === "submissions") fetchSubmissions(exam.id);
    };

    const fetchSubmissions = async (examId: string) => {
        setLoadingSubmissions(true);
        try {
            const res = await fetch(`/api/exams/${examId}/submissions`);
            const data = await res.json();
            setSubmissions(Array.isArray(data) ? data : []);
            // pre-fill existing scores
            const g: Record<string, { score: string; feedback: string }> = {};
            (Array.isArray(data) ? data : []).forEach((s: Submission) => {
                g[s.id] = { score: s.score?.toString() || "", feedback: s.feedback || "" };
            });
            setGrades(g);
        } catch { } finally { setLoadingSubmissions(false); }
    };

    const saveAnnouncement = async () => {
        if (!selectedExam) return;
        setSavingAnnouncement(true);
        try {
            const res = await fetch(`/api/exams/${selectedExam.id}/announcement`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ announcement }),
            });
            if (res.ok) {
                setAnnouncementSaved(true);
                setExams(prev => prev.map(e => e.id === selectedExam.id ? { ...e, announcement } : e));
                setTimeout(() => setAnnouncementSaved(false), 3000);
            }
        } catch { } finally { setSavingAnnouncement(false); }
    };

    const gradeSubmission = async (submissionId: string) => {
        const g = grades[submissionId];
        if (!g || !g.score) return;
        setGradingId(submissionId);
        setGradeSuccessId(null);
        try {
            const res = await fetch(`/api/exams/${selectedExam.id}/submissions`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ submissionId, score: parseFloat(g.score), feedback: g.feedback }),
            });
            if (res.ok) {
                setSubmissions(prev => prev.map(s =>
                    s.id === submissionId ? { ...s, score: parseFloat(g.score), feedback: g.feedback } : s
                ));
                setGradeSuccessId(submissionId);
                setTimeout(() => setGradeSuccessId(null), 3000);
            }
        } catch { } finally { setGradingId(null); }
    };

    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: "exams", label: "Manage Exams", icon: <ClipboardList className="h-4 w-4" /> },
        { key: "announcements", label: "Announcements", icon: <Megaphone className="h-4 w-4" /> },
        { key: "submissions", label: "Submissions & Grading", icon: <Award className="h-4 w-4" /> },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        EXAM <span className="text-gold">CONTROL</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Assessment Management • Grading • Announcements
                    </p>
                </div>
                <Link
                    href="/admin/exams/new"
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black shadow-2xl shadow-gold/20 transition-all active:scale-95 group text-xs uppercase tracking-widest"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span>New Exam</span>
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-[#151515] p-2 rounded-2xl border border-white/5">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setActiveTab(tab.key);
                            if (tab.key === "submissions" && selectedExam) fetchSubmissions(selectedExam.id);
                        }}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.key
                            ? "bg-gold text-black shadow-lg"
                            : "text-white/30 hover:text-white/60 hover:bg-white/5"
                            }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Tab: Manage Exams ── */}
            {activeTab === "exams" && (
                <AnimatePresence mode="wait">
                    <motion.div key="exams" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {loading ? (
                            <div className="flex justify-center py-32"><Loader2 className="h-10 w-10 text-gold animate-spin" /></div>
                        ) : exams.length === 0 ? (
                            <div className="py-24 text-center bg-[#151515] rounded-[3rem] border border-dashed border-white/5">
                                <div className="bg-white/5 h-20 w-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                                    <ClipboardList className="h-8 w-8 text-white/20" />
                                </div>
                                <h3 className="text-xl font-black text-white/40 uppercase italic">No Exams Yet</h3>
                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2">Create a new exam session to get started.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {exams.map((exam, idx) => (
                                    <motion.div
                                        key={exam.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.06 }}
                                        className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-8 hover:border-gold/25 transition-all group relative overflow-hidden shadow-2xl"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />

                                        {/* Exam header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-14 w-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center border border-gold/20 group-hover:bg-gold group-hover:text-black transition-all">
                                                    <Target className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-white tracking-tighter italic group-hover:text-gold transition-colors">{exam.name}</h4>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="px-2 py-0.5 bg-white/5 rounded-lg text-[9px] font-black text-white/30 uppercase tracking-widest border border-white/5">{exam.duration} MINS</span>
                                                        {exam.questionFileUrl && (
                                                            <a href={exam.questionFileUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-blue-500/10 rounded-lg text-[9px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/10 flex items-center">
                                                                <FileText className="h-2 w-2 mr-1" /> QP Uploaded
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Link href={`/admin/exams/edit?id=${exam.id}`} className="p-2.5 bg-white/5 text-white/30 hover:text-gold hover:border-gold/30 rounded-xl border border-white/5 transition-all">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(exam.id)} className="p-2.5 bg-white/5 text-white/30 hover:text-red-400 hover:border-red-500/30 rounded-xl border border-white/5 transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="bg-[#0D0D0D] p-4 rounded-2xl border border-white/5">
                                                <div className="flex items-center space-x-1.5 text-white/20 text-[9px] font-black uppercase tracking-widest mb-1.5">
                                                    <Calendar className="h-3 w-3" /><span>Start</span>
                                                </div>
                                                <p className="text-xs font-bold text-white/50">{new Date(exam.startTime).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-[#0D0D0D] p-4 rounded-2xl border border-white/5">
                                                <div className="flex items-center space-x-1.5 text-white/20 text-[9px] font-black uppercase tracking-widest mb-1.5">
                                                    <Clock className="h-3 w-3" /><span>End</span>
                                                </div>
                                                <p className="text-xs font-bold text-white/50">{new Date(exam.endTime).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                            <button
                                                onClick={() => selectExam(exam, "announcements")}
                                                className="flex items-center justify-center space-x-2 py-3 bg-white/5 hover:bg-gold/10 text-white/30 hover:text-gold rounded-xl border border-white/5 hover:border-gold/20 transition-all text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <Megaphone className="h-3.5 w-3.5" />
                                                <span>Announce</span>
                                            </button>
                                            <button
                                                onClick={() => selectExam(exam, "submissions")}
                                                className="flex items-center justify-center space-x-2 py-3 bg-white/5 hover:bg-gold/10 text-white/30 hover:text-gold rounded-xl border border-white/5 hover:border-gold/20 transition-all text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <Award className="h-3.5 w-3.5" />
                                                <span>Grade</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* ── Tab: Announcements ── */}
            {activeTab === "announcements" && (
                <AnimatePresence mode="wait">
                    <motion.div key="announcements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        {/* Exam Selector */}
                        <div>
                            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Select Exam</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {exams.map(exam => (
                                    <button
                                        key={exam.id}
                                        onClick={() => { setSelectedExam(exam); setAnnouncement(exam.announcement || ""); setAnnouncementSaved(false); }}
                                        className={`p-4 rounded-2xl border text-left transition-all ${selectedExam?.id === exam.id
                                            ? "bg-gold/10 border-gold/30 text-gold"
                                            : "bg-[#151515] border-white/5 text-white/40 hover:border-white/10"
                                            }`}
                                    >
                                        <p className="font-black text-sm truncate">{exam.name}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">{exam.duration} mins</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedExam ? (
                            <div className="bg-[#151515] rounded-[2.5rem] border border-white/5 p-10 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-4">
                                        <Megaphone className="h-6 w-6 text-gold" />
                                        <div>
                                            <h2 className="text-xl font-black text-white italic tracking-tight">{selectedExam.name}</h2>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-0.5">Announcement Board</p>
                                        </div>
                                    </div>
                                    {announcementSaved && (
                                        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>Saved!</span>
                                        </div>
                                    )}
                                </div>

                                <textarea
                                    value={announcement}
                                    onChange={e => setAnnouncement(e.target.value)}
                                    rows={8}
                                    placeholder="Write an announcement for this exam... (e.g. syllabus changes, venue info, important notes for participants)"
                                    className="w-full px-8 py-6 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/10 text-sm resize-none leading-relaxed"
                                />
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2">
                                    This announcement is visible to all registered students in the student portal.
                                </p>

                                <button
                                    onClick={saveAnnouncement}
                                    disabled={savingAnnouncement}
                                    className="mt-6 flex items-center space-x-3 px-8 py-4 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-gold/20"
                                >
                                    {savingAnnouncement ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    <span>{savingAnnouncement ? "Publishing..." : "Publish Announcement"}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-[#151515] rounded-[2.5rem] border border-dashed border-white/5">
                                <Megaphone className="h-12 w-12 text-white/5 mx-auto mb-4" />
                                <p className="text-white/20 font-black uppercase tracking-widest text-xs">Select an exam above to write an announcement</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* ── Tab: Submissions & Grading ── */}
            {activeTab === "submissions" && (
                <AnimatePresence mode="wait">
                    <motion.div key="submissions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        {/* Exam Selector */}
                        <div>
                            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Select Exam to Grade</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {exams.map(exam => (
                                    <button
                                        key={exam.id}
                                        onClick={() => { setSelectedExam(exam); fetchSubmissions(exam.id); }}
                                        className={`p-4 rounded-2xl border text-left transition-all ${selectedExam?.id === exam.id
                                            ? "bg-gold/10 border-gold/30 text-gold"
                                            : "bg-[#151515] border-white/5 text-white/40 hover:border-white/10"
                                            }`}
                                    >
                                        <p className="font-black text-sm truncate">{exam.name}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">{exam.duration} mins</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedExam && (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-black text-white italic tracking-tight">
                                        Submissions — <span className="text-gold">{selectedExam.name}</span>
                                    </h2>
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                        {submissions.length} submissions
                                    </span>
                                </div>

                                {loadingSubmissions ? (
                                    <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-gold animate-spin" /></div>
                                ) : submissions.length === 0 ? (
                                    <div className="py-20 text-center bg-[#151515] rounded-[2.5rem] border border-dashed border-white/5">
                                        <FileText className="h-12 w-12 text-white/5 mx-auto mb-4" />
                                        <p className="text-white/20 font-black uppercase tracking-widest text-xs">No submissions yet for this exam</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {submissions.map((sub, idx) => {
                                            const g = grades[sub.id] || { score: "", feedback: "" };
                                            const isGraded = sub.score !== null;
                                            const isExpanded = expandedSub === sub.id;
                                            return (
                                                <motion.div
                                                    key={sub.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`bg-[#151515] rounded-[2rem] border transition-all shadow-xl overflow-hidden ${isGraded ? "border-emerald-500/20" : "border-white/5 hover:border-gold/20"}`}
                                                >
                                                    {/* Row summary */}
                                                    <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => setExpandedSub(isExpanded ? null : sub.id)}>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                                                                {sub.student.image ? (
                                                                    <img src={sub.student.image} alt={sub.student.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <div className="h-full w-full bg-gold/10 flex items-center justify-center text-gold font-black text-sm">
                                                                        {sub.student.name?.[0]?.toUpperCase() || "?"}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-white tracking-tight">{sub.student.name}</p>
                                                                <div className="flex items-center space-x-3 mt-0.5">
                                                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{sub.student.email}</span>
                                                                    {(sub.student.class || sub.student.roll) && (
                                                                        <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">
                                                                            Class {sub.student.class} • Roll {sub.student.roll}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest mt-0.5">
                                                                    Submitted: {new Date(sub.submittedAt).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            {isGraded ? (
                                                                <div className="flex items-center space-x-3">
                                                                    <span className="text-2xl font-black text-emerald-400">{sub.score}</span>
                                                                    <span className="text-[9px] font-black text-emerald-400/50 uppercase tracking-widest">pts</span>
                                                                    <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-1.5">
                                                                        <Check className="h-3 w-3 text-emerald-400" />
                                                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Graded</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl uppercase tracking-widest">Pending</span>
                                                            )}
                                                            {isExpanded ? <ChevronUp className="h-4 w-4 text-white/20" /> : <ChevronDown className="h-4 w-4 text-white/20" />}
                                                        </div>
                                                    </div>

                                                    {/* Expanded: script + grading */}
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="border-t border-white/5"
                                                        >
                                                            <div className="p-6 space-y-6">
                                                                {/* Submission Script */}
                                                                <div className="bg-[#0D0D0D] rounded-2xl p-6 border border-white/5">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest">Answer Script Repository</h3>
                                                                        {sub.submissionFileUrl ? (
                                                                            <a
                                                                                href={sub.submissionFileUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest transition-all"
                                                                            >
                                                                                <ExternalLink className="h-3 w-3" />
                                                                                <span>Review Payload</span>
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-[9px] font-black text-red-500/40 uppercase tracking-widest italic">No File Found</span>
                                                                        )}
                                                                    </div>

                                                                    {sub.submissionFileUrl?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                                                                        <div className="relative group/img">
                                                                            <img
                                                                                src={sub.submissionFileUrl}
                                                                                alt="Answer Script Preview"
                                                                                className="w-full h-auto max-h-[500px] object-contain rounded-xl border border-white/5"
                                                                            />
                                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Full Quality Preview Enabled</p>
                                                                            </div>
                                                                        </div>
                                                                    ) : sub.submissionFileUrl ? (
                                                                        <div className="py-12 flex flex-col items-center justify-center bg-white/[0.02] rounded-xl border border-dashed border-white/5">
                                                                            <FileText className="h-10 w-10 text-white/10 mb-3" />
                                                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest text-center">
                                                                                Document Payload (PDF/OTHER)<br />
                                                                                Use 'Review' button to view content
                                                                            </p>
                                                                        </div>
                                                                    ) : null}
                                                                </div>

                                                                {/* Grading form */}
                                                                <div className="bg-[#0D0D0D] rounded-2xl p-6 border border-white/5">
                                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Assign Score & Feedback</p>
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                        <div>
                                                                            <label className="block text-[9px] font-black text-white/15 uppercase tracking-widest mb-1.5">Score (marks)</label>
                                                                            <input
                                                                                type="number"
                                                                                placeholder="0–100"
                                                                                value={g.score}
                                                                                onChange={e => setGrades(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], score: e.target.value } }))}
                                                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-gold/50 transition-all font-black text-lg"
                                                                            />
                                                                        </div>
                                                                        <div className="md:col-span-2">
                                                                            <label className="block text-[9px] font-black text-white/15 uppercase tracking-widest mb-1.5">Feedback (optional)</label>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Well done! / Needs improvement in..."
                                                                                value={g.feedback}
                                                                                onChange={e => setGrades(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], feedback: e.target.value } }))}
                                                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-gold/50 transition-all font-bold text-sm"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => gradeSubmission(sub.id)}
                                                                        disabled={gradingId === sub.id}
                                                                        className="mt-4 flex items-center space-x-2 px-6 py-3 bg-gold text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#F0C040] transition-all active:scale-95 disabled:opacity-40 shadow-lg shadow-gold/10"
                                                                    >
                                                                        {gradingId === sub.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
                                                                        <span>
                                                                            {gradingId === sub.id ? "Saving..." : isGraded ? "Update Grade" : "Commit Score"}
                                                                        </span>
                                                                    </button>
                                                                    {gradeSuccessId === sub.id && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: -10 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest"
                                                                        >
                                                                            <CheckCircle className="h-3.5 w-3.5" />
                                                                            <span>Grade synchronized successfully. Points pushed to Global Leaderboard.</span>
                                                                        </motion.div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
