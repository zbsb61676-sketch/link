import { prisma } from "@/lib/prisma";

export async function getUserListings(userId: string) {
  return prisma.accountListing.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteListing(id: string, userId: string) {
  const listing = await prisma.accountListing.findUnique({
    where: { id },
  });

  if (!listing) throw new Error("Listing not found");
  if (listing.ownerId !== userId) throw new Error("Unauthorized");
  if (listing.status === "RENTED") throw new Error("Cannot delete a rented account");

  return prisma.accountListing.delete({
    where: { id },
  });
}
