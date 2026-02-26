"use client";

import { useEffect, useState } from "react";
import {
    Camera,
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    Image as ImageIcon,
    Calendar,
    Filter,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GalleryForm from "@/components/admin/GalleryForm";

interface GalleryItem {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    date: string;
}

export default function AdminGalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

    const fetchGallery = () => {
        setLoading(true);
        fetch("/api/gallery")
            .then((res) => res.json())
            .then((data) => {
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This memory will be permanently removed from the gallery.")) return;

        try {
            const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
            if (res.ok) {
                setItems(items.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Deletion protocol failed");
        }
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                        GALLERY <span className="text-gold">VAULT</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                        Visual Archives • Media Asset Control
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsFormOpen(true);
                    }}
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black shadow-2xl shadow-gold/20 transition-all active:scale-95 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Capture Memory</span>
                </button>
            </div>

            {/* Filter / Search Console */}
            <div className="bg-[#151515] rounded-[2.5rem] border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="FILTER ASSETS BY TITLE OR CATEGORY..."
                        className="w-full pl-14 pr-6 py-4 bg-[#0D0D0D] border border-white/5 rounded-2xl outline-none focus:border-gold/30 transition-all text-sm font-bold text-white placeholder:text-white/10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <div className="px-5 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center space-x-3 text-white/30">
                        <Camera className="h-4 w-4" />
                        <span className="text-xs font-black uppercase tracking-widest">{items.length} Assets</span>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-4">
                    <Loader2 className="h-10 w-10 text-gold animate-spin" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Accessing Visual Nodes...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-40 bg-[#151515] rounded-[3rem] border border-dashed border-white/5">
                    <ImageIcon className="h-20 w-20 text-white/5 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white/20 uppercase italic">Gallery Empty</h3>
                    <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest mt-2 px-10">No visual assets detected in this query range.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative bg-[#151515] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/30 shadow-2xl transition-all"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden bg-white/5">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-gold border border-gold/20">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="absolute top-6 right-6 flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingItem(item);
                                            setIsFormOpen(true);
                                        }}
                                        className="p-3 bg-black/60 backdrop-blur-md rounded-xl text-white/40 hover:text-gold transition-all border border-white/10"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-3 bg-black/60 backdrop-blur-md rounded-xl text-white/40 hover:text-red-500 transition-all border border-white/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Calendar className="h-3 w-3 text-gold/40" />
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-white italic tracking-tight group-hover:text-gold transition-colors">
                                    {item.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Form Overlay */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <GalleryForm
                            initialData={editingItem}
                            onCancel={() => setIsFormOpen(false)}
                            onSuccess={() => {
                                setIsFormOpen(false);
                                fetchGallery();
                            }}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
