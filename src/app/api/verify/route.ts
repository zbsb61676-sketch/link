import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const pendingUser = await prisma.pendingUser.findUnique({
      where: { token },
    });

    if (!pendingUser) {
      // Also check standard VerificationToken just in case there are old tokens
      const oldToken = await prisma.verificationToken.findUnique({ where: { token } });
      if (oldToken) {
        if (oldToken.expires < new Date()) {
          await prisma.verificationToken.delete({ where: { token } });
          return NextResponse.json({ error: "Token has expired. Please sign up again." }, { status: 400 });
        }
        await prisma.user.update({
          where: { email: oldToken.identifier },
          data: { emailVerified: new Date() },
        });
        await prisma.verificationToken.delete({ where: { token } });
        return NextResponse.json({ success: true }, { status: 200 });
      }

      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (pendingUser.expires < new Date()) {
      await prisma.pendingUser.delete({ where: { token } });
      return NextResponse.json({ error: "Token has expired. Please sign up again." }, { status: 400 });
    }

    // Check if user already exists somehow
    const existingUser = await prisma.user.findUnique({
      where: { email: pendingUser.email }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: pendingUser.name,
          email: pendingUser.email,
          password: pendingUser.password,
          whatsappNumber: pendingUser.whatsappNumber,
          emailVerified: new Date(),
        }
      });
    }

    await prisma.pendingUser.delete({
      where: { token },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
