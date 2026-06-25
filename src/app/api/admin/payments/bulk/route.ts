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

    const { paymentIds, status } = await request.json();

    if (!paymentIds || !Array.isArray(paymentIds) || !status) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "REQUESTED", "VERIFIED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updatedPayments = await prisma.paymentRecord.updateMany({
      where: {
        id: { in: paymentIds }
      },
      data: {
        status: status
      }
    });

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
