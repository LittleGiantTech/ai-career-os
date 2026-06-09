import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { calculateStreak } from "@/lib/mastery";
import type { User } from "@/generated/prisma/client";

export async function getOrCreateUser(): Promise<User> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (existing) {
    const { streak, lastActiveAt } = calculateStreak(
      existing.streak,
      existing.lastActiveAt
    );
    // Only write if something changed
    if (
      streak !== existing.streak ||
      lastActiveAt.getTime() !== existing.lastActiveAt?.getTime()
    ) {
      return prisma.user.update({
        where: { id: existing.id },
        data: { streak, lastActiveAt },
      });
    }
    return existing;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Clerk user not found");

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name =
    `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;

  try {
    return await prisma.user.create({
      data: { clerkId: userId, email, name, streak: 1, lastActiveAt: new Date() },
    });
  } catch (err) {
    // Concurrent first-login race: another request already created the record.
    // Re-fetch and return it rather than surfacing a P2002 to the user.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const retry = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (retry) return retry;
    }
    throw err;
  }
}
