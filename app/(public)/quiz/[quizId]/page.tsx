"use client";

import { useEffect, useState, use } from "react";
import { getQuizDetails, submitQuizAnswers, cancelQuizDueToCheating } from "../actions";
import { Loader2, AlertTriangle, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuizExecutionPage({ params }: { params: Promise<{ quizId: string }> }) {
    const { quizId } = use(params);
    const router = useRouter();
    
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // Status
    const [step, setStep] = useState<"REGISTRATION" | "ACTIVE" | "SUBMITTED" | "CANCELLED">("REGISTRATION");
    const [cancelReason, setCancelReason] = useState("");
    
    // Guest Details
    const [name, setName] = useState("");
    const [roll, setRoll] = useState("");
    const [section, setSection] = useState("");
    const [shift, setShift] = useState("Morning");
    const [group, setGroup] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");

    // Quiz Execution
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [answerText, setAnswerText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getQuizDetails(quizId).then(q => {
            if (!q) {
                router.push("/quiz");
                return;
            }
            setQuiz(q);
            setLoading(false);
        });
    }, [quizId, router]);

    // Timer & Anti-Cheat Logic
    useEffect(() => {
        if (!quiz || step !== "ACTIVE") return;

        const end = new Date(quiz.endTime).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const dist = end - now;
            if (dist <= 0) {
                clearInterval(timer);
                setTimeLeft("00:00:00");
                handleTimeUp();
            } else {
                const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((dist % (1000 * 60)) / 1000);
                setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            }
        }, 1000);

        // --- Anti Cheat ---
        const handleVisibilityChange = () => {
            if (document.hidden && step === "ACTIVE") {
                triggerCheatCancel("Switched tabs or minimized window");
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "PrintScreen" || e.code === "PrintScreen") {
                triggerCheatCancel("Attempted to take a screenshot (PrintScreen key detected)");
            }
        };
        
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("contextmenu", handleContextMenu);

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [quiz, step]);

    const getGuestData = () => ({ name, roll, section, shift, group, mobile, address });

    const handleStartExam = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("ACTIVE");
    };

    const handleTimeUp = async () => {
        if (step !== "ACTIVE") return;
        setSubmitting(true);
        try {
            await submitQuizAnswers(quizId, { text: answerText }, getGuestData());
            setStep("SUBMITTED");
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const triggerCheatCancel = async (reason: string) => {
        setStep("CANCELLED");
        setCancelReason(reason);
        try {
            await cancelQuizDueToCheating(quizId, reason, getGuestData());
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step !== "ACTIVE" || !confirm("Are you sure you want to submit? You cannot undo this.")) return;
        setSubmitting(true);
        try {
            await submitQuizAnswers(quizId, { text: answerText }, getGuestData());
            setStep("SUBMITTED");
        } catch (e) {
            alert("Error submitting or already submitted.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-gold" /></div>;
    }

    if (step === "CANCELLED") {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center max-w-2xl mx-auto space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-4">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-4xl font-black text-red-500 uppercase tracking-tighter">Exam Cancelled</h1>
                <p className="text-white/60 font-bold text-lg">Your exam has been automatically cancelled due to a policy violation.</p>
                <div className="bg-[#151515] border border-white/5 p-6 rounded-2xl w-full text-left">
                    <span className="text-xs font-black text-white/30 uppercase tracking-widest mb-1 block">Violation Detected</span>
                    <p className="text-white font-bold">{cancelReason}</p>
                </div>
                <button onClick={() => router.push("/quiz")} className="px-8 py-4 bg-white/5 text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest text-xs transition-all mt-4">
                    Return to Portal
                </button>
            </div>
        );
    }

    if (step === "SUBMITTED") {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center max-w-2xl mx-auto space-y-6">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-4">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h1 className="text-4xl font-black text-emerald-400 uppercase tracking-tighter">Submission Successful</h1>
                <p className="text-white/60 font-bold text-lg">Your answers have been securely submitted.</p>
                <button onClick={() => router.push("/quiz")} className="px-8 py-4 bg-white/5 text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest text-xs transition-all mt-4">
                    Return to Portal
                </button>
            </div>
        );
    }

    if (step === "REGISTRATION") {
        const isClass910 = quiz.category === "CLASS_9" || quiz.category === "CLASS_10";
        return (
            <div className="max-w-xl mx-auto py-12 px-4">
                <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl pointer-events-none" />
                    
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Student Details</h1>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-8">Please fill in your correct information to proceed to {quiz.name}</p>

                    <form onSubmit={handleStartExam} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Full Name *</label>
                            <input required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Roll *</label>
                                <input required value={roll} onChange={e=>setRoll(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Section *</label>
                                <input required value={section} onChange={e=>setSection(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Shift *</label>
                                <select required value={shift} onChange={e=>setShift(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold">
                                    <option value="Morning">Morning</option>
                                    <option value="Day">Day</option>
                                </select>
                            </div>
                            {isClass910 && (
                                <div>
                                    <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Group *</label>
                                    <select required value={group} onChange={e=>setGroup(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold">
                                        <option value="">Select</option>
                                        <option value="Science">Science</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Mobile Number *</label>
                            <input required type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Address *</label>
                            <textarea required value={address} onChange={e=>setAddress(e.target.value)} rows={2} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold resize-none" />
                        </div>

                        <div className="pt-4 mt-6 border-t border-white/5">
                            <button type="submit" className="w-full py-4 bg-gold hover:bg-[#F0C040] text-black rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center transition-all">
                                <span>Start Exam Now</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    // step === "ACTIVE"
    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20 select-none" onCopy={e => e.preventDefault()} onCut={e => e.preventDefault()} onPaste={e => e.preventDefault()}>
            {/* Header & Timer */}
            <div className="bg-[#151515] p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center sticky top-20 z-40 shadow-2xl backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-black text-white">{quiz.name}</h1>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Candidate: {name} ({roll})</p>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <Clock className="w-5 h-5 text-red-400 mr-3 animate-pulse" />
                        <span className="text-2xl font-mono font-black text-red-400 tracking-wider">{timeLeft}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Question Section */}
                <div className="bg-[#151515] p-5 sm:p-6 rounded-3xl border border-white/5 flex flex-col min-h-[50vh] lg:h-[75vh] overflow-y-auto shadow-2xl">
                    <h2 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-4">Question Paper</h2>
                    {quiz.questionFileUrl ? (
                        quiz.questionFileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                            <img src={quiz.questionFileUrl} alt="Question Paper" className="w-full rounded-2xl pointer-events-none object-contain" />
                        ) : (
                            <iframe src={quiz.questionFileUrl} className="w-full h-full min-h-[350px] rounded-2xl bg-white/5 border-none" />
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-white/30">
                            <AlertTriangle className="w-12 h-12 mb-4 opacity-50 text-amber-400" />
                            <p className="font-bold text-sm">No question file attached to this quiz.</p>
                        </div>
                    )}
                </div>

                {/* Answer Section */}
                <div className="bg-[#151515] p-5 sm:p-6 rounded-3xl border border-white/5 flex flex-col min-h-[45vh] lg:h-[75vh] shadow-2xl">
                    <h2 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-4">Your Answer Sheet</h2>
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                        <textarea
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            placeholder="Type your answers here... Please format them clearly (e.g. 1. Answer, 2. Answer)."
                            className="flex-1 min-h-[220px] w-full bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-white outline-none focus:border-gold transition-all resize-none font-medium text-sm leading-relaxed"
                            required
                        />
                        <button disabled={submitting} type="submit" className="mt-4 w-full py-4 sm:py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm flex justify-center items-center transition-all disabled:opacity-50 shadow-lg shadow-gold/20">
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Final Answers"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
