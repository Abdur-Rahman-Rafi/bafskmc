"use client";

import { useEffect, useState, use } from "react";
import BadgeForm from "@/components/admin/BadgeForm";
import { Loader2 } from "lucide-react";

export default function EditBadgePage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
    const { id } = use(searchParams);
    const [badge, setBadge] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/achievements/${id}`)
                .then(res => res.json())
                .then(data => {
                    setBadge(data);
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

    if (!badge) {
        return <div className="text-white text-center py-20">Badge not found</div>;
    }

    return <BadgeForm initialData={badge} />;
}
