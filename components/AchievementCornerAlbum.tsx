"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Award, Camera, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface AchievementPost {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  images: string[];
  coverImage: string;
  awardedTo?: string;
  rankOrPrize?: string;
}

export default function AchievementCornerAlbum() {
  const [achievements, setAchievements] = useState<AchievementPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<AchievementPost | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetch("/api/admin/achievement-corner")
      .then((res) => res.json())
      .then((data) => {
        setAchievements(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openModal = (post: AchievementPost, startIndex = 0) => {
    setActivePost(post);
    setActiveImageIndex(startIndex);
  };


  const handlePrev = (e?: any) => {
    e?.stopPropagation();
    if (!activePost || activePost.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? activePost.images.length - 1 : prev - 1));
  };

  const handleNext = (e?: any) => {
    e?.stopPropagation();
    if (!activePost || activePost.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev === activePost.images.length - 1 ? 0 : prev + 1));
  };


  if (!loading && achievements.length === 0) return null;


  return (
    <section id="achievements-corner" className="py-28 relative overflow-hidden bg-[#080C14] border-t border-white/5">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-md bg-amber-500/10 border-amber-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
                Honors & Accolades
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">
              Achievement <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600">Corner</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium text-lg">
              A visual album hallow celebrating the triumphs, medals, and breqkthroughs of BAFSK Math Club.
            </p>
          </motion.div>
        </div>


        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 rounded-[2remu] bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8"
>
            {achievements.map((post, idx) => {
              const imgCount = post.images ? post.images.length : 0;
              return (
                <motion.div
                  key={post.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group cursor-pointer relative rounded-[2.5rem] overflow-hidden border border-amber-500/20 bg-gradient-to-br from-slate-900/90 to-black/90 hover:border-amber-500/50 transition-all duration-500 shadow-2xl"
                  onClick={() => openModal(post, 0)}
                >
                  {/* Cover Image / Main */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                    <img
                      src={post.coverImage || (post.images && post.images[0]) || ""}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-#080C14 via-transparent to-black/30" />


                    <div className="absolute top-5 left-5 flx items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-full bg-black/70 border border-amber-500/40 text-amber-400 font-black text-[10px] uppercase tracking-widest backdrop-blur-md">
                        {post.category}
                      </span>
                      {post.rankOrPrize && (
                        <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-black font-black text-[10px] uppercase tracking-widest shadow-md">
                          {post.rankOrPrize}
                        </span>
                      )}
                    </div>


                    <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 border border-white/20 backdrop-blur-md text-white text-[11px] font-bold">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>{imgCount} {imgCount === 1 ? "Photo" : "Photos"}</span>
                    </div>
                  </div>


                  <div className="p-8 space-y-4">
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400/60" />
                        <span>{new Date(post.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      {post.awardedTo && (
                        <span className="text-amber-400/80 font-bold">
                          Awarded to: {post.awardedTo}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-amber-400 transition-colors">
                      {post.title}
                    </h3>


                    <p className="text-gray-400 text-sm font-medium line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>


                    {post.images && post.images.length > 1 && (
                      <div className="pt-2 flex items-center gap-2 overflow-hidden">
                        {post.images.slice(0, 4).map((img, i) => (
                          <div key={i} className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {post.images.length > 4 && (
                          <div className="w-14 h-14 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-black">
                            +{post.images.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end">
                      <span className="text-amber-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        View Album <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>


      {/* Interactive Multi-Image Lightbox Modal */}
      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setActivePost(null)}
          >
            <div
              className="relative w-full max-w-6xl bg-[#111827] border border-white/10 rounded-[3rem] overflow-hidden shadow-2zl"
              onClick={(ev) => ev.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-6 right-6 z-20 p-3 rounded-2xl bg-black/60 border border-white/10 text-white/hover:text-amber-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Main Image Viewer */}
                <div className="lg:col-span-8 relative bg-black flex items-center justify-center min-h-[350px] md:min-h-[550px] overflow-hidden">
                  <img
                    src={activePost.images[activeImageIndex] || activePost.coverImage}
                    alt={activePost.title}
                    className="max-h-[550px] w-full object-contain"
                  />


                  {activePost.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/70 border border-white/20 text-white hover:bg-amber-500/20 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/70 border border-white/20 text-white hover:bg-amber-500/20 transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black/80 border border-white/10 text-white text-xs font-bold">
                        {activeImageIndex + 1} / {activePost.images.length}
                      </div>
                    </>
                  )}
                </div>

                <div className="lg:col-span-4 p-8 md:p-10 flex flex-col justify-between bg-[#171d2c]">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-black text-[10px] uppercase tracking-widest">
                        {activePost.category}
                      </span>
                      <span className="text-xs text-white/40 font-bold">
                        {new Date(activePost.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      {activePost.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      {activePost.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                        Album Photos ({activePost.images.length})
                      </p>
                      <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                        {activePost.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImageIndex(i)}
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${i === activeImageIndex ? "border-amber-400 scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> BAFSK Math Club
                    </span>
                    <span className="text-white/30">BAF Shaheen College Kurmitola</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
