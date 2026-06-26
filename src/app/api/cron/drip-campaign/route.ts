import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDripEmail } from "@/lib/email";

// Vercel Cron jobs must be GET requests
export async function GET(req: Request) {
  try {
    // 1. Calculate the time window: 24 hours ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 2. Find all users who:
    //    - Signed up before `oneDayAgo`
    //    - Have no listings (listings: { none: {} })
    //    - Have not received a drip email yet
    const dormantUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          lte: oneDayAgo,
        },
        hasReceivedDripEmail: false,
        listings: {
          none: {}
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
      // Limit to 50 users per run to avoid Vercel Function timeout (10-15s limit on Hobby tier)
      // and to avoid Gmail rate limits.
      take: 50,
    });

    console.log(`Found ${dormantUsers.length} dormant users to email.`);

    let emailsSent = 0;

    // 3. Loop through and send emails
    for (const user of dormantUsers) {
      if (user.email) {
        try {
          await sendDripEmail(user.email, user.name || "there");
          
          // Mark as received so we don't spam them again tomorrow
          await prisma.user.update({
            where: { id: user.id },
            data: { hasReceivedDripEmail: true },
          });
          
          emailsSent++;
        } catch (emailError) {
          console.error(`Failed to send drip email to ${user.email}:`, emailError);
          // We don't mark them as received here, so the cron can try again next time.
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Drip campaign ran successfully. Sent ${emailsSent} emails.`,
    });

  } catch (error) {
    console.error("Drip campaign cron error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run drip campaign" },
      { status: 500 }
    );
  }
}
