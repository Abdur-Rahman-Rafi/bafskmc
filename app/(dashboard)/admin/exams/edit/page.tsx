"use client";

import { useEffect, useState, use } from "react";
import ExamForm from "@/components/admin/ExamForm";
import { Loader2 } from "lucide-react";

export default function EditExamPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
    const { id } = use(searchParams);
    const [exam, setExam] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/exams/${id}`)
                .then(res => res.json())
                .then(data => {
                    setExam(data);
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

    if (!exam) {
        return <div className="text-white text-center py-20">Exam not found</div>;
    }

    return <ExamForm initialData={exam} />;
}
