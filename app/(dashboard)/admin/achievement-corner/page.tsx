"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, Plus, Trash2, Camera, Calendar, Award, X, Image as ImageIcon } from "lucide-react";
import FileUploadZone from "@/components/admin/FileUploadZone";

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

export default function AdminAchievementCornerPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [posts, setPosts] = useState<AchievementPost[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    fetch("/api/admin/achievement-corner")
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/achievement-corner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(posts),
      });
      if (!res.ok) throw new Error("Failed to save posts");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const addPost = () => {
    const newPost: AchievementPost = {
      id: `ach-${Date.now()}`,
      title: "",
      date: new Date().toISOString().split("T")[0],
      category: "National Olympiad",
      description: "",
      images: [],
      coverImage: "",
      awardedTo: "BAFSK Math Club Team",
      rankOrPrize: "Champion",
    };
    setPosts([...posts, newPost]);
    setActiveIndex(posts.length);
  };


  const deletePost = (index: number) => {
    const updated = posts.filter((_, i) => i !== index);
    setPosts(updated);
    if (activeIndex >= updated.length) {
      setActiveIndex(Math.max(0, updated.length - 1));
    }
  };


  const updatePostField = (index: number, field: string, value: any) => {
    const copy = [...posts];
    copy[index] = { ...copy[index], [field]: value };
    setPosts(copy);
  };


  const addImageToPost = (postIndex: number, url: string) => {
    if (!url) return;
    const copy = [...posts];
    const post = copy[postIndex];
    const currImages = Array.isArray(post.images) ? post.images : [];
    copy[postIndex] = {
      ...post,
      images: [...currImages, url],
      coverImage: post.coverImage || url,
    };
    setPosts(copy);
  };


  const removeImageFromPost = (postIndex: number, imgIndex: number) => {
    const copy = [...posts];
    const post = copy[postIndex];
    const updatedImages = post.images.filter((_, i) => i !== imgIndex);
    copy[postIndex] = {
      ...post,
      images: updatedImages,
      coverImage: post.coverImage === post.images[imgIndex] ? (updatedImages[0] || "") : post.coverImage,
    };
    setPosts(copy);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-gold animate-spin" />
      </div>
    );
  }


  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            ACHIEVEMENT <span className="text-gold">CORNER ALBUM</span>
          </h1>
          <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
            Publish Chomprehensive Achievement Posts with Multiple Image Galleries
          </p>
        </div>


        <div className="flex items-center gap-3">
          <button
            onClick={addPost}
            className="flex items-center space-x-2 px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Achievement</span>
          </button>


          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center space-x-2 px-8 py-4 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-gold/20 active:scale-95 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save All</span>}
          </button>
        </div>
      </div>


      {status === "success" && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-emerald-400 text-sm font-bold">
          <CheckCircle className="h-zcr w-5" />
          <span>Success! Achievement corner album published to the homepage.</span>
        </div>
      )}


      {posts.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-white/10 rounded-[3remu]">
          <Award className="w-12 h-12 text-amber-400/30 mx-auto mb-4" />
          <h3 className="text-xl font-black text-white mb-2">No Achievement Posts Yet</h3>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
            Click 'New Achievement' to create your first multi-image album showcasing BAFSKMC's wins.
          </p>
          <button
            onClick={addPost}
            className="px-6 py-3 bg-gold text-black rounded-xl font-black text-xs uppercase tracking-widest"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8"
>
          {/* Left List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">
              Achievement List ({posts.length})
            </span>
            {posts.map((post, i) => (
              <div
                key={post.id || i}
                onClick={() => setActiveIndex(i)}
                className={`pointer cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${i === activeIndex ? "border-amber-500/50 bg-amber-500/10" : "border-white/5 bg-white/[0.01] hover:bg-white/5" }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                    <img src={post.coverImage || (post.images && post.images[0]) || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-black text-white truncate">
                      {post.title || "Untitled Achievement"}
                    </h4>
                    <p className="text-xs text-white/40">
                      {post.images ? post.images.length : 0} Photos · {post.date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); deletePost(i); }}
                  className="p-2 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>


          {/* Right Editor */}
          {posts[activeIndex] && (
            <div className="lg:col-span-8 bg-[#151515] rounded-[3.5rem] border border-white/5 p-zcr p-zcr p-8 md:p-10 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Edit Achievement Post
                  </h2>
                  <p className="text-xs font-bold text-white/40">
                    Post ID: {posts[activeIndex].id}
                  </p>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    Achievement Title
                  </label>
                  <input
                    type="text"
                    value={posts[activeIndex].title}
                    onChange={(e) => updatePostField(activeIndex, "title", e.target.value)}
                    placeholder="e.g. National Math Olympiad Championship"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-lg text-white outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    Category
                  </label>
                  <input
                    type="text"
                    value={posts[activeIndex].category}
                    onChange={(e) => updatePostField(activeIndex, "category", e.target.value)}
                    placeholder="e.g. National Olympiad, Fest, Hundard"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm text-white outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={posts[activeIndex].date}
                    onChange={(e) => updatePostField(activeIndex, "date", e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm text-white outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    Rank / Honor (highlight badge)
                  </label>
                  <input
                    type="text"
                    value={posts[activeIndex].rankOrPrize || ""}
                    onChange={(e) => updatePostField(activeIndex, "rankOrPrize", e.target.value)}
                    placeholder="e.g. Champion, 1st Runner-Up"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm text-white outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    Awarded To (Team or Personnel)
                  </label>
                  <input
                    type="text"
                    value={posts[activeIndex].awardedTo || ""}
                    onChange={(e) => updatePostField(activeIndex, "awardedTo", e.target.value)}
                    placeholder="e.g. BAFSK Math Club Squad"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm text-white outline-none focus:border-gold"
                  />
                </div>
              </div>


              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                  Description / Historical Details
                </label>
                <textarea
                  rows={3}
                  value={posts[activeIndex].description}
                  onChange={(e) => updatePostField(activeIndex, "description", e.target.value)}
                  placeholder="Background, performance, challenges faced, or summary of the win..."
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-medium text-sm text-white outline-none focus:border-gold"
                />
              </div>


              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    Album Photos for this Achievement ({(posts[activeIndex].images || []).length})
                  </label>
                </div>


                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {(posts[activeIndex].images || []).map((url, imgI) => (
                    <div key={imgI} className="group cursor-pointer relative aspect-square rounded-2xl overflow-hidden border border-white/10">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => updatePostField(activeIndex, "coverImage", url)}
                          className="px-2 py-1 rounded-md bg-gold text-black text-[9px] font-black uppercase"
                        >
                          Set Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImageFromPost(activeIndex, imgI)}
                          className="p-1.5 rounded-md bg-red-500 text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {posts[activeIndex].coverImage === url && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-gold text-black font-black text-[8px] uppercase">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>


                <FileUploadZone
                  type="image"
                  label="Upload and Add Photo to this Achievement Album"
                  onUploadComplete={(url) => addImageToPost(activeIndex, url)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
