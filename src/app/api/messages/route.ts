import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let otherUserId = searchParams.get("userId");
    const currentUserId = (session.user as any).id;
    const role = (session.user as any).role;

    if (!otherUserId) {
      if (role === "ADMIN") {
        return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
      } else {
        // Find the admin user
        const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (!adminUser) {
          return NextResponse.json({ error: "No admin found to message" }, { status: 404 });
        }
        otherUserId = adminUser.id;
      }
    }

    // Admins can message anyone. Renters can only message admins.
    // If a renter is querying, they must be querying an admin.
    if (role !== "ADMIN") {
      const targetUser = await prisma.user.findUnique({ where: { id: otherUserId } });
      if (!targetUser || targetUser.role !== "ADMIN") {
         return NextResponse.json({ error: "You can only message the admin" }, { status: 403 });
      }
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ]
      },
      orderBy: { createdAt: "asc" }
    });

    // Mark messages as read if the current user is the receiver
    const unreadMessageIds = messages
      .filter((m) => m.receiverId === currentUserId && !m.read)
      .map((m) => m.id);

    if (unreadMessageIds.length > 0) {
      await prisma.message.updateMany({
        where: { id: { in: unreadMessageIds } },
        data: { read: true }
      });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const currentUserId = (session.user as any).id;
    const role = (session.user as any).role;

    let receiverId = data.receiverId;

    if (!receiverId) {
      if (role === "ADMIN") {
        return NextResponse.json({ error: "Missing receiverId" }, { status: 400 });
      } else {
        const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (!adminUser) return NextResponse.json({ error: "No admin found" }, { status: 404 });
        receiverId = adminUser.id;
      }
    }

    if (!data.content && !data.imageUrl) {
      return NextResponse.json({ error: "Missing content or image" }, { status: 400 });
    }

    if (role !== "ADMIN") {
      const targetUser = await prisma.user.findUnique({ where: { id: receiverId } });
      if (!targetUser || targetUser.role !== "ADMIN") {
         return NextResponse.json({ error: "You can only message the admin" }, { status: 403 });
      }
    }

    const message = await prisma.message.create({
      data: {
        senderId: currentUserId,
        receiverId: receiverId,
        content: data.content || "",
        imageUrl: data.imageUrl || null,
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
