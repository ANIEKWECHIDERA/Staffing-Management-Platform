import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { createAuditLog } from "../utils/audit-log.js";
import { createPlacementSchema, updatePlacementSchema } from "../validators/placement.validator.js";

export const listPlacements = async (req: Request, res: Response) => {
  const { status, workerId, employerId } = req.query;

  const placements = await prisma.placement.findMany({
    where: {
      ...(typeof status === "string" && status ? { status: status as never } : {}),
      ...(typeof workerId === "string" && workerId ? { workerId } : {}),
      ...(typeof employerId === "string" && employerId ? { employerId } : {}),
    },
    include: {
      worker: true,
      employer: true,
      jobRequest: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ data: placements });
};

export const createPlacement = async (req: Request, res: Response) => {
  const payload = createPlacementSchema.parse(req.body);

  const request = await prisma.jobRequest.findUnique({
    where: { id: payload.jobRequestId },
  });

  if (!request) {
    throw new AppError("Job request not found", 404);
  }

  const placement = await prisma.$transaction(async (tx) => {
    const createdPlacement = await tx.placement.create({
      data: {
        ...payload,
        placementDate: new Date(payload.placementDate),
        guaranteeEndDate: payload.guaranteeEndDate ? new Date(payload.guaranteeEndDate) : undefined,
        createdByUserId: req.currentUser!.id,
      },
      include: {
        worker: true,
        employer: true,
        jobRequest: true,
      },
    });

    await tx.worker.update({
      where: { id: payload.workerId },
      data: { availabilityStatus: "placed" },
    });

    await tx.jobRequest.update({
      where: { id: payload.jobRequestId },
      data: { status: "placed" },
    });

    return createdPlacement;
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "placement",
    entityId: placement.id,
    action: "create_placement",
    changesJson: payload,
  });

  return res.status(201).json({ data: placement });
};

export const getPlacementById = async (req: Request, res: Response) => {
  const placementId = String(req.params.id);

  const placement = await prisma.placement.findUnique({
    where: { id: placementId },
    include: {
      worker: true,
      employer: true,
      jobRequest: true,
    },
  });

  if (!placement) {
    throw new AppError("Placement not found", 404);
  }

  return res.json({ data: placement });
};

export const updatePlacement = async (req: Request, res: Response) => {
  const payload = updatePlacementSchema.parse(req.body);
  const placementId = String(req.params.id);

  const placement = await prisma.placement.update({
    where: { id: placementId },
    data: {
      status: payload.status,
      guaranteeEndDate: payload.guaranteeEndDate ? new Date(payload.guaranteeEndDate) : undefined,
      notes: payload.notes,
    },
    include: {
      worker: true,
      employer: true,
      jobRequest: true,
    },
  });

  if (payload.status === "ended") {
    await prisma.worker.update({
      where: { id: placement.workerId },
      data: { availabilityStatus: "available" },
    });
  }

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "placement",
    entityId: placement.id,
    action: "update_placement",
    changesJson: payload,
  });

  return res.json({ data: placement });
};
