import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, amount, reference } = await request.json();

    if (!userId || amount === undefined || amount === null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + 7);

    const payment = await prisma.paymentRecord.create({
      data: {
        userId,
        amount: parsedAmount,
        reference: reference || null,
        status: "PENDING",
        releaseDate: releaseDate,
      },
    });

    return NextResponse.json({ payment });
  } catch (error) {
    console.error("Error creating payment record:", error);
    return NextResponse.json(
      { error: "Failed to create payment record" },
      { status: 500 }
    );
  }
}
