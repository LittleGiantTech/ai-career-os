"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleTask(taskId: string, currentState: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const task = await prisma.sprintTask.findUnique({
    where: { id: taskId },
    include: { sprint: { select: { userId: true } } },
  });

  if (!task) throw new Error("Task not found");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || task.sprint.userId !== user.id) throw new Error("Unauthorized");

  await prisma.sprintTask.update({
    where: { id: taskId },
    data: {
      isComplete: !currentState,
      completedAt: !currentState ? new Date() : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/sprint");
}
