import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const {
            name, email, password,
            studentClass, section, roll, phone
        } = await req.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { error: "Name, email, password and phone are required" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "STUDENT",
                class: studentClass || null,
                section: section || null,
                roll: roll || null,
                phone,
                paymentStatus: "PENDING",
                hasLoggedInBefore: false,
            },
        });

        return NextResponse.json(
            { message: "Registration successful! You can now log in.", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Something went wrong during registration" },
            { status: 500 }
        );
    }
}
