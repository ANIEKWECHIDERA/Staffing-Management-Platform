import { z } from "zod";
import { safeEmail } from "./common.js";

export const forgotPasswordSchema = z
  .object({
    email: safeEmail,
  })
  .strict();
