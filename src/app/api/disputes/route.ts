import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const disputes = await prisma.dispute.findMany({
      include: {
        reporter: {
          select: { id: true, name: true, email: true }
        },
        rental: {
          include: {
            listing: {
              include: {
                owner: {
                  select: { id: true, name: true, email: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(disputes);
  } catch (error) {
    console.error("Error fetching disputes:", error);
    return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rentalId, reason } = await req.json();

    if (!rentalId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify the reporter is associated with the rental (IDOR fix)
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: { listing: true }
    });

    if (!rental) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 });
    }

    const currentUserId = (session.user as any).id;
    if (rental.renterId !== currentUserId && rental.listing.ownerId !== currentUserId) {
      return NextResponse.json({ error: "You are not authorized to dispute this rental" }, { status: 403 });
    }

    const dispute = await prisma.dispute.create({
      data: {
        rentalId,
        reason,
        reporterId: currentUserId,
      },
    });

    if (rental) {
      await prisma.accountListing.update({
        where: { id: rental.listingId },
        data: { status: "PAUSED" }
      });
    }

    return NextResponse.json(dispute, { status: 201 });
  } catch (error) {
    console.error("Error creating dispute:", error);
    return NextResponse.json({ error: "Failed to create dispute" }, { status: 500 });
  }
}
