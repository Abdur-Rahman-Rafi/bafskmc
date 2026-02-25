"use client";

import { useState, useRef } from "react";
import { Upload, X, File as FileIcon, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";

interface FileUploadZoneProps {
    onUploadComplete: (url: string, name?: string, size?: number, type?: string) => void;
    initialUrl?: string;
    accept?: string;
    label?: string;
    type?: "image" | "document";
}

export default function FileUploadZone({
    onUploadComplete,
    initialUrl,
    accept = "*/*",
    label = "Upload File",
    type = "image"
}: FileUploadZoneProps) {
    const [preview, setPreview] = useState<string | null>(initialUrl || null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setSuccess(false);
        setFileName(file.name);

        // Preview for images
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || "Upload failed");
            }

            const data = await res.json();
            onUploadComplete(data.url, data.name, data.size, data.type);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Upload failed. Try again.");
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setPreview(null);
        setFileName(null);
        setSuccess(false);
        setError(null);
        onUploadComplete("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="space-y-3">
            <label className="text-xs font-black text-white/30 uppercase tracking-widest pl-1 flex items-center">
                {type === "image" ? <ImageIcon className="h-3 w-3 mr-2 text-gold" /> : <FileIcon className="h-3 w-3 mr-2 text-gold" />}
                {label}
            </label>

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-[2rem] transition-all duration-300 min-h-[160px] flex flex-col items-center justify-center p-6 ${(preview || fileName) ? "border-gold/50 bg-gold/5" : "border-white/10 bg-white/5 hover:border-gold/30 hover:bg-gold/5"}`}
            >
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept={accept}
                    onChange={handleFileChange}
                />

                {uploading ? (
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-10 w-10 text-gold animate-spin" />
                        <p className="text-gold font-black uppercase text-[10px] tracking-widest">Uploading...</p>
                    </div>
                ) : preview ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-black text-xs uppercase tracking-widest">Change File</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); clearFile(); }} className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : fileName ? (
                    <div className="flex flex-col items-center space-y-4 text-center w-full">
                        <div className="p-4 bg-gold/10 rounded-2xl">
                            <FileIcon className="h-8 w-8 text-gold" />
                        </div>
                        <p className="text-white font-bold text-sm max-w-[200px] truncate">{fileName}</p>
                        <button onClick={e => { e.stopPropagation(); clearFile(); }} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300">Remove</button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="p-4 bg-gold/10 rounded-2xl group-hover:bg-gold/20 transition-colors">
                            <Upload className="h-8 w-8 text-gold" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Click to browse files</p>
                            <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mt-1">Direct upload from your device</p>
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 text-xs font-bold pl-1">{error}</p>}
            {success && !error && (
                <div className="flex items-center space-x-2 text-emerald-500 pl-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Uploaded Successfully</span>
                </div>
            )}
        </div>
    );
}
