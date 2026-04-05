"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, FileText, Upload as UploadIcon, CheckSquare, Loader2, AlertCircle, Award, Image as ImageIcon, Briefcase, Share2, Printer } from "lucide-react";
import FileUploadZone from "@/components/admin/FileUploadZone";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ApplyPanelPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [configData, setConfigData] = useState<{ startDate: string; deadline: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch("/api/apply-panel");
                if (res.ok) {
                    const data = await res.json();
                    setIsOpen(data.isOpen);
                    setConfigData({ startDate: data.startDate, deadline: data.deadline });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setInitLoading(false);
            }
        };
        checkStatus();
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        studentClass: "",
        section: "",
        pictureUrl: "",
        firstYearResult: "",
        resultCardUrl: "",
        experience: "",
        testimonialUrl: "",
        socialProofUrl: "",
    });

    const [agreedToBond, setAgreedToBond] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!agreedToBond) {
            setError("You must agree to the bond money terms to apply.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/apply-panel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit application");
            }

            setShowSuccess(true);
            window.dispatchEvent(new Event('show-ad'));
            setTimeout(() => {
                router.push("/panel");
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6">
                        <span className="h-1.5 w-1.5 bg-gold rounded-full animate-pulse" />
                        <span className="text-gold font-black text-[10px] uppercase tracking-[0.3em]">Join the Leadership</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
                        Apply for <span className="text-gold">Panel Member</span>
                    </h1>
                    <p className="text-lg text-white/40 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
                        Become a part of the executive team at BAFSK Math Club. Please fill out the application form carefully.
                    </p>
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 px-6 rounded-xl transition-all"
                    >
                        {copied ? <CheckSquare className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                        <span>{copied ? "Link Copied!" : "Share Application Form"}</span>
                    </button>

                    {configData && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                            <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center space-x-3 text-sm">
                                <span className="text-emerald-500">Live Date:</span>
                                <span className="text-white font-bold">{new Date(configData.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 px-5 py-3 rounded-2xl flex items-center space-x-3 text-sm">
                                <span className="text-red-500">Deadline:</span>
                                <span className="text-red-500 font-bold">{new Date(configData.deadline).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {initLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-10 w-10 text-gold animate-spin" />
                    </div>
                ) : !isOpen ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none" />
                        <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="h-10 w-10 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white px-2">Recruitment is Closed</h2>
                        <p className="text-white/50 font-medium mt-4 max-w-lg mx-auto">
                            The application window for the BAFSK Math Club Panel has officially closed. Keep an eye on our social presence for any future recruitment opportunities! 
                        </p>
                        <div className="mt-8">
                            <Link href="/panel" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-8 rounded-xl transition-all">
                                Return to Panel
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-10">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center space-x-4 text-red-500 text-sm font-bold"
                        >
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center space-x-4 text-emerald-500 text-sm font-bold"
                        >
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p>Application submitted successfully! We will review it shortly. Redirecting...</p>
                        </motion.div>
                    )}

                    <div className="bg-[#151515] rounded-[3rem] border border-white/5 shadow-2xl p-8 md:p-10 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                        {/* Section 1: Basic Stats */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-white flex items-center border-b border-white/5 pb-4">
                                <span className="flex items-center justify-center bg-gold/10 text-gold h-8 w-8 rounded-full mr-3 text-sm">1</span>
                                Personal Information & Academic Results
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="e.g. user@example.com"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="e.g. +8801XXXXXXXXX"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Class</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white"
                                            value={formData.studentClass}
                                            onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                                            placeholder="e.g. 11"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Section</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white"
                                            value={formData.section}
                                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                            placeholder="e.g. A"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">First Year Final Result (GPA/Marks)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-bold text-white"
                                        value={formData.firstYearResult}
                                        onChange={(e) => setFormData({ ...formData, firstYearResult: e.target.value })}
                                        placeholder="e.g. 5.00"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-3">
                                    <FileUploadZone
                                        type="image"
                                        label="Your Recent Picture *"
                                        accept="image/*"
                                        initialUrl={formData.pictureUrl}
                                        onUploadComplete={(url) => setFormData({ ...formData, pictureUrl: url })}
                                    />
                                    <p className="text-white/20 text-xs pl-2">Passport/standard formal photo.</p>
                                </div>
                                <div className="space-y-3">
                                    <FileUploadZone
                                        type="document"
                                        label="First Year Result Card Upload (Drive/File) *"
                                        initialUrl={formData.resultCardUrl}
                                        onUploadComplete={(url) => setFormData({ ...formData, resultCardUrl: url })}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <div className="h-px bg-white/10 flex-1"/>
                                        <span className="text-white/20 text-xs font-bold uppercase tracking-widest">OR</span>
                                        <div className="h-px bg-white/10 flex-1"/>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl outline-none focus:border-gold/50 transition-all text-xs font-bold text-white placeholder:text-white/20"
                                        value={formData.resultCardUrl.startsWith('http') ? formData.resultCardUrl : ''}
                                        onChange={(e) => setFormData({ ...formData, resultCardUrl: e.target.value })}
                                        placeholder="Paste Google Drive Link Here"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Experience */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-xl font-black text-white flex items-center border-b border-white/5 pb-4">
                                <span className="flex items-center justify-center bg-gold/10 text-gold h-8 w-8 rounded-full mr-3 text-sm">2</span>
                                Previous Experience
                            </h2>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Previous Clubbing or Leadership Experience</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-medium text-white/80 leading-relaxed resize-none"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    placeholder="Describe any clubs you've been a part of or leadership roles you've held..."
                                />
                            </div>
                        </div>

                        {/* Section 3: Testimonial */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-xl font-black text-white flex items-center border-b border-white/5 pb-4">
                                <span className="flex items-center justify-center bg-gold/10 text-gold h-8 w-8 rounded-full mr-3 text-sm">3</span>
                                Moderator Testimonial
                            </h2>
                            <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl mb-6">
                                <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-blue-400 font-bold text-sm">Testimonial Requirement</h3>
                                        <p className="text-white/50 text-xs">You must download the testimonial template, get it signed by any one moderator, and upload the scanned copy here.</p>
                                    </div>
                                    <Link 
                                        href="/testimonial-template" 
                                        target="_blank"
                                        className="flex shrink-0 items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                    >
                                        <Printer className="h-4 w-4" />
                                        <span>Download Template</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <FileUploadZone
                                    type="document"
                                    label="Upload Signed Testimonial (Optional)"
                                    initialUrl={formData.testimonialUrl}
                                    onUploadComplete={(url) => setFormData({ ...formData, testimonialUrl: url })}
                                />
                            </div>
                        </div>

                        {/* Section 4: Social Media Proof */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-xl font-black text-white flex items-center border-b border-white/5 pb-4">
                                <span className="flex items-center justify-center bg-gold/10 text-gold h-8 w-8 rounded-full mr-3 text-sm">4</span>
                                Social Media Proof
                            </h2>
                            <p className="text-white/50 text-sm">
                                Like and Follow our official pages, and invite a minimum of 500 people. Upload a screenshot proof or drive link below.
                            </p>
                            <div className="space-y-3">
                                <FileUploadZone
                                    type="image"
                                    label="Upload Proof (Screenshot) *"
                                    initialUrl={formData.socialProofUrl}
                                    onUploadComplete={(url) => setFormData({ ...formData, socialProofUrl: url })}
                                />
                                <div className="flex items-center space-x-2 mt-4">
                                    <div className="h-px bg-white/10 flex-1"/>
                                    <span className="text-white/20 text-xs font-bold uppercase tracking-widest">OR</span>
                                    <div className="h-px bg-white/10 flex-1"/>
                                </div>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 mt-4 bg-white/[0.03] border border-white/10 rounded-xl outline-none focus:border-gold/50 transition-all text-xs font-bold text-white placeholder:text-white/20"
                                    value={formData.socialProofUrl.startsWith('http') ? formData.socialProofUrl : ''}
                                    onChange={(e) => setFormData({ ...formData, socialProofUrl: e.target.value })}
                                    placeholder="Paste Google Drive Link Here"
                                />
                            </div>
                        </div>

                        {/* Section 5: Bond Money */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-xl font-black text-white flex items-center border-b border-white/5 pb-4">
                                <span className="flex items-center justify-center bg-gold/10 text-gold h-8 w-8 rounded-full mr-3 text-sm">5</span>
                                Additional Requirements
                            </h2>
                            <label className="flex items-start space-x-4 p-5 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors group">
                                <div className="mt-1">
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={agreedToBond}
                                        onChange={(e) => setAgreedToBond(e.target.checked)}
                                    />
                                    <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreedToBond ? 'bg-gold border-gold' : 'border-white/20 group-hover:border-gold/50'}`}>
                                        {agreedToBond && <CheckSquare className="h-4 w-4 text-black" />}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white font-bold">Bond Money Agreement</p>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        I acknowledge that if selected as a panel member, I am required to submit a bond money of <strong>500 BDT</strong> (Refundable at the end of the tenure subject to satisfactory performance).
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-8">
                        <button
                            type="submit"
                            disabled={loading || !agreedToBond || !formData.name || !formData.email || !formData.phone || !formData.studentClass || !formData.section || !formData.firstYearResult || !formData.experience || !formData.pictureUrl || !formData.resultCardUrl || !formData.socialProofUrl}
                            className="bg-gold text-black px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-[#F0C040] shadow-2xl shadow-gold/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group w-full md:w-auto justify-center"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadIcon className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />}
                            <span>Submit Application</span>
                        </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    );
}
