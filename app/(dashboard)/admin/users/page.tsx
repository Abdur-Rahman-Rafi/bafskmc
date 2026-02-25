"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Users,
    Search,
    Shield,
    UserCircle,
    Loader2,
    Trash2,
    Lock,
    RefreshCw,
    Award,
    ChevronRight,
    Activity,
    ShieldCheck,
    UserX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
    id: string;
    email: string;
    name: string | null;
    role: "ADMIN" | "STUDENT";
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const fetchUsers = () => {
        fetch("/api/users")
            .then((res) => res.json())
            .then((data) => {
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleRole = async (user: User) => {
        const newRole = user.role === "ADMIN" ? "STUDENT" : "ADMIN";
        if (!confirm(`Are you sure? Reassigning permissions for ${user.name || user.email} to ${newRole}.`)) return;

        setUpdatingId(user.id);
        setSuccessMsg(null);
        try {
            const res = await fetch(`/api/users/${user.id}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole })
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
                setSuccessMsg(`Permissions for ${user.name || user.email} updated to ${newRole}.`);
                setTimeout(() => setSuccessMsg(null), 3000);
            }
        } catch (error) {
            console.error("Permission transition failed");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleResetPassword = async (user: User) => {
        const newPassword = prompt(`Enter new password for ${user.name || user.email}:`);
        if (!newPassword || newPassword.length < 6) {
            if (newPassword) alert("Password must be at least 6 characters.");
            return;
        }

        setUpdatingId(user.id);
        try {
            const res = await fetch(`/api/users/${user.id}/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword })
            });

            if (res.ok) {
                alert("Password updated successfully.");
            } else {
                throw new Error("Reset failed");
            }
        } catch (error) {
            alert("Failed to reset password. Security protocol disruption.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        AUTHORITY <span className="text-gold">MATRIX</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Access Control • User Account Management
                    </p>
                </div>
                <div className="flex items-center space-x-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                    <Activity className="h-4 w-4 text-gold animate-pulse" />
                    <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">
                        {users.length} Active Personnel Registered
                    </span>
                </div>
            </div>

            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-gold/10 border border-gold/20 rounded-2xl flex items-center space-x-3 text-gold text-xs font-black uppercase tracking-widest shadow-2xl mb-8"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span>{successMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Matrix Hub */}
            <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden min-h-[600px]">
                {/* Search Bar */}
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="relative max-w-xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10 group-focus-within:text-gold transition-colors" />
                        <input
                            type="text"
                            placeholder="TRANSMIT NAME OR EMAIL TO FILTER ARCHIVES..."
                            className="w-full pl-16 pr-8 py-5 bg-[#0D0D0D] border border-white/5 rounded-[1.5rem] outline-none focus:border-gold/30 transition-all text-xs font-black uppercase tracking-widest text-white placeholder:text-white/5"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="h-12 w-12 text-gold animate-spin" />
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Synchronizing Archives...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="bg-white/5 h-20 w-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                                <UserX className="h-8 w-8 text-white/10" />
                            </div>
                            <h3 className="text-xl font-black text-white/40 uppercase italic">Archive Empty</h3>
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2 max-w-sm mx-auto">
                                No personnel records detected in the system database.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.01]">
                                <tr className="text-white/10 text-[9px] font-black uppercase tracking-[0.25em] border-b border-white/5">
                                    <th className="px-10 py-6">Personnel Profile</th>
                                    <th className="px-10 py-6">Authority Level</th>
                                    <th className="px-10 py-6">Commission Date</th>
                                    <th className="px-10 py-6 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                <AnimatePresence mode="popLayout">
                                    {filteredUsers.map((user, idx) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-white/[0.01] transition-colors"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-5">
                                                    <div className="h-14 w-14 bg-[#0D0D0D] rounded-2xl border border-white/5 flex items-center justify-center group-hover:border-gold/30 transition-all shadow-xl">
                                                        <UserCircle className="h-7 w-7 text-white/10 group-hover:text-gold/40 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-black text-white italic tracking-tight group-hover:text-gold transition-colors">{user.name || "UNIDENTIFIED"}</p>
                                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-3">
                                                    {user.role === "ADMIN" ? (
                                                        <span className="flex items-center space-x-2 px-4 py-1.5 bg-gold text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-gold/10">
                                                            <ShieldCheck className="h-3 w-3" />
                                                            <span>Administrator</span>
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center space-x-2 px-4 py-1.5 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/5">
                                                            <Users className="h-3 w-3" />
                                                            <span>Student Node</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleResetPassword(user)}
                                                        disabled={updatingId === user.id}
                                                        className="p-3 bg-white/5 text-white/20 hover:text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/20 rounded-xl border border-white/5 transition-all"
                                                        title="Force Password Reset"
                                                    >
                                                        <Lock className="h-4 w-4" />
                                                    </button>
                                                    <Link
                                                        href={`/admin/achievements?userId=${user.id}`}
                                                        className="p-3 bg-white/5 text-white/20 hover:text-gold hover:bg-gold/10 hover:border-gold/20 rounded-xl border border-white/5 transition-all"
                                                        title="Award Honor"
                                                    >
                                                        <Award className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleRole(user)}
                                                        disabled={updatingId === user.id}
                                                        className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${user.role === "ADMIN"
                                                            ? "bg-white/5 text-white/20 hover:text-white"
                                                            : "bg-gold text-black hover:bg-[#F0C040 shadow-xl shadow-gold/10"
                                                            }`}
                                                    >
                                                        {updatingId === user.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Shield className="h-3 w-3" />}
                                                        <span>{user.role === "ADMIN" ? "Demote" : "Authorize"}</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
