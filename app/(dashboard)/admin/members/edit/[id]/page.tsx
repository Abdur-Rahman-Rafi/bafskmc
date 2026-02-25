"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MemberForm from "@/components/admin/MemberForm";
import { Loader2 } from "lucide-react";

export default function EditMemberPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/members/${id}`)
            .then((res) => res.json())
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!data) return <div className="text-center py-20 font-bold text-slate-400">Member not found.</div>;

    return <MemberForm initialData={data} />;
}
