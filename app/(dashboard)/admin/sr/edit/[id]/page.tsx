"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SRForm from "@/components/admin/SRForm";
import { Loader2 } from "lucide-react";
import { SectionRep } from "@/app/api/sr/route";

export default function EditSRPage() {
    const params = useParams();
    const id = typeof params?.id === "string" ? params.id : params?.id?.[0];
    const [sr, setSr] = useState<SectionRep | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/sr/${id}`, { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.error) {
                    setSr(data);
                } else {
                    setSr(null);
                }
                setLoading(false);
            })
            .catch(() => {
                setSr(null);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    Loading Section Representative Dossier...
                </p>
            </div>
        );
    }

    if (!sr) {
        return (
            <div className="text-center py-24 text-white/40">
                <p className="font-bold">Section Representative profile could not be retrieved.</p>
            </div>
        );
    }

    return <SRForm initialData={sr} />;
}
