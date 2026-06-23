import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const listings = await prisma.accountListing.findMany({
      include: {
        owner: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (data.linkedinUrl) {
      const existingListing = await prisma.accountListing.findFirst({
        where: { linkedinUrl: data.linkedinUrl }
      });

      if (existingListing) {
        return NextResponse.json({ error: "An account with this LinkedIn URL has already been submitted." }, { status: 400 });
      }
    }
    
    const listing = await prisma.accountListing.create({
      data: {
        connections: parseInt(data.connections),
        accountAge: data.accountAge,
        location: data.location,
        price: parseFloat(data.price),
        linkedinUrl: data.linkedinUrl,
        whatsappNumber: data.whatsappNumber,
        ownerId: (session.user as any).id,
      }
    });

    // Notify the admin via email!
    import("@/lib/email").then(({ sendAdminNewListingEmail }) => {
      sendAdminNewListingEmail({
        name: session.user?.name || "User",
        email: session.user?.email || "",
        connections: listing.connections,
        linkedinUrl: listing.linkedinUrl || "",
      }).catch(console.error);
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Listing creation error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
