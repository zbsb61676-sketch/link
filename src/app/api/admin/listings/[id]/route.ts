import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAccountStatusUpdateEmail } from "@/lib/email";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    if (!["AVAILABLE", "RENTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedListing = await prisma.accountListing.update({
      where: { id },
      data: { status },
      include: { owner: { select: { name: true, email: true } } },
    });
    
    // Fire off the email notification asynchronously
    sendAccountStatusUpdateEmail(
      updatedListing.owner.email as string, 
      updatedListing.owner.name as string, 
      status
    ).catch(console.error);

    return NextResponse.json({ listing: updatedListing });
  } catch (error) {
    console.error("Error updating listing status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
