import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentRequestedEmail } from "@/lib/email";

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

    const payment = await prisma.paymentRecord.findUnique({
      where: { id: paymentId },
      include: { user: true }
    });

    if (!payment || payment.userId !== (session.user as any).id || payment.status !== "PENDING") {
      return NextResponse.json({ error: "Payment not found, unauthorized, or not in PENDING state" }, { status: 400 });
    }

    // Atomically update the status to REQUESTED only if it is currently PENDING
    // This prevents race conditions where double-clicks could send multiple requests
    const updateResult = await prisma.paymentRecord.updateMany({
      where: { 
        id: paymentId,
        userId: (session.user as any).id,
        status: "PENDING"
      },
      data: { status: "REQUESTED" }
    });

    if (updateResult.count === 0) {
      return NextResponse.json({ error: "Failed to request payment. It may have already been processed." }, { status: 400 });
    }

    if (payment.user && payment.user.email) {
      await sendPaymentRequestedEmail(payment.user.email, payment.user.name || "User", payment.amount);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error requesting payout:", error);
    return NextResponse.json(
      { error: "Failed to request payout" },
      { status: 500 }
    );
  }
}
