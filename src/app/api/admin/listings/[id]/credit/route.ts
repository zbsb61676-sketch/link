import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await request.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const listing = await prisma.accountListing.findUnique({
      where: { id: params.id },
      include: { rentals: { where: { status: 'ACTIVE' } } }
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const activeRental = listing.rentals[0];

    // Create the payment record
    const payment = await prisma.paymentRecord.create({
      data: {
        userId: listing.ownerId,
        rentalId: activeRental?.id, // Optional, can be null if they want to credit an available account
        amount: amount,
        status: "PENDING",
      }
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Error crediting user:", error);
    return NextResponse.json(
      { error: "Failed to credit user" },
      { status: 500 }
    );
  }
}
