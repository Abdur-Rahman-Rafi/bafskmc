"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";

interface Advertisement {
    id: string;
    companyName: string;
    imageUrl: string;
    targetUrl: string | null;
    type: string;
}

export default function AdvertisementBanner() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        fetch("/api/advertisements")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setAds(data);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (ads.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % ads.length);
            }, 8000); // Rotate completely different brand ads every 8s
            return () => clearInterval(interval);
        }
    }, [ads.length]);

    if (!isVisible || ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    // Determine layout: For horizontal ribbons it's best as a fixed bottom banner or inline block.
    // Making it an inline subtle block we can drop anywhere.

    return (
        <div className="w-full bg-black border-b border-white/10 relative flex justify-center py-6 px-4 shadow-2xl z-40">
            <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent opacity-20 pointer-events-none" />
            
            <div className="max-w-5xl mx-auto w-full relative z-10">
                {/* Close Button */}
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute -top-2 -right-2 md:-right-6 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all z-20 backdrop-blur-md"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Sponsor Metadata */}
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 text-gold border border-white/10">
                        {currentAd.type === 'PAID' ? 'Sponsored' : 'Partner'}
                    </span>
                    <p className="text-white/70 text-sm font-bold tracking-widest uppercase">
                        {currentAd.companyName}
                    </p>
                </div>

                {/* Banner Wrapper */}
                {currentAd.imageUrl && (
                     <div className="w-full relative rounded-2xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all shadow-[0_0_50px_rgba(0,0,0,0.8)] group bg-black/50">
                         {currentAd.targetUrl ? (
                             <a href={currentAd.targetUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative cursor-pointer">
                                 <img 
                                     src={currentAd.imageUrl} 
                                     alt={currentAd.companyName} 
                                     className="w-full h-auto max-h-[500px] object-contain mx-auto transition-transform duration-700 group-hover:scale-[1.01]" 
                                 />
                                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                     <span className="bg-black/80 rounded-xl px-6 py-3 flex items-center space-x-3 text-white text-sm font-black uppercase tracking-widest shadow-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                                         <span>Visit Link</span>
                                         <ExternalLink className="h-4 w-4" />
                                     </span>
                                 </div>
                             </a>
                         ) : (
                             <img 
                                 src={currentAd.imageUrl} 
                                 alt={currentAd.companyName} 
                                 className="w-full h-auto max-h-[500px] object-contain mx-auto" 
                             />
                         )}
                     </div>
                )}
            </div>
        </div>
    );
}
