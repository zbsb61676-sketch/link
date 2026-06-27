import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentCompletedEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentIds, status } = await request.json();

    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0 || !status) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "REQUESTED", "VERIFIED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const existingPayments = await prisma.paymentRecord.findMany({
      where: {
        id: { in: paymentIds }
      },
      select: { id: true }
    });

    if (existingPayments.length === 0) {
      return NextResponse.json({ error: "No matching payments found" }, { status: 404 });
    }

    const updatedPayments = await prisma.paymentRecord.updateMany({
      where: {
        id: { in: paymentIds }
      },
      data: {
        status: status
      }
    });

    if (status === "COMPLETED") {
      const payments = await prisma.paymentRecord.findMany({
        where: { id: { in: paymentIds } },
        include: { user: true }
      });
      for (const p of payments) {
        if (p.user && p.user.email) {
          await sendPaymentCompletedEmail(p.user.email, p.user.name || "User", p.amount);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      updatedCount: updatedPayments.count 
    });
  } catch (error) {
    console.error("Error bulk updating payments:", error);
    return NextResponse.json(
      { error: "Failed to update payments" },
      { status: 500 }
    );
  }
}
