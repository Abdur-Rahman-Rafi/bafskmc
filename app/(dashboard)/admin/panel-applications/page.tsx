"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Users, CheckCircle, Clock, Link as LinkIcon, Edit, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PanelApplication {
    id: string;
    name: string;
    email: string;
    studentClass: string;
    section: string;
    status: string;
    vivaTime: string | null;
    vivaLink: string | null;
    createdAt: string;
}

export default function PanelApplicationsAdminPage() {
    const [apps, setApps] = useState<PanelApplication[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedApp, setSelectedApp] = useState<PanelApplication | null>(null);

    // Modal state for editing viva
    const [editStatus, setEditStatus] = useState("");
    const [editVivaTime, setEditVivaTime] = useState("");
    const [editVivaLink, setEditVivaLink] = useState("");

    const fetchApps = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/panel-applications");
            if (res.ok) {
                const data = await res.json();
                setApps(data.apps || []);
                setIsOpen(data.isOpen || false);
            }
        } catch (err) {
            console.error("Failed to fetch applications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleOpenApplications = async () => {
        if (!confirm("Are you sure you want to announce and email all students that Panel Applications are open?")) return;
        
        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/panel-applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "OPEN_APPLICATIONS" })
            });
            if (res.ok) {
                alert("Announcement posted and emails successfully sent!");
                fetchApps();
            } else {
                alert("Failed to process the announcement.");
            }
        } catch (err) {
            alert("An error occurred.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseApplications = async () => {
        if (!confirm("Are you sure you want to CLOSE Panel Applications? Students will no longer be able to apply.")) return;
        
        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/panel-applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "CLOSE_APPLICATIONS" })
            });
            if (res.ok) {
                alert("Applications are now officially closed.");
                fetchApps();
            } else {
                alert("Failed to close applications.");
            }
        } catch (err) {
            alert("An error occurred.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenModal = (app: PanelApplication) => {
        setSelectedApp(app);
        setEditStatus(app.status);
        // Format ISO string to datetime-local format: YYYY-MM-DDThh:mm
        const formattedDate = app.vivaTime ? new Date(app.vivaTime).toISOString().slice(0, 16) : "";
        setEditVivaTime(formattedDate);
        setEditVivaLink(app.vivaLink || "");
    };

    const handleUpdateViva = async () => {
        if (!selectedApp) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/panel-applications/${selectedApp.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: editStatus,
                    vivaTime: editVivaTime ? new Date(editVivaTime).toISOString() : null,
                    vivaLink: editVivaLink || null,
                })
            });
            if (res.ok) {
                alert("Applicant updated successfully.");
                setSelectedApp(null);
                fetchApps();
            } else {
                alert("Failed to update applicant.");
            }
        } catch (err) {
            alert("Error updating applicant.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center">
                        Panel <span className="text-gold ml-2 mr-3">Applications</span>
                        {isOpen ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest">Open</span>
                        ) : (
                            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest">Closed</span>
                        )}
                    </h1>
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-1">Review & Schedule Viva</p>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    {!isOpen ? (
                        <button
                            onClick={handleOpenApplications}
                            disabled={actionLoading}
                            className="flex items-center justify-center space-x-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 px-6 py-3 rounded-xl font-bold transition-all text-sm group flex-1 md:flex-none"
                        >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />}
                            Open & Announce
                        </button>
                    ) : (
                        <button
                            onClick={handleCloseApplications}
                            disabled={actionLoading}
                            className="flex items-center justify-center space-x-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-6 py-3 rounded-xl font-bold transition-all text-sm group flex-1 md:flex-none"
                        >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />}
                            Close Recruitment
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center space-x-3 text-white">
                        <Users className="h-5 w-5 text-gold" />
                        <h2 className="font-bold text-lg">Applicants ({apps.length})</h2>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="h-10 w-10 text-gold animate-spin" />
                    </div>
                ) : apps.length === 0 ? (
                    <div className="p-20 text-center text-white/30">
                        No applications found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30">
                                    <th className="p-6">Applicant</th>
                                    <th className="p-6">Class/Sec</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Viva Time</th>
                                    <th className="p-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map(app => (
                                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6">
                                            <p className="font-bold text-white text-sm">{app.name}</p>
                                            <p className="text-xs text-white/40">{app.email}</p>
                                        </td>
                                        <td className="p-6 text-sm text-white/60">
                                            {app.studentClass} - {app.section}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                                app.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                app.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                app.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                app.status === 'VIVA_SCHEDULED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-gold/10 text-gold border-gold/20'
                                            }`}>
                                                {app.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            {app.vivaTime ? (
                                                <div className="text-xs text-blue-300 font-medium whitespace-nowrap">
                                                    {new Date(app.vivaTime).toLocaleString()}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-white/20 italic">Not scheduled</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => handleOpenModal(app)}
                                                className="inline-flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
                        
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#151515] border border-white/10 rounded-3xl p-8 relative z-10 w-full max-w-lg shadow-2xl">
                            <button onClick={() => setSelectedApp(null)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>

                            <h3 className="text-xl font-black text-white mb-6">Manage Applicant</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 mb-2 block">Application Status</label>
                                    <select
                                        value={editStatus}
                                        onChange={e => setEditStatus(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 text-sm font-bold text-white uppercase tracking-widest"
                                    >
                                        <option value="PENDING" className="bg-[#111]">Pending</option>
                                        <option value="VIVA_SCHEDULED" className="bg-[#111]">Viva Scheduled</option>
                                        <option value="COMPLETED" className="bg-[#111]">Completed</option>
                                        <option value="ACCEPTED" className="bg-[#111]">Accepted</option>
                                        <option value="REJECTED" className="bg-[#111]">Rejected</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 mb-2 flex items-center block">
                                        <Clock className="h-3 w-3 mr-1" /> Viva Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editVivaTime}
                                        onChange={e => setEditVivaTime(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 text-sm font-bold text-white relative [color-scheme:dark]"
                                    />
                                    <p className="text-[10px] text-white/30 mt-2 px-1">Applicant will see exactly how much time they have to wait.</p>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1 mb-2 flex items-center block">
                                        <LinkIcon className="h-3 w-3 mr-1" /> Meeting Link (Zoom/Meet)
                                    </label>
                                    <input
                                        type="url"
                                        value={editVivaLink}
                                        onChange={e => setEditVivaLink(e.target.value)}
                                        placeholder="https://meet.google.com/..."
                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 text-sm text-white"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-end space-x-4">
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="px-6 py-3 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateViva}
                                    disabled={actionLoading}
                                    className="bg-gold text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#F0C040] transition-colors disabled:opacity-50 flex items-center"
                                >
                                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
