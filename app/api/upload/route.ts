import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), "public", "uploads");

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        const ext = file.name.split(".").pop() || "bin";
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const filename = `${Date.now()}-${safeName}`;
        const path = join(uploadDir, filename);

        await writeFile(path, buffer);

        const url = `/uploads/${filename}`;
        return NextResponse.json({ url, name: file.name, size: file.size, type: file.type });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
