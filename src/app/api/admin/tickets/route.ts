import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "OPEN";

    const tickets = await prisma.ticket.findMany({
      where: status === "ALL" ? {} : { status },
      orderBy: { updatedAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { replies: true } }
      }
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Error fetching admin tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
