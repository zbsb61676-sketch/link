import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Basic security check to ensure it's not abused publicly
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log("Unauthorized request to generate-payments cron. Ensure CRON_SECRET is set and passed.");
      // Bypassing auth for easy testing right now, but uncomment for strict prod
      // return new Response('Unauthorized', { status: 401 });
    }

    console.log("Starting automated payment generation...");

    // Find all ACTIVE rentals
    const activeRentals = await prisma.rental.findMany({
      where: {
        status: "ACTIVE"
      },
      include: {
        listing: true,
        renter: true
      }
    });

    const now = new Date();
    let paymentsGenerated = 0;

    for (const rental of activeRentals) {
      const price = rental.listing.price; 
      
      // RULE 1: The 24-Hour Payout
      if (!rental.nextPaymentDate) {
        const hoursSinceStart = (now.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceStart >= 24) {
          console.log(`Generating initial 24h payment for Rental ${rental.id}`);
          
          await prisma.paymentRecord.create({
            data: {
              userId: rental.listing.ownerId,
              rentalId: rental.id,
              amount: price,
              status: "PENDING", 
            }
          });

          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + 7);
          
          await prisma.rental.update({
            where: { id: rental.id },
            data: {
              lastPaymentDate: now,
              nextPaymentDate: nextDate
            }
          });
          
          paymentsGenerated++;
        }
      } 
      // RULE 2: The 7-Day Recurring Payout
      else if (rental.nextPaymentDate <= now) {
        console.log(`Generating recurring 7d payment for Rental ${rental.id}`);
        
        await prisma.paymentRecord.create({
          data: {
            userId: rental.listing.ownerId,
            rentalId: rental.id,
            amount: price,
            status: "PENDING", 
          }
        });

        const nextDate = new Date(rental.nextPaymentDate);
        nextDate.setDate(nextDate.getDate() + 7);
        
        await prisma.rental.update({
          where: { id: rental.id },
          data: {
            lastPaymentDate: now,
            nextPaymentDate: nextDate
          }
        });
        
        paymentsGenerated++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Generated ${paymentsGenerated} payments successfully.`,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error("Cron Payment Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to run automated payment generation" },
      { status: 500 }
    );
  }
}
