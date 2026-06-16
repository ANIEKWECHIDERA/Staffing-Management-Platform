import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "@prisma/client";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SEED_OWNER_SUPABASE_USER_ID: z.string().min(1),
  SEED_OWNER_EMAIL: z.email(),
  SEED_OWNER_NAME: z.string().min(2),
  SEED_STAFF_SUPABASE_USER_ID: z.string().min(1).optional(),
  SEED_STAFF_EMAIL: z.email().optional(),
  SEED_STAFF_NAME: z.string().min(2).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Seed env validation failed", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const adapter = new PrismaPg({
  connectionString: parsed.data.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function upsertAppUser(input: {
  supabaseUserId: string;
  email: string;
  fullName: string;
  role: UserRole;
}) {
  return prisma.user.upsert({
    where: { supabaseUserId: input.supabaseUserId },
    create: {
      supabaseUserId: input.supabaseUserId,
      email: input.email,
      fullName: input.fullName,
      role: input.role,
      isActive: true,
    },
    update: {
      email: input.email,
      fullName: input.fullName,
      role: input.role,
      isActive: true,
    },
  });
}

async function main() {
  const owner = await upsertAppUser({
    supabaseUserId: parsed.data.SEED_OWNER_SUPABASE_USER_ID,
    email: parsed.data.SEED_OWNER_EMAIL,
    fullName: parsed.data.SEED_OWNER_NAME,
    role: UserRole.owner,
  });

  console.log(`Seeded owner app user: ${owner.email}`);

  if (
    parsed.data.SEED_STAFF_SUPABASE_USER_ID &&
    parsed.data.SEED_STAFF_EMAIL &&
    parsed.data.SEED_STAFF_NAME
  ) {
    const staff = await upsertAppUser({
      supabaseUserId: parsed.data.SEED_STAFF_SUPABASE_USER_ID,
      email: parsed.data.SEED_STAFF_EMAIL,
      fullName: parsed.data.SEED_STAFF_NAME,
      role: UserRole.staff,
    });

    console.log(`Seeded staff app user: ${staff.email}`);
  }
}

main()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
