"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, User, Plus, Trash2, Quote, Shield, Info } from "lucide-react";
import FileUploadZone from "@/components/admin/FileUploadZone";

interface PrincipalSpeech {
  enabled: boolean;
  name: string;
  designation: string;
  subTitle?: string;
  speech: string;
  imageUrl?: string;
}

interface ModeratorSpeech {
  id: string;
  name: string;
  roleTitle: string;
  department?: string;
  speech: string;
  imageUrl?: string;
  priority: number;
}

export default function AdminSpeechesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [principal, setPrincipal] = useState<PrincipalSpeech>({
    enabled: true,
    name: "Group Captain Md. Shahidul Islam",
    designation: "Principal, BAF Shaheen College Kurmitola",
    subTitle: "Patron-in-Chief, BAFSK Math Club",
    speech: "",
    imageUrl: "",
  });

  const [moderators, setModerators] = useState<ModeratorSpeech[]>([]);

  useEffect(() => {
    fetch("/api/admin/speeches")
      .then((res) => res.json())
      .then((data) => {
        if (data?.principal) setPrincipal(data.principal);
        if (Array.isArray(data?.moderators)) setModerators(data.moderators);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/speeches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ principal, moderators }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const addModerator = () => {
    setModerators([
      ...moderators,
      {
        id: `moderator-${Date.now()}`,
        name: "",
        roleTitle: "Club Moderator",
        department: "Department of Mathematics",
        speech: "",
        imageUrl: "",
        priority: moderators.length + 1,
      },
    ]);
  };

  const removeModerator = (index: number) => {
    setModerators(moderators.filter((_, i) => i !== index));
  };

  const updateModerator = (index: number, field: string, value: any) => {
    const copy = [...moderators];
    copy[index] = { ...copy[index], [field]: value };
    setModerators(copy);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-gold animate-spin" />
      </div>
    );
  }


  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            LEADERSHIP & <span className="text-gold">SPEECHES</span>
          </h1>
          <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
            Manage Principal's & Moderators' Pictures & Messages
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-3 px-8 py-4 bg-gold hover:bg-[#F0C040] text-black rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-gold/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : status === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>{saving ? "Saving..." : status === "success" ? "Published!" : "Save Changes"}</span>
        </button>
      </div>


      {status === "success" && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-emerald-400 text-sm font-bold">
          <CheckCircle className="h-5 w-5" />
          <span>Success! Leadership speeches and photos updated on the homepage.</span>
        </div>
      )}


      {/* SECTION 1: PRINCIPAL'S SPEECG */}
      <div className="bg-[#151515] rounded-3xl sm:rounded-[3.5rem] border border-white/5 shadow-2xl p-5 sm:p-8 md:p-10 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">
                Principal's Message & Photo
              </h2>
              <p className="text-xs font-bold text-white/40">
                Patron-in-Chief of BAF-Shaheen College Kurmitola
              </p>
            </div>
          </div>

          <label className="flex items-center space-x-3 cursor-pointer">
            <span className="text-xs font-black uppercase tracking-widest text-white/40">
              Show on Homepage
            </span>
            <input
              type="checkbox"
              checked={principal.enabled}
              onChange={(e) => setPrincipal({ ...principal, enabled: e.target.checked })}
              className="w-5 h-5 rounded accent-gold"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Photo Upload */}
          <div className="lg:col-span-4">
            <FileUploadZone
              type="image"
              label="Principal's Portrait"
              initialUrl={principal.imageUrl}
              onUploadComplete={(url) => setPrincipal({ ...principal, imageUrl: url })}
            />
          </div>


          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                  Principal's Name
                </label>
                <input
                  type="text"
                  value={principal.name}
                  onChange={(e) => setPrincipal({ ...principal, name: e.target.value })}
                  placeholder="e.g. Group Captain Md. Shahidul Islam"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold text-white font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                  Designation / Official Title
                </label>
                <input
                  type="text"
                  value={principal.designation}
                  onChange={(e) => setPrincipal({ ...principal, designation: e.target.value })}
                  placeholder="e.g. Principal, BAF Shaheen College Kurmitola"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold text-white font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                Club Role (e.g. Patron-in-Chief, BAFSK Math Club)
              </label>
              <input
                type="text"
                value={principal.subTitle || ""}
                onChange={(e) => setPrincipal({ ...principal, subTitle: e.target.value })}
                placeholder="e.g. Patron-in-Chief, BAFSK Math Club"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold text-white font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                Principal's Speech / Inspirational Message
              </label>
              <textarea
                rows={4}
                value={principal.speech}
                onChange={(e) => setPrincipal({ ...principal, speech: e.target.value })}
                placeholder="Enter the Principal's speech or address to students..."
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold text-white font-medium text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>


      {/* SECTION 2: MODERATORS (MODERATOR SPEECHES) */}
      <div className="bg-[#151515] rounded-3xl sm:rounded-[3.5rem] border border-white/5 shadow-2xl p-5 sm:p-8 md:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Quote className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">
                Moderators' Messages & Photos
              </h2>
              <p className="text-xs font-bold text-white/40">
                Club Faculty & Teacher Moderators of BAFSKMC
              </p>
            </div>
          </div>

          <button
            onClick={addModerator}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-black text-xs uppercase tracking-widest hover:bg-amber-400/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Moderator</span>
          </button>
        </div>

        {moderators.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl">
            <p className="text-white/40 text-sm font-bold">
              No moderator speeches added yet. Click 'Add Moderator' above.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {moderators.map((mod, index) => (
              <div
                key={mod.id || index}
                className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                    Moderator #{index + 1}
                  </span>
                  <button
                    onClick={() => removeModerator(index)}
                    className="flex items-center space-x-1.5 text-red-400 hover:text-red-300 text-xs font-bold px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4">
                    <FileUploadZone
                      type="image"
                      label="Moderator Photo"
                      initialUrl={mod.imageUrl}
                      onUploadComplete={(url) => updateModerator(index, "imageUrl", url)}
                    />
                  </div>


                  <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Name</label>
                        <input
                          type="text"
                          value={mod.name}
                          onChange={(e) => updateModerator(index, "name", e.target.value)}
                          placeholder="e.g. Md. Abdur Rahman"
                          className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm text-white outline-none focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Role Title</label>
                        <input
                          type="text"
                          value={mod.roleTitle}
                          onChange={(e) => updateModerator(index, "roleTitle", e.target.value)}
                          placeholder="e.g. Chief Moderator or Moderator"
                          className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm text-white outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="grad-cols-1">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Department / Subject</label>
                      <input
                         type="text"
                         value={mod.department || ""}
                         onChange={(e) => updateModerator(index, "department", e.target.value)}
                         placeholder="e.g. Department of Mathematics"
                         className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm text-white outline-none focus:border-gold"
                       />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Moderator's Speech / Guidance</label>
                      <textarea
                        rows={3}
                        value={mod.speech}
                        onChange={(e) => updateModerator(index, "speech", e.target.value)}
                        placeholder="Inspirational words for students..."
                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-sm text-white outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
