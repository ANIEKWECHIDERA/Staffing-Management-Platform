import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
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

  const user = await prisma.user.create({
    data: payload,
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "user",
    entityId: user.id,
    action: "create_user",
    changesJson: payload,
  });

  return res.status(201).json({ data: user });
};

export const deactivateUser = async (req: Request, res: Response) => {
  const userId = String(req.params.id);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "user",
    entityId: user.id,
    action: "deactivate_user",
  });

  return res.json({ data: user });
};
