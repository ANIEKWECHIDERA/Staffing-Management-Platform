import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { supabaseAdmin } from "../lib/supabase.js";
import { AppError } from "../utils/app-error.js";
import { createUserSchema } from "../validators/user.validator.js";
import { createAuditLog } from "../utils/audit-log.js";

export const listUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res.json({ data: users });
};

export const createUser = async (req: Request, res: Response) => {
  const payload = createUserSchema.parse(req.body);

  const authResponse = payload.sendInvite
    ? await supabaseAdmin.auth.admin.inviteUserByEmail(payload.email, {
        data: {
          full_name: payload.fullName,
          app_role: payload.role,
        },
        redirectTo: `${env.FRONTEND_URL}/login`,
      })
    : await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: payload.emailConfirm,
        user_metadata: {
          full_name: payload.fullName,
        },
        app_metadata: {
          app_role: payload.role,
        },
      });

  if (authResponse.error || !authResponse.data.user) {
    throw new AppError(authResponse.error?.message ?? "Failed to create Supabase auth user", 400);
  }

  const authUser = authResponse.data.user;

  const user = await prisma.user.upsert({
    where: { supabaseUserId: authUser.id },
    create: {
      supabaseUserId: authUser.id,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
      isActive: true,
    },
    update: {
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
      isActive: true,
    },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "user",
    entityId: user.id,
    action: "create_user",
    changesJson: {
      email: payload.email,
      role: payload.role,
      sendInvite: payload.sendInvite,
      authUserId: authUser.id,
    },
  });

  return res.status(201).json({
    data: {
      ...user,
      authUserId: authUser.id,
      invited: payload.sendInvite,
    },
  });
};

export const deactivateUser = async (req: Request, res: Response) => {
  const userId = String(req.params.id);

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  const authResponse = await supabaseAdmin.auth.admin.updateUserById(existingUser.supabaseUserId, {
    ban_duration: "876000h",
    app_metadata: {
      deactivated: true,
      app_role: existingUser.role,
    },
  });

  if (authResponse.error) {
    throw new AppError(authResponse.error.message, 400);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "user",
    entityId: user.id,
    action: "deactivate_user",
    changesJson: {
      authUserId: existingUser.supabaseUserId,
      banned: true,
    },
  });

  return res.json({ data: user });
};
