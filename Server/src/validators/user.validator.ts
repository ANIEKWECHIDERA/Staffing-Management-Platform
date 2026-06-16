import { z } from "zod";

export const createUserSchema = z.object({
  supabaseUserId: z.string().min(1),
  fullName: z.string().min(2),
  email: z.email(),
  role: z.enum(["owner", "staff"]).default("staff"),
});
