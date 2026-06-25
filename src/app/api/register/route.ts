import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const disposableDomains = [
      "mailinator.com", "yopmail.com", "tempmail.com", "10minutemail.com", 
      "guerrillamail.com", "sharklasers.com", "throwawaymail.com", "temp-mail.org",
      "fakemail.net", "trashmail.com"
    ];

    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json({ error: "Disposable email addresses are not allowed for security reasons." }, { status: 400 });
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

    const token = crypto.randomUUID();
    
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
    console.error("================ REGISTRATION ERROR ================");
    console.error(error);
    console.error("====================================================");
    
    const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
    
    return NextResponse.json({ 
      error: `Registration failed: ${errorMessage}`
    }, { status: 500 });
  }
}
