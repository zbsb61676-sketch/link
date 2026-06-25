import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const settingsSchema = z.object({
  paypalEmail: z.string().email().optional().or(z.literal("")),
  bankDetails: z.string().optional(),
  upiId: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: {
        paypalEmail: true,
        bankDetails: true,
        upiId: true,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawData = await request.json();
    const result = settingsSchema.safeParse(rawData);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    
    const { paypalEmail, bankDetails, upiId } = result.data;

    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        paypalEmail: paypalEmail || null,
        bankDetails: bankDetails || null,
        upiId: upiId || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        paypalEmail: true,
        bankDetails: true,
        upiId: true,
        role: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
