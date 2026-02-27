"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    UserPlus, User, Mail, Lock, Phone, GraduationCap,
    ShieldCheck, RotateCcw, ArrowLeft, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Step 1: Registration form ─────────────────────────────────────────────────
function RegisterForm({
    onSuccess,
}: {
    onSuccess: (email: string) => void;
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        studentClass: "",
        section: "",
        roll: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok && data.requiresVerification) {
                onSuccess(data.email);
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="register-form"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="text-center mb-10">
                <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
                    <div className="h-14 w-14 bg-white/5 border border-gold/30 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(201,150,43,0.2)] group-hover:scale-110 transition-transform">
                        <img src="/logo.jpg" alt="BAFSKMC" className="h-full w-full object-cover" />
                    </div>
                    <div className="text-left">
                        <p className="text-white font-black text-lg tracking-tight italic">BAFSKMC</p>
                        <p className="text-gold/60 font-black text-[10px] uppercase tracking-[0.2em]">Math Club Portal</p>
                    </div>
                </Link>
                <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
                    Join The <span className="text-gold">Club</span>
                </h1>
                <p className="text-white/30 font-bold text-sm">Create your student account to access the portal.</p>
            </div>

            {/* Card */}
            <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-500 text-sm font-bold"
                    >
                        <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
                        <p>{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Identity */}
                    <div className="space-y-5">
                        <div className="flex items-center space-x-3 mb-4">
                            <User className="h-4 w-4 text-gold/50" />
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Identity</span>
                            <div className="h-px bg-white/5 flex-1" />
                        </div>
                        {[
                            { name: "name", type: "text", placeholder: "Full Name", Icon: User },
                            { name: "email", type: "email", placeholder: "Email Address", Icon: Mail },
                            { name: "phone", type: "tel", placeholder: "Phone Number", Icon: Phone },
                        ].map(({ name, type, placeholder, Icon }) => (
                            <div key={name} className="relative">
                                <Icon className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    name={name}
                                    type={type}
                                    required
                                    placeholder={placeholder}
                                    value={(formData as any)[name]}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Security */}
                    <div className="space-y-5">
                        <div className="flex items-center space-x-3 mb-4">
                            <Lock className="h-4 w-4 text-gold/50" />
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Security</span>
                            <div className="h-px bg-white/5 flex-1" />
                        </div>
                        {[
                            { name: "password", placeholder: "Create Password" },
                            { name: "confirmPassword", placeholder: "Confirm Password" },
                        ].map(({ name, placeholder }) => (
                            <div key={name} className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    name={name}
                                    type="password"
                                    required
                                    placeholder={placeholder}
                                    value={(formData as any)[name]}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Academic */}
                    <div className="space-y-5">
                        <div className="flex items-center space-x-3 mb-4">
                            <GraduationCap className="h-4 w-4 text-gold/50" />
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Academic Info</span>
                            <div className="h-px bg-white/5 flex-1" />
                            <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Optional</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { name: "studentClass", placeholder: "Class" },
                                { name: "section", placeholder: "Section" },
                                { name: "roll", placeholder: "Roll" },
                            ].map(({ name, placeholder }) => (
                                <input
                                    key={name}
                                    name={name}
                                    placeholder={placeholder}
                                    value={(formData as any)[name]}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm text-center"
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        id="register-submit-btn"
                        className="w-full py-6 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-gold/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center space-x-3 group mt-4"
                    >
                        <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                        <span>{loading ? "Creating Account…" : "Create Account"}</span>
                    </button>
                </form>

                <p className="text-center text-white/30 text-sm font-bold mt-8">
                    Already a member?{" "}
                    <Link href="/login" className="text-gold hover:text-[#F0C040] font-black transition-colors underline-offset-4 underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}

// ── Step 2: OTP verification ──────────────────────────────────────────────────
function VerifyEmailStep({
    email,
    onBack,
}: {
    email: string;
    onBack: () => void;
}) {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    // Countdown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleDigitChange = (idx: number, val: string) => {
        // Support pasting full code
        if (val.length === 6 && /^\d+$/.test(val)) {
            const digits = val.split("");
            setCode(digits);
            inputRefs.current[5]?.focus();
            return;
        }
        if (!/^\d?$/.test(val)) return;
        const next = [...code];
        next[idx] = val;
        setCode(next);
        if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    };

    const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join("");
        if (fullCode.length !== 6) {
            setError("Please enter all 6 digits.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: fullCode }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push("/login?verified=true"), 2000);
            } else {
                setError(data.error || "Verification failed");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendCooldown(60);
        setError("");
        try {
            const res = await fetch("/api/auth/verify-email/resend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) setError(data.error || "Failed to resend");
        } catch {
            setError("Failed to resend code.");
        }
    };

    if (success) {
        return (
            <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-16 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.3)" }}
                >
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-3">Email Verified!</h2>
                <p className="text-white/40 font-medium">Redirecting you to login…</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            key="verify-form"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center space-x-3 mb-8">
                    <div className="h-14 w-14 bg-white/5 border border-gold/30 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(201,150,43,0.2)]">
                        <img src="/logo.jpg" alt="BAFSKMC" className="h-full w-full object-cover" />
                    </div>
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(201,150,43,0.1)", border: "1px solid rgba(201,150,43,0.25)" }}>
                    <ShieldCheck className="h-8 w-8" style={{ color: "#F0C040" }} />
                </div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
                    Verify <span className="text-gold">Email</span>
                </h1>
                <p className="text-white/30 font-bold text-sm max-w-xs mx-auto">
                    We sent a 6-digit code to{" "}
                    <span className="text-white/60 font-black">{email}</span>
                </p>
            </div>

            {/* Card */}
            <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-500 text-sm font-bold"
                    >
                        <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
                        <p>{error}</p>
                    </motion.div>
                )}

                {/* OTP Inputs */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    {code.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => { inputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={digit}
                            onChange={(e) => handleDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            onFocus={(e) => e.target.select()}
                            id={`otp-digit-${idx}`}
                            className="w-12 h-16 text-center text-2xl font-black text-white rounded-2xl outline-none transition-all"
                            style={{
                                background: digit ? "rgba(201,150,43,0.1)" : "rgba(255,255,255,0.03)",
                                border: digit ? "2px solid rgba(201,150,43,0.5)" : "2px solid rgba(255,255,255,0.08)",
                                caretColor: "#F0C040",
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading || code.join("").length !== 6}
                    id="verify-submit-btn"
                    className="w-full py-6 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-gold/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center space-x-3 mb-6"
                >
                    <ShieldCheck className="h-5 w-5" />
                    <span>{loading ? "Verifying…" : "Verify My Email"}</span>
                </button>

                <div className="flex items-center justify-between text-sm font-bold">
                    <button
                        onClick={onBack}
                        className="flex items-center space-x-2 text-white/30 hover:text-white/60 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </button>

                    <button
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
                        className="flex items-center space-x-2 text-gold/60 hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <RotateCcw className="h-4 w-4" />
                        <span>
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                        </span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ── Root page ─────────────────────────────────────────────────────────────────
export default function RegisterPage() {
    const [step, setStep] = useState<"register" | "verify">("register");
    const [pendingEmail, setPendingEmail] = useState("");

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center py-16 px-4 font-sans">
            {/* Radial glow */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,150,43,0.06) 0%, transparent 70%)" }}
            />

            <div className="relative w-full max-w-xl">
                <AnimatePresence mode="wait">
                    {step === "register" ? (
                        <RegisterForm
                            key="register"
                            onSuccess={(email) => {
                                setPendingEmail(email);
                                setStep("verify");
                            }}
                        />
                    ) : (
                        <VerifyEmailStep
                            key="verify"
                            email={pendingEmail}
                            onBack={() => setStep("register")}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
