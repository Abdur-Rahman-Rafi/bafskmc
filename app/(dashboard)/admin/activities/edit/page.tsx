"use client";

import { useEffect, useState, use } from "react";
import ActivityForm from "@/components/admin/ActivityForm";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditActivityPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/activities/${id}`)
            .then(res => res.json())
            .then(data => {
                setActivity(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 text-gold animate-spin" />
        </div>
    );

    if (!activity) return <div>Activity not found</div>;

    return <ActivityForm initialData={activity} />;
}
