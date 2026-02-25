"use client";

import { useEffect, useState, use } from "react";
import ResourceForm from "@/components/admin/ResourceForm";
import { Loader2 } from "lucide-react";

export default function EditResourcePage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
    const { id } = use(searchParams);
    const [resource, setResource] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/resources/${id}`)
                .then(res => res.json())
                .then(data => {
                    setResource(data);
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

    if (!resource) {
        return <div className="text-white text-center py-20">Resource not found</div>;
    }

    return <ResourceForm initialData={resource} />;
}
