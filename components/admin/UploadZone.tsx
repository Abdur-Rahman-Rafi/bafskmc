"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";

interface UploadZoneProps {
    onUploadComplete: (url: string) => void;
    initialImage?: string;
    label?: string;
}

export default function UploadZone({ onUploadComplete, initialImage, label = "Upload Image" }: UploadZoneProps) {
    const [preview, setPreview] = useState<string | null>(initialImage || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            onUploadComplete(data.url);
        } catch (err: any) {
            setError("Direct upload failed. Please try again.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const clearImage = () => {
        setPreview(null);
        onUploadComplete("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="space-y-4">
            <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1 flex items-center">
                <ImageIcon className="h-3 w-3 mr-2 text-gold" />
                {label}
            </label>

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-[2rem] transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center p-6
                    ${preview ? 'border-gold/50 bg-gold/5' : 'border-white/10 bg-white/5 hover:border-gold/30 hover:bg-gold/5'}
                `}
            >
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {uploading ? (
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-10 w-10 text-gold animate-spin" />
                        <p className="text-gold font-black uppercase text-[10px] tracking-widest">Optimizing & Uploading...</p>
                    </div>
                ) : preview ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group-hover:border-gold/50 transition-colors">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-black text-xs uppercase tracking-widest">Change Photo</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearImage();
                            }}
                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="p-4 bg-gold/10 rounded-2xl">
                            <Upload className="h-8 w-8 text-gold" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Click to browse</p>
                            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mt-1">Direct upload from device</p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-red-500 text-xs font-bold pl-1 animate-pulse">{error}</p>
            )}

            {!uploading && preview && !error && (
                <div className="flex items-center space-x-2 text-emerald-500 pl-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Successfully Staged</span>
                </div>
            )}
        </div>
    );
}
