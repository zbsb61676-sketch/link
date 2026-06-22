import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = (session.user as any).id;

    // Get all users the admin has messaged or received messages from
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId }
        ]
      },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
        receiver: { select: { id: true, name: true, email: true, image: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      // Determine the other user in the conversation
      const otherUser = msg.senderId === currentUserId ? msg.receiver : msg.sender;
      
      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // If the message was sent to the admin and is unread, increment count
      if (msg.receiverId === currentUserId && !msg.read) {
        conversationsMap.get(otherUser.id).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Fetch conversations error:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
