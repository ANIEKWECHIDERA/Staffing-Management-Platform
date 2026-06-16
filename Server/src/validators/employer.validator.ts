import { z } from "zod";

export const createEmployerSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["household", "business", "organization"]),
  primaryContactName: z.string().optional(),
  phone: z.string().min(7),
  email: z.email().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export const updateEmployerSchema = createEmployerSchema.partial();
