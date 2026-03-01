"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Search, Tag, Loader2 } from "lucide-react";

interface Resource {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    imageUrl?: string | null;
    category: string;
    createdAt: string;
}

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/api/resources")
            .then((res) => res.json())
            .then((data) => {
                setResources(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredResources = resources.filter(res =>
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Study Resources</h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Download previous year questions, formula sheets, and curated math modules.
                    </p>
                </div>

                <div className="mb-12 relative max-w-xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for resources, topics, or categories..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredResources.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">No resources found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResources.map((res, idx) => (
                            <motion.div
                                key={res.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        <Tag className="h-3 w-3" />
                                        <span>{res.category}</span>
                                    </div>
                                </div>

                                {res.imageUrl && (
                                    <div className="mb-6 rounded-2xl overflow-hidden aspect-video border border-slate-100">
                                        <img src={res.imageUrl} alt={res.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{res.title}</h3>
                                <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-8">
                                    {res.description || "Comprehensive material designed to help you master mathematical concepts."}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Added {new Date(res.createdAt).toLocaleDateString()}
                                    </span>
                                    <a
                                        href={res.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Download</span>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
