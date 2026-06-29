import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch recent completed payments
    const recentPayments = await prisma.paymentRecord.findMany({
      where: { status: "COMPLETED" },
      orderBy: { paymentDate: "desc" },
      take: 5,
      include: {
        user: { select: { name: true } }
      }
    });

    // Fetch recent listings
    const recentListings = await prisma.accountListing.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        owner: { select: { name: true } }
      }
    });

    const events: any[] = [];

    recentPayments.forEach(p => {
      if (p.user.name) {
        events.push({
          name: p.user.name.split(" ")[0], // First name only for privacy
          location: "India", // Default fallback
          action: "received a payout",
          amount: `₹${p.amount}`,
          icon: "dollar",
          date: p.paymentDate
        });
      }
    });

    recentListings.forEach(l => {
      if (l.owner.name) {
        events.push({
          name: l.owner.name.split(" ")[0], // First name only
          location: "India", 
          action: "just listed an account",
          amount: null,
          icon: "shield",
          date: l.createdAt
        });
      }
    });

    // Sort combined events by date descending
    events.sort((a, b) => b.date.getTime() - a.date.getTime());

    // We only want to send non-sensitive frontend fields
    const formattedEvents = events.map(e => ({
      name: e.name,
      location: e.location,
      action: e.action,
      amount: e.amount,
      icon: e.icon
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error("Error fetching live notifications:", error);
    return NextResponse.json({ events: [] }, { status: 500 });
  }
}
