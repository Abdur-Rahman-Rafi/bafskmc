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
        <div className="w-full bg-[#1A1A1A] border-b border-[#333] relative flex justify-center py-2 px-4 shadow-xl z-40 overflow-hidden">
            {/* Soft backdrop glow to make banner pop slightly */}
            <div className="absolute inset-0 bg-gold/5 opacity-30 mix-blend-overlay"></div>
            
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between w-full space-y-2 sm:space-y-0 relative z-10 gap-x-6">
                <div className="flex items-center space-x-4 flex-1">
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] bg-white/10 text-white/50 border border-white/10 shrink-0">
                        {currentAd.type === 'PAID' ? 'Sponsored' : 'Partner'}
                    </span>
                    <p className="text-white text-xs sm:text-sm font-medium line-clamp-1 flex items-center">
                        <span className="font-bold text-white/90 mr-2">{currentAd.companyName}</span>
                    </p>
                </div>

                {/* Banner Wrapper */}
                {currentAd.imageUrl && (
                     <div className="w-full sm:w-[500px] h-12 md:h-16 relative rounded-lg overflow-hidden shrink-0 border border-white/10 hover:border-white/30 transition-colors shadow-2xl">
                         {currentAd.targetUrl ? (
                             <a href={currentAd.targetUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">
                                 <img src={currentAd.imageUrl} alt={currentAd.companyName} className="object-cover w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                     <span className="bg-black/60 rounded px-3 py-1 flex items-center space-x-2 text-white text-xs font-bold shadow-2xl border border-white/10">
                                         <span>Visit Link</span>
                                         <ExternalLink className="h-3 w-3" />
                                     </span>
                                 </div>
                             </a>
                         ) : (
                             <img src={currentAd.imageUrl} alt={currentAd.companyName} className="object-cover w-full h-full" />
                         )}
                     </div>
                )}

                <button 
                    onClick={() => setIsVisible(false)}
                    className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors absolute sm:relative right-2 top-2 sm:right-auto sm:top-auto z-20 shrink-0"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
