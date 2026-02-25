"use client";

import { useEffect, useState, use } from "react";
import MemberForm from "@/components/admin/MemberForm";
import { Loader2 } from "lucide-react";

export default function EditMemberPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
    const { id } = use(searchParams);
    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/members/${id}`)
                .then(res => res.json())
                .then(data => {
                    setMember(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-gold animate-spin" />
            </div>
        );
    }

    if (!member) {
        return <div className="text-white text-center py-20">Member not found</div>;
    }

    return <MemberForm initialData={member} />;
}
