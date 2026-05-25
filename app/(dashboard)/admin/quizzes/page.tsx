"use client";

import { useState, useEffect } from "react";
import { createQuiz, getQuizzes, deleteQuiz } from "./actions";
import { Plus, Trash2, Upload, Loader2, Calendar, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminQuizzesPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    
    // Form state
    const [name, setName] = useState("");
    const [category, setCategory] = useState("CLASS_5");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [duration, setDuration] = useState("30");
    const [file, setFile] = useState<File | null>(null);
    
    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        setLoading(true);
        try {
            const data = await getQuizzes();
            setQuizzes(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            let questionFileUrl = "";

            // Handle File Upload if present
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });
                
                if (!uploadRes.ok) {
                    const error = await uploadRes.json();
                    throw new Error(error.error || "Failed to upload file");
                }
                
                const uploadData = await uploadRes.json();
                questionFileUrl = uploadData.url;
            }

            await createQuiz({
                name,
                category,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                duration: parseInt(duration),
                questionFileUrl
            });
            
            setName("");
            setStartTime("");
            setEndTime("");
            setFile(null);
            await loadQuizzes();
        } catch (e: any) {
            alert(e.message || "Error creating quiz");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;
        try {
            await deleteQuiz(id);
            await loadQuizzes();
        } catch (e) {
            alert("Error deleting quiz");
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                Quiz <span className="text-gold">Competition</span> Management
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="bg-[#151515] p-6 rounded-2xl border border-white/5 h-fit">
                    <h2 className="text-xl font-bold mb-4 text-white">Create New Quiz</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-white/50 mb-1">Quiz Name</label>
                            <input required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 mb-1">Class</label>
                            <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold">
                                <option value="CLASS_5">Class 5</option>
                                <option value="CLASS_6">Class 6</option>
                                <option value="CLASS_7">Class 7</option>
                                <option value="CLASS_8">Class 8</option>
                                <option value="CLASS_9">Class 9</option>
                                <option value="CLASS_10">Class 10</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-white/50 mb-1">Start Time</label>
                                <input type="datetime-local" required value={startTime} onChange={e=>setStartTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 mb-1">End Time</label>
                                <input type="datetime-local" required value={endTime} onChange={e=>setEndTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 mb-1">Duration (mins)</label>
                            <input type="number" required value={duration} onChange={e=>setDuration(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 mb-1">Question File (PDF/Image)</label>
                            <div className="relative border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-gold/50 transition-colors">
                                <input 
                                    type="file" 
                                    accept="application/pdf,image/*"
                                    onChange={e => setFile(e.target.files?.[0] || null)} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                />
                                {file ? (
                                    <div className="flex flex-col items-center">
                                        <FileText className="w-8 h-8 text-gold mb-2" />
                                        <span className="text-sm font-bold text-white">{file.name}</span>
                                        <span className="text-xs text-white/50">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-white/30 mb-2" />
                                        <span className="text-sm font-bold text-white/50">Click to upload question file</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button disabled={creating} type="submit" className="w-full bg-gold hover:bg-[#F0C040] text-black font-black p-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center">
                            {creating ? <Loader2 className="animate-spin w-5 h-5" /> : <><Plus className="w-5 h-5 mr-2" /> Create Quiz</>}
                        </button>
                    </form>
                </div>

                {/* List Quizzes */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>
                    ) : quizzes.length === 0 ? (
                        <div className="text-center p-10 bg-white/5 rounded-2xl border border-dashed border-white/10 text-white/50">
                            No active quizzes.
                        </div>
                    ) : (
                        quizzes.map((quiz) => (
                            <motion.div key={quiz.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-[#151515] p-6 rounded-2xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <h3 className="font-black text-xl text-white flex items-center gap-2">
                                        {quiz.name}
                                        <span className="text-[10px] bg-gold/10 text-gold px-2 py-1 rounded-lg border border-gold/20 uppercase tracking-widest">{quiz.category.replace(/_/g, ' ')}</span>
                                    </h3>
                                    <div className="flex gap-4 mt-2 text-xs text-white/40 font-bold uppercase tracking-widest">
                                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(quiz.startTime).toLocaleString()}</span>
                                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {quiz.duration} Mins</span>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(quiz.id)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
