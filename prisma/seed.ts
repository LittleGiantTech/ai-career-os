import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const clerkId = process.env.SEED_CLERK_ID;
  if (!clerkId) {
    console.error("Set SEED_CLERK_ID in .env.local to seed a user's sprint.");
    process.exit(1);
  }

  let user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    user = await prisma.user.create({
      data: { clerkId, email: "seed@example.com", name: "Seed User" },
    });
  }

  // Deactivate any existing active sprints
  await prisma.sprint.updateMany({
    where: { userId: user.id, isActive: true },
    data: { isActive: false },
  });

  // Remove any existing sprint for this stage so we can re-seed
  await prisma.sprint.deleteMany({
    where: { userId: user.id, stageKey: "python-basics" },
  });

  const sprint = await prisma.sprint.create({
    data: {
      userId: user.id,
      stageKey: "python-basics",
      stageNumber: 7,
      chapterNumber: 2,
      title: "Python Basics",
      goal: "Build a correct mental model of how Python handles types, values, and expressions.",
      durationDays: 4,
      isActive: true,
      projectTitle: null,
      completionCriteria: "All six tasks practiced | Both challenges working | AI interview passed at 85%+",
      tasks: {
        create: [
          { type: "TASK",      title: "Python environment setup",  order: 0 },
          { type: "TASK",      title: "Variables and types",        order: 1 },
          { type: "TASK",      title: "String operations",          order: 2 },
          { type: "TASK",      title: "Operators",                  order: 3 },
          { type: "TASK",      title: "Input and output",           order: 4 },
          { type: "TASK",      title: "The Python REPL",            order: 5 },
          { type: "CHALLENGE", title: "String Transformer",         order: 6 },
          { type: "CHALLENGE", title: "Type Detective",             order: 7 },
        ],
      },
    },
  });

  console.log(`Seeded sprint: ${sprint.title} (Stage ${sprint.stageNumber}) for user ${user.clerkId}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
