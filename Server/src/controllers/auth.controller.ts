import type { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { createAuditLog } from "../utils/audit-log.js";

const resolveRoleFromEmail = (email?: string) => {
  if (!email) {
    return UserRole.staff;
  }

  return env.ownerEmails.includes(email.toLowerCase()) ? UserRole.owner : UserRole.staff;
};

export const syncUser = async (req: Request, res: Response) => {
  const auth = req.auth;
  if (!auth?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const fullName =
    (typeof auth.user_metadata === "object" &&
    auth.user_metadata &&
    "full_name" in auth.user_metadata &&
    typeof auth.user_metadata.full_name === "string"
      ? auth.user_metadata.full_name
      : undefined) ?? req.body?.fullName ?? "SkillBridge User";

  const email = auth.email ?? req.body?.email;
  if (!email) {
    return res.status(400).json({ message: "Authenticated email is required" });
  }

  const role = resolveRoleFromEmail(email);

  const user = await prisma.user.upsert({
    where: { supabaseUserId: auth.sub },
    create: {
      supabaseUserId: auth.sub,
      fullName,
      email,
      role,
    },
    update: {
      fullName,
      email,
    },
  });

  await createAuditLog({
    userId: user.id,
    entityType: "user",
    entityId: user.id,
    action: "sync_user",
    changesJson: { email: user.email, role: user.role },
  });

  return res.json({ data: user });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  return res.json({ data: req.currentUser });
};
