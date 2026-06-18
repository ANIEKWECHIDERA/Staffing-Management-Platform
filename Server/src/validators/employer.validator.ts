import { z } from "zod";
import {
  optionalSafeEmail,
  safeFreeText,
  safeNameString,
  safePhone,
  safeTrimmedString,
} from "./common.js";

export const createEmployerSchema = z
  .object({
    name: safeNameString(),
    type: z.enum(["household", "business", "organization"]),
    primaryContactName: safeNameString().optional(),
    phone: safePhone,
    email: optionalSafeEmail,
    location: safeTrimmedString(2, 120).optional(),
    address: safeTrimmedString(5, 255).optional(),
    notes: safeFreeText(1000),
  })
  .strict();

export const updateEmployerSchema = createEmployerSchema.partial().strict();
