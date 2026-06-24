import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    // Verify the payment belongs to the user and is in PENDING state
    const payment = await prisma.paymentRecord.findUnique({
      where: { id: paymentId }
    });

    if (!payment || payment.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Payment not found or unauthorized" }, { status: 404 });
    }

    if (payment.status !== "PENDING") {
      return NextResponse.json({ error: "Only PENDING payments can be requested" }, { status: 400 });
    }

    // Update the status to REQUESTED
    const updatedPayment = await prisma.paymentRecord.update({
      where: { id: paymentId },
      data: { status: "REQUESTED" }
    });

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error("Error requesting payout:", error);
    return NextResponse.json(
      { error: "Failed to request payout" },
      { status: 500 }
    );
  }
}
