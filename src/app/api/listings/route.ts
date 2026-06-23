import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as z from "zod";
import { getUserListings } from "@/lib/services/listings";

const listingSchema = z.object({
  connections: z.string().min(1).regex(/^\d+$/),
  accountAge: z.string().min(1).refine(val => val !== "Less than 1 year", "Account must be at least 1 year old to list"),
  location: z.string().min(2),
  whatsappNumber: z.string().min(5),
  linkedinUrl: z.string().url(),
  price: z.string().min(1).regex(/^\d+(\.\d{1,2})?$/),
  verificationCode: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const listings = await getUserListings(userId);
    
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

    const rawData = await req.json();
    const result = listingSchema.safeParse(rawData);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    
    const data = result.data;

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
        verificationCode: data.verificationCode,
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
