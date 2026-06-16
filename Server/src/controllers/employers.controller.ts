import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { createAuditLog } from "../utils/audit-log.js";
import { createEmployerSchema, updateEmployerSchema } from "../validators/employer.validator.js";

export const listEmployers = async (req: Request, res: Response) => {
  const { search, type, location } = req.query;

  const employers = await prisma.employer.findMany({
    where: {
      ...(typeof search === "string" && search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(typeof type === "string" && type ? { type: type as never } : {}),
      ...(typeof location === "string" && location
        ? { location: { contains: location, mode: "insensitive" } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ data: employers });
};

export const createEmployer = async (req: Request, res: Response) => {
  const payload = createEmployerSchema.parse(req.body);

  const employer = await prisma.employer.create({
    data: payload,
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "employer",
    entityId: employer.id,
    action: "create_employer",
    changesJson: payload,
  });

  return res.status(201).json({ data: employer });
};

export const getEmployerById = async (req: Request, res: Response) => {
  const employerId = String(req.params.id);

  const employer = await prisma.employer.findUnique({
    where: { id: employerId },
    include: {
      jobRequests: true,
      placements: {
        include: {
          worker: true,
        },
      },
    },
  });

  if (!employer) {
    throw new AppError("Employer not found", 404);
  }

  return res.json({ data: employer });
};

export const updateEmployer = async (req: Request, res: Response) => {
  const payload = updateEmployerSchema.parse(req.body);
  const employerId = String(req.params.id);

  const employer = await prisma.employer.update({
    where: { id: employerId },
    data: payload,
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "employer",
    entityId: employer.id,
    action: "update_employer",
    changesJson: payload,
  });

  return res.json({ data: employer });
};
