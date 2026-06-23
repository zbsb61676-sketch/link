import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }
    });

    // Send verification email
    const { sendVerificationEmail } = await import("@/lib/email");
    await sendVerificationEmail(email, token);

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
