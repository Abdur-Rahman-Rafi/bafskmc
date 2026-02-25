"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus, Loader2, CheckCircle, XCircle, Clock, Send } from "lucide-react";

interface Payment {
    id: string;
    amount: number;
    note: string;
    method: string;
    transactionId: string | null;
    status: "PENDING" | "VERIFIED" | "REJECTED";
    createdAt: string;
}

export default function StudentPaymentPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ amount: "", note: "", method: "bKash", transactionId: "" });
    const [toast, setToast] = useState("");

    useEffect(() => { fetchPayments(); }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/payments");
            const data = await res.json();
            setPayments(Array.isArray(data) ? data : []);
        } catch { } finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.amount || !form.note) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setToast("Payment submitted successfully!");
                setShowForm(false);
                setForm({ amount: "", note: "", method: "bKash", transactionId: "" });
                fetchPayments();
                setTimeout(() => setToast(""), 3000);
            }
        } catch { } finally { setSubmitting(false); }
    };

    const statusConfig = {
        PENDING: { icon: <Clock className="h-4 w-4" />, color: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Pending" },
        VERIFIED: { icon: <CheckCircle className="h-4 w-4" />, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Verified" },
        REJECTED: { icon: <XCircle className="h-4 w-4" />, color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Rejected" },
    };

    return (
        <div className="space-y-10 pb-20 max-w-3xl">
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-8 right-8 z-50 px-6 py-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl font-bold text-sm shadow-2xl flex items-center space-x-3"
                >
                    <CheckCircle className="h-5 w-5" /><span>{toast}</span>
                </motion.div>
            )}

            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        MY <span className="text-gold">PAYMENTS</span>
                    </h1>
                    <p className="text-white/30 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Payment History • Submit New Payment
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center space-x-3 px-6 py-4 bg-gold text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F0C040] transition-all active:scale-95 shadow-xl shadow-gold/20 group"
                >
                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                    <span>Submit Payment</span>
                </button>
            </div>

            {/* Payment Notice */}
            <div className="bg-gold/5 border border-gold/20 rounded-[2rem] p-8">
                <div className="flex items-center space-x-3 mb-3">
                    <CreditCard className="h-5 w-5 text-gold" />
                    <h3 className="text-gold font-black text-xs uppercase tracking-widest">bKash Payment Info</h3>
                </div>
                <p className="text-white/60 text-sm font-bold leading-relaxed">
                    Send payment to our official bKash number:{" "}
                    <span className="text-gold font-black text-base">+8801871634084</span>
                    <br />
                    <span className="text-white/30 text-xs">Then submit the form below with your Transaction ID and the reason for payment.</span>
                </p>
            </div>

            {/* Submit Payment Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#151515] rounded-[2.5rem] border border-gold/20 p-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] pointer-events-none" />
                    <h2 className="text-white font-black text-lg uppercase tracking-widest mb-8 italic">Submit Payment Record</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Amount (BDT) *</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={form.amount}
                                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                    placeholder="e.g. 500"
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Method</label>
                                <select
                                    value={form.method}
                                    onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold text-sm"
                                >
                                    <option value="bKash">bKash</option>
                                    <option value="Nagad">Nagad</option>
                                    <option value="Rocket">Rocket</option>
                                    <option value="Bank">Bank Transfer</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Transaction ID</label>
                            <input
                                value={form.transactionId}
                                onChange={e => setForm(f => ({ ...f, transactionId: e.target.value }))}
                                placeholder="Your bKash/Nagad Transaction ID"
                                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Note / Reason *</label>
                            <textarea
                                required
                                value={form.note}
                                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                                rows={3}
                                placeholder="Explain what this payment is for (e.g. Annual membership fee, exam entry fee, etc.)"
                                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-gold/50 transition-all font-bold placeholder:text-white/15 text-sm resize-none"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-5 bg-gold text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F0C040] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                <span>{submitting ? "Submitting..." : "Submit Payment"}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-8 py-5 bg-white/5 text-white/30 border border-white/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white/60 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Payment History */}
            <div>
                <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">Payment History</h2>
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 text-gold animate-spin" />
                    </div>
                ) : payments.length === 0 ? (
                    <div className="bg-[#151515] rounded-[2.5rem] border border-dashed border-white/5 p-20 text-center">
                        <CreditCard className="h-12 w-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 font-black uppercase tracking-widest text-xs">No payment records yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {payments.map((p, idx) => {
                            const cfg = statusConfig[p.status];
                            return (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-[#151515] rounded-[2rem] border border-white/5 p-8 flex items-center justify-between hover:border-white/10 transition-all"
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                            <CreditCard className="h-6 w-6 text-gold/60" />
                                        </div>
                                        <div>
                                            <p className="text-white font-black tracking-tight">{p.note}</p>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{p.method}</span>
                                                {p.transactionId && (
                                                    <span className="text-[10px] font-bold text-gold/40">#{p.transactionId}</span>
                                                )}
                                                <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-xl font-black text-white">৳{p.amount.toLocaleString()}</span>
                                        <span className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
                                            {cfg.icon}
                                            <span>{cfg.label}</span>
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
