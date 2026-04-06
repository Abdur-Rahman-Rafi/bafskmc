import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const formData = await req.formData();
        const isPublic = formData.get("isPublic") === "true";

        if (!session?.user?.id && !isPublic) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
        }

        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            console.error("Vercel Blob token is missing! BLOB_READ_WRITE_TOKEN must be in .env");
            return NextResponse.json({ error: "Vercel Blob Token missing." }, { status: 500 });
        }

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: "public", // This makes the file readable via its URL
        });

        return NextResponse.json({
            url: blob.url,
            name: file.name,
            size: file.size,
            type: file.type
        });
    } catch (error: any) {
        console.error("Upload error details:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
