import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  role: z.enum(["owner", "staff"]).default("staff"),
  sendInvite: z.boolean().default(true),
  password: z.string().min(8).optional(),
  emailConfirm: z.boolean().default(false),
}).superRefine((value, ctx) => {
  if (!value.sendInvite && !value.password) {
    ctx.addIssue({
      code: "custom",
      path: ["password"],
      message: "Password is required when sendInvite is false",
    });
  }
});
