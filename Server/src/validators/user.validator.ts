import { z } from "zod";
import { safeEmail, safeNameString } from "./common.js";

export const createUserSchema = z
  .object({
    fullName: safeNameString(),
    email: safeEmail,
    role: z.enum(["owner", "staff"]).default("staff"),
    sendInvite: z.boolean().default(true),
    password: z.string().trim().min(8).max(128).optional(),
    emailConfirm: z.boolean().default(false),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!value.sendInvite && !value.password) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password is required when sendInvite is false",
      });
    }
  });
