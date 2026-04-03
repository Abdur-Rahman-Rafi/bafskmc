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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        fetch("/api/advertisements")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    // Shuffle the ads
                    const shuffled = [...data].sort(() => Math.random() - 0.5);
                    setAds(shuffled);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        const handleShowAd = () => {
             if (ads.length > 0) {
                 setIsVisible(true);
                 // If already shown once, shuffle index
                 setCurrentIndex(prev => (prev + 1) % ads.length);
             }
        };

        window.addEventListener('show-ad', handleShowAd);
        return () => window.removeEventListener('show-ad', handleShowAd);
    }, [ads.length]);

    useEffect(() => {
        if (isVisible && ads.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % ads.length);
            }, 8000); // Rotate completely different brand ads every 8s
            return () => clearInterval(interval);
        }
    }, [isVisible, ads.length]);

    if (!isVisible || ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    // Determine layout: For horizontal ribbons it's best as a fixed bottom banner or inline block.
    // Making it an inline subtle block we can drop anywhere.

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none transition-opacity"></div>
            
            <div className="relative bg-[#111111] border border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-8 max-w-2xl w-full mx-auto z-10 animate-in fade-in zoom-in duration-300">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/5 to-transparent rounded-[2rem] blur-xl opacity-30 pointer-events-none"></div>
                
                {/* Close Button */}
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all backdrop-blur-md z-30"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="relative z-20">
                    <div className="flex flex-col items-center justify-center space-y-1 mb-6 text-center">
                        <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 text-gold border border-white/10 inline-block mb-1">
                            {currentAd.type === 'PAID' ? 'Sponsored' : 'Partner'}
                        </span>
                        <h3 className="text-white font-black text-xl md:text-2xl tracking-tighter shimmer">
                            {currentAd.companyName}
                        </h3>
                    </div>

                    {/* Banner Image / Video */}
                    {currentAd.imageUrl && (
                         <div className="w-full relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl group bg-black/50">
                             {currentAd.targetUrl ? (
                                 <a href={currentAd.targetUrl} target="_blank" rel="noopener noreferrer" className="block w-full relative cursor-pointer">
                                     {currentAd.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                         <video src={currentAd.imageUrl} autoPlay loop muted playsInline className="w-full h-auto max-h-[60vh] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]" />
                                     ) : (
                                         <img src={currentAd.imageUrl} alt={currentAd.companyName} className="w-full h-auto max-h-[60vh] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]" />
                                     )}
                                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                         <span className="bg-gold text-black rounded-xl px-8 py-3 flex items-center space-x-3 text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(201,150,43,0.3)] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                                             <span>Learn More</span>
                                             <ExternalLink className="h-4 w-4" />
                                         </span>
                                     </div>
                                 </a>
                             ) : (
                                 currentAd.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                     <video src={currentAd.imageUrl} autoPlay loop muted playsInline controls className="w-full h-auto max-h-[60vh] object-contain mx-auto" />
                                 ) : (
                                     <img src={currentAd.imageUrl} alt={currentAd.companyName} className="w-full h-auto max-h-[60vh] object-contain mx-auto" />
                                 )
                             )}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}
