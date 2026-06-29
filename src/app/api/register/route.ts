import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password, whatsappNumber } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const emailDomain = sanitizedEmail.split("@")[1];

    if (!emailDomain) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    if (name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: "Name must be between 2 and 50 characters" }, { status: 400 });
    }

    // Sanitize name (basic)
    const sanitizedName = name.trim().replace(/[<>]/g, '');
    
    // Sanitize whatsappNumber
    const sanitizedWhatsapp = whatsappNumber ? whatsappNumber.trim().replace(/[<>]/g, '') : null;

    const disposableDomains = [
      "mailinator.com", "yopmail.com", "tempmail.com", "10minutemail.com", 
      "guerrillamail.com", "sharklasers.com", "throwawaymail.com", "temp-mail.org",
      "fakemail.net", "trashmail.com", "getnada.com", "dropmail.me", "maildrop.cc",
      "dispostable.com", "nada.ltd"
    ];

    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json({ error: "Disposable email addresses are not allowed for security reasons." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        whatsappNumber: sanitizedWhatsapp,
      },
    });

    const token = crypto.randomUUID();
    
    await prisma.verificationToken.create({
      data: {
        identifier: sanitizedEmail,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }
    });

    // Send verification email
    const { sendVerificationEmail } = await import("@/lib/email");
    await sendVerificationEmail(sanitizedEmail, token);

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
