"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import type { ParkingLotCategory } from "@/generated/prisma/client";

const VALID_CATEGORIES: ParkingLotCategory[] = [
  "TOOL",
  "FRAMEWORK",
  "CONCEPT",
  "TECHNOLOGY",
  "OTHER",
];

export async function addParkingLotItem(formData: FormData): Promise<void> {
  const user = await getOrCreateUser();

  const title = formData.get("title")?.toString().trim() ?? "";
  if (!title) return;

  const description = formData.get("description")?.toString().trim() || null;
  const rawCategory = formData.get("category")?.toString() ?? "OTHER";
  const category: ParkingLotCategory = VALID_CATEGORIES.includes(
    rawCategory as ParkingLotCategory
  )
    ? (rawCategory as ParkingLotCategory)
    : "OTHER";

  await prisma.parkingLotItem.create({
    data: { userId: user.id, title, description, category },
  });

  revalidatePath("/parking-lot");
}

export async function deleteParkingLotItem(itemId: string): Promise<void> {
  const user = await getOrCreateUser();

  const item = await prisma.parkingLotItem.findUnique({
    where: { id: itemId },
    select: { userId: true },
  });

  if (!item || item.userId !== user.id) return;

  await prisma.parkingLotItem.delete({ where: { id: itemId } });

  revalidatePath("/parking-lot");
}
