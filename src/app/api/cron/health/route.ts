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
    let needsReviewCount = 0;

    // 3. Check health of each LinkedIn URL
    for (const rental of activeRentals) {
      if (!rental.listing.linkedinUrl) continue;
      
      checkedCount++;
      let healthStatus = "HEALTHY";
      
      try {
        const res = await fetch(rental.listing.linkedinUrl, { 
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        // 404 (Not Found) or 999 (LinkedIn Bot Protection) -> Flag for review
        if (res.status === 404 || res.status === 999) {
          healthStatus = "NEEDS_REVIEW";
          needsReviewCount++;
        }
      } catch (err) {
        console.error(`Failed to fetch URL ${rental.listing.linkedinUrl}:`, err);
        healthStatus = "NEEDS_REVIEW";
        needsReviewCount++;
      }
      
      // Update DB only if status changed
      if (rental.lastHealthStatus !== healthStatus) {
        await prisma.rental.update({
          where: { id: rental.id },
          data: { lastHealthStatus: healthStatus }
        });
      }
      
      // Delay slightly between requests to avoid IP bans from LinkedIn
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ 
      success: true, 
      checked: checkedCount, 
      needsReview: needsReviewCount 
    });

  } catch (error) {
    console.error("Cron health check error:", error);
    return NextResponse.json({ error: "Failed to run health check" }, { status: 500 });
  }
}
