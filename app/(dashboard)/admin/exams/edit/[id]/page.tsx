"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ExamForm from "@/components/admin/ExamForm";
import { Loader2 } from "lucide-react";


export default function EditExamPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/exams/${id}`)
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
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    if (!data) return <div className="text-center py-20 font-bold text-slate-400">Exam not found.</div>;

    return <ExamForm initialData={data} />;
}
