import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

type AuditLogInput = {
  userId: string;
  entityType: string;
  entityId: string;
  action: string;
  changesJson?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
};

export const createAuditLog = async (input: AuditLogInput) => {
  return prisma.auditLog.create({
    data: input,
  });
};
