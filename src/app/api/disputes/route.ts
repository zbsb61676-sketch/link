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
        reporter: true,
        rental: {
          include: {
            listing: {
              include: {
                owner: true,
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

    const dispute = await prisma.dispute.create({
      data: {
        rentalId,
        reason,
        reporterId: (session.user as any).id,
      },
    });

    // Automatically pause the listing to prevent further fraud
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      select: { listingId: true }
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
