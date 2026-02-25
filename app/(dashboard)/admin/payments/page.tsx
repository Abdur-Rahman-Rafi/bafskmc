"use client";

import { useEffect, useState } from "react";
import { Check, X, ShieldCheck, Loader2, Smartphone, CreditCard, Calendar, Activity, FileText, User, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentRecord {
    id: string;
    amount: number;
    note: string;
    method: string;
    transactionId: string | null;
    status: "PENDING" | "VERIFIED" | "REJECTED";
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        class: string;
        roll: string;
    };
}

type FilterType = "all" | "PENDING" | "VERIFIED" | "REJECTED";

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>("PENDING");
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/payments");
            const data = await res.json();
            setPayments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (paymentId: string, status: "VERIFIED" | "REJECTED") => {
        setProcessingId(paymentId);
        setSuccessMsg(null);
        try {
            const res = await fetch(`/api/payments/${paymentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status } : p));
                setSuccessMsg(`Payment profile ${status.toLowerCase()} successfully.`);
                setTimeout(() => setSuccessMsg(null), 3000);
            }
        } catch (error) {
            console.error("Verification failed");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredPayments = filter === "all" ? payments : payments.filter(p => p.status === filter);
    const counts = {
        all: payments.length,
        PENDING: payments.filter(p => p.status === "PENDING").length,
        VERIFIED: payments.filter(p => p.status === "VERIFIED").length,
        REJECTED: payments.filter(p => p.status === "REJECTED").length,
    };

    const filterTabs: { key: FilterType; label: string; color: string }[] = [
        { key: "PENDING", label: "Pending", color: "text-amber-400" },
        { key: "VERIFIED", label: "Verified", color: "text-emerald-400" },
        { key: "REJECTED", label: "Rejected", color: "text-red-400" },
        { key: "all", label: "All", color: "text-white/40" },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        PAYMENT <span className="text-gold">AUDIT</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Financial Verification • Student Payment Records
                    </p>
                </div>
                <div className="flex items-center space-x-3 px-6 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <Activity className="h-4 w-4 text-amber-500 animate-pulse" />
                    <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">
                        {counts.PENDING} Awaiting Verification
                    </span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 bg-[#151515] p-2 rounded-2xl border border-white/5">
                {filterTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab.key
                            ? "bg-gold text-black shadow-lg"
                            : `${tab.color} hover:bg-white/5`
                            }`}
                    >
                        {tab.label} ({counts[tab.key]})
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-emerald-400 text-xs font-black uppercase tracking-widest shadow-2xl"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span>{successMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="h-12 w-12 text-gold animate-spin" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Synchronizing Ledger...</p>
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="py-24 text-center bg-[#151515] rounded-[3rem] border border-dashed border-white/5">
                    <div className="bg-white/5 h-20 w-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="h-10 w-10 text-white/10" />
                    </div>
                    <h3 className="text-xl font-black text-white/40 uppercase italic">
                        {filter === "PENDING" ? "Queue Clear" : "No Records"}
                    </h3>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2 max-w-sm mx-auto">
                        {filter === "PENDING" ? "All payment submissions have been processed." : `No ${filter.toLowerCase()} records found.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredPayments.map((payment, idx) => (
                        <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-[#151515] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden group hover:border-gold/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />

                            {/* Student Info */}
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <User className="h-3.5 w-3.5 text-gold/50" />
                                        <h3 className="text-xl font-black text-white italic tracking-tighter group-hover:text-gold transition-colors">{payment.user.name}</h3>
                                    </div>
                                    <p className="text-white/20 font-bold text-[10px] uppercase tracking-widest">{payment.user.email}</p>
                                    {(payment.user.class || payment.user.roll) && (
                                        <p className="text-white/10 font-bold text-[9px] uppercase tracking-widest mt-0.5">
                                            Class: {payment.user.class} • Roll: {payment.user.roll}
                                        </p>
                                    )}
                                </div>
                                <div className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] ${payment.status === "PENDING" ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                    : payment.status === "VERIFIED" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                    }`}>
                                    {payment.status}
                                </div>
                            </div>

                            {/* Payment Note */}
                            <div className="bg-[#0D0D0D] rounded-2xl p-6 mb-6 border border-white/5">
                                <div className="flex items-center space-x-2 mb-3">
                                    <FileText className="h-3 w-3 text-gold/40" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Payment Reason</span>
                                </div>
                                <p className="text-white/70 text-sm font-bold leading-relaxed">{payment.note}</p>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-[#0D0D0D] rounded-2xl p-6 mb-8 border border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <CreditCard className="h-3 w-3 text-gold/40" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">{payment.method}</span>
                                        {payment.user.phone && (
                                            <span className="flex items-center space-x-1 text-white/10 text-[9px] font-bold">
                                                <Smartphone className="h-3 w-3" />
                                                <span>{payment.user.phone}</span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-1 text-white/20">
                                        <Calendar className="h-3 w-3" />
                                        <span className="text-[9px] font-black">{new Date(payment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-black text-gold tracking-tighter">৳{payment.amount.toLocaleString()}</div>
                                    {payment.transactionId && (
                                        <span className="text-[10px] font-black text-white/30 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                            TXN: {payment.transactionId}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {payment.status === "PENDING" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleVerify(payment.id, "VERIFIED")}
                                        disabled={processingId === payment.id}
                                        className="flex items-center justify-center space-x-3 py-5 bg-emerald-500 text-black hover:bg-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-emerald-500/10"
                                    >
                                        {processingId === payment.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                        <span>Verify</span>
                                    </button>
                                    <button
                                        onClick={() => handleVerify(payment.id, "REJECTED")}
                                        disabled={processingId === payment.id}
                                        className="flex items-center justify-center space-x-3 py-5 bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <X className="h-5 w-5" />
                                        <span>Reject</span>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
