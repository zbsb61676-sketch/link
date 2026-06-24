import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // 1. Verify Vercel Cron Secret to prevent unauthorized access
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch all active rentals
    const activeRentals = await prisma.rental.findMany({
      where: { status: "ACTIVE" },
      include: {
        listing: true,
      }
    });

    let checkedCount = 0;
    let pausedCount = 0;

    // 3. Check health of each LinkedIn URL
    for (const rental of activeRentals) {
      if (!rental.listing.linkedinUrl) continue;
      
      checkedCount++;
      
      try {
        // LinkedIn aggressively blocks bots. We just do a lightweight fetch to check for 404.
        // It might redirect (302) to authwall (200), or return 999. We ONLY care if it's 404 (deleted/banned).
        const res = await fetch(rental.listing.linkedinUrl, { 
          method: 'GET',
          headers: {
            // Spoof user agent slightly to avoid immediate 999
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        if (res.status === 404) {
          // Account is dead. Pause it and create dispute.
          await prisma.$transaction([
            prisma.accountListing.update({
              where: { id: rental.listingId },
              data: { status: "PAUSED" }
            }),
            prisma.dispute.create({
              data: {
                rentalId: rental.id,
                reason: "Automated Health Check Failed: LinkedIn profile URL returned 404 Not Found. Account may be restricted or deleted.",
                reporterId: rental.renterId // Assumed Renter is the reporter of the automated issue for simplicity
              }
            })
          ]);
          pausedCount++;
        }
      } catch (err) {
        console.error(`Failed to fetch URL ${rental.listing.linkedinUrl}:`, err);
        // Do not pause on fetch network errors to avoid false positives
      }
      
      // Delay slightly between requests to avoid IP bans from LinkedIn
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ 
      success: true, 
      checked: checkedCount, 
      paused: pausedCount 
    });

  } catch (error) {
    console.error("Cron health check error:", error);
    return NextResponse.json({ error: "Failed to run health check" }, { status: 500 });
  }
}
