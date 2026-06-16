import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { createAuditLog } from "../utils/audit-log.js";
import {
  createJobRequestSchema,
  updateJobRequestSchema,
  updateJobRequestStatusSchema,
} from "../validators/job-request.validator.js";

export const listJobRequests = async (req: Request, res: Response) => {
  const { status, roleType, location, employerId } = req.query;

  const jobRequests = await prisma.jobRequest.findMany({
    where: {
      ...(typeof status === "string" && status ? { status: status as never } : {}),
      ...(typeof roleType === "string" && roleType ? { roleType: roleType as never } : {}),
      ...(typeof employerId === "string" && employerId ? { employerId } : {}),
      ...(typeof location === "string" && location
        ? { location: { contains: location, mode: "insensitive" } }
        : {}),
    },
    include: {
      employer: true,
      placement: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ data: jobRequests });
};

export const createJobRequest = async (req: Request, res: Response) => {
  const payload = createJobRequestSchema.parse(req.body);

  const jobRequest = await prisma.jobRequest.create({
    data: {
      ...payload,
      startDate: payload.startDate ? new Date(payload.startDate) : undefined,
      createdByUserId: req.currentUser!.id,
    },
    include: {
      employer: true,
    },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "job_request",
    entityId: jobRequest.id,
    action: "create_job_request",
    changesJson: payload,
  });

  return res.status(201).json({ data: jobRequest });
};

export const getJobRequestById = async (req: Request, res: Response) => {
  const jobRequestId = String(req.params.id);

  const jobRequest = await prisma.jobRequest.findUnique({
    where: { id: jobRequestId },
    include: {
      employer: true,
      matches: {
        include: {
          worker: {
            include: {
              roles: true,
            },
          },
        },
        orderBy: { score: "desc" },
      },
      placement: true,
    },
  });

  if (!jobRequest) {
    throw new AppError("Job request not found", 404);
  }

  return res.json({ data: jobRequest });
};

export const updateJobRequest = async (req: Request, res: Response) => {
  const payload = updateJobRequestSchema.parse(req.body);
  const jobRequestId = String(req.params.id);

  const jobRequest = await prisma.jobRequest.update({
    where: { id: jobRequestId },
    data: {
      ...payload,
      startDate: payload.startDate ? new Date(payload.startDate) : undefined,
    },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "job_request",
    entityId: jobRequest.id,
    action: "update_job_request",
    changesJson: payload,
  });

  return res.json({ data: jobRequest });
};

export const updateJobRequestStatus = async (req: Request, res: Response) => {
  const payload = updateJobRequestStatusSchema.parse(req.body);
  const jobRequestId = String(req.params.id);

  if (payload.status === "placed") {
    const placement = await prisma.placement.findUnique({
      where: { jobRequestId },
    });

    if (!placement) {
      throw new AppError("Cannot mark request as placed without a placement record", 400);
    }
  }

  const jobRequest = await prisma.jobRequest.update({
    where: { id: jobRequestId },
    data: { status: payload.status },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "job_request",
    entityId: jobRequest.id,
    action: "update_job_request_status",
    changesJson: payload,
  });

  return res.json({ data: jobRequest });
};
