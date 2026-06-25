import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
    
    const { id } = await params;

    const listing = await prisma.accountListing.findUnique({
      where: { id: id },
      include: { rentals: { where: { status: 'ACTIVE' } } }
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const activeRental = listing.rentals[0];

    // Create the payment record and update the rental
    const [payment] = await prisma.$transaction([
      prisma.paymentRecord.create({
        data: {
          userId: listing.ownerId,
          rentalId: activeRental?.id, 
          amount: amount,
          status: "PENDING",
        }
      }),
      ...(activeRental ? [
        prisma.rental.update({
          where: { id: activeRental.id },
          data: { lastPaymentDate: new Date() }
        })
      ] : [])
    ]);

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Error crediting user:", error);
    return NextResponse.json(
      { error: "Failed to credit user" },
      { status: 500 }
    );
  }
}
