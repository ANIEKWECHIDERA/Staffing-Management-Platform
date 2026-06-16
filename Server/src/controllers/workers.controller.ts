import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { createAuditLog } from "../utils/audit-log.js";
import {
  createGuarantorSchema,
  createWorkerDocumentSchema,
  createWorkerReferenceSchema,
  createWorkerSchema,
  updateWorkerSchema,
  verificationDecisionSchema,
} from "../validators/worker.validator.js";

const workerInclude = {
  roles: true,
  documents: true,
  references: true,
  guarantors: true,
  placements: {
    include: {
      employer: true,
      jobRequest: true,
    },
  },
} as const;

export const listWorkers = async (req: Request, res: Response) => {
  const { search, roleType, location, availabilityStatus, verificationStatus } = req.query;

  const workers = await prisma.worker.findMany({
    where: {
      ...(typeof search === "string" && search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
              { nin: { contains: search, mode: "insensitive" } },
              { bvn: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(typeof location === "string" && location
        ? { location: { contains: location, mode: "insensitive" } }
        : {}),
      ...(typeof availabilityStatus === "string" && availabilityStatus
        ? { availabilityStatus: availabilityStatus as never }
        : {}),
      ...(typeof verificationStatus === "string" && verificationStatus
        ? { verificationStatus: verificationStatus as never }
        : {}),
      ...(typeof roleType === "string" && roleType
        ? {
            roles: {
              some: {
                roleType: roleType as never,
              },
            },
          }
        : {}),
    },
    include: {
      roles: true,
      documents: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ data: workers });
};

export const createWorker = async (req: Request, res: Response) => {
  const payload = createWorkerSchema.parse(req.body);

  const duplicateWorker = await prisma.worker.findFirst({
    where: {
      OR: [
        { phone: payload.phone },
        ...(payload.nin ? [{ nin: payload.nin }] : []),
        ...(payload.bvn ? [{ bvn: payload.bvn }] : []),
      ],
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      nin: true,
      bvn: true,
    },
  });

  if (duplicateWorker) {
    throw new AppError("Potential duplicate worker found", 409);
  }

  const worker = await prisma.worker.create({
    data: {
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      location: payload.location,
      address: payload.address,
      dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
      gender: payload.gender,
      profilePhotoUrl: payload.profilePhotoUrl,
      experienceYears: payload.experienceYears,
      nin: payload.nin,
      bvn: payload.bvn,
      notes: payload.notes,
      createdByUserId: req.currentUser!.id,
      roles: {
        create: payload.roles,
      },
    },
    include: workerInclude,
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "worker",
    entityId: worker.id,
    action: "create_worker",
    changesJson: payload,
  });

  return res.status(201).json({ data: worker });
};

export const getWorkerById = async (req: Request, res: Response) => {
  const workerId = String(req.params.id);

  const worker = await prisma.worker.findUnique({
    where: { id: workerId },
    include: workerInclude,
  });

  if (!worker) {
    throw new AppError("Worker not found", 404);
  }

  return res.json({ data: worker });
};

export const updateWorker = async (req: Request, res: Response) => {
  const payload = updateWorkerSchema.parse(req.body);
  const workerId = String(req.params.id);

  const worker = await prisma.worker.update({
    where: { id: workerId },
    data: {
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      location: payload.location,
      address: payload.address,
      dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
      gender: payload.gender,
      profilePhotoUrl: payload.profilePhotoUrl,
      experienceYears: payload.experienceYears,
      availabilityStatus: payload.availabilityStatus,
      verificationStatus: payload.verificationStatus,
      nin: payload.nin,
      bvn: payload.bvn,
      notes: payload.notes,
      ...(payload.roles
        ? {
            roles: {
              deleteMany: {},
              create: payload.roles,
            },
          }
        : {}),
    },
    include: workerInclude,
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "worker",
    entityId: worker.id,
    action: "update_worker",
    changesJson: payload,
  });

  return res.json({ data: worker });
};

export const createWorkerDocument = async (req: Request, res: Response) => {
  const payload = createWorkerDocumentSchema.parse(req.body);
  const workerId = String(req.params.id);

  const document = await prisma.workerDocument.create({
    data: {
      workerId,
      ...payload,
    },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "worker_document",
    entityId: document.id,
    action: "create_worker_document",
    changesJson: payload,
  });

  return res.status(201).json({ data: document });
};

export const createWorkerReference = async (req: Request, res: Response) => {
  const payload = createWorkerReferenceSchema.parse(req.body);
  const workerId = String(req.params.id);

  const reference = await prisma.workerReference.create({
    data: {
      workerId,
      ...payload,
    },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "worker_reference",
    entityId: reference.id,
    action: "create_worker_reference",
    changesJson: payload,
  });

  return res.status(201).json({ data: reference });
};

export const createGuarantor = async (req: Request, res: Response) => {
  const payload = createGuarantorSchema.parse(req.body);
  const workerId = String(req.params.id);

  const guarantor = await prisma.guarantor.create({
    data: {
      workerId,
      ...payload,
    },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "guarantor",
    entityId: guarantor.id,
    action: "create_guarantor",
    changesJson: payload,
  });

  return res.status(201).json({ data: guarantor });
};

export const submitWorkerVerification = async (req: Request, res: Response) => {
  const workerId = String(req.params.id);

  const worker = await prisma.worker.update({
    where: { id: workerId },
    data: { verificationStatus: "pending_verification" },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "worker",
    entityId: worker.id,
    action: "submit_worker_verification",
  });

  return res.json({ data: worker });
};

export const approveWorkerVerification = async (req: Request, res: Response) => {
  const workerId = String(req.params.id);

  const worker = await prisma.worker.findUnique({
    where: { id: workerId },
  });

  if (!worker) {
    throw new AppError("Worker not found", 404);
  }

  const [documentCount, referenceCount, guarantorCount] = await Promise.all([
    prisma.workerDocument.count({ where: { workerId } }),
    prisma.workerReference.count({ where: { workerId } }),
    prisma.guarantor.count({ where: { workerId } }),
  ]);

  if (!worker.nin || !worker.bvn || documentCount === 0 || referenceCount === 0 || guarantorCount === 0) {
    throw new AppError("Worker does not meet minimum verification requirements", 400);
  }

  const updatedWorker = await prisma.worker.update({
    where: { id: workerId },
    data: { verificationStatus: "verified" },
  });

  await prisma.workerDocument.updateMany({
    where: { workerId: worker.id, status: "uploaded" },
    data: {
      status: "approved",
      reviewedAt: new Date(),
      reviewedByUserId: req.currentUser!.id,
    },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "worker",
    entityId: updatedWorker.id,
    action: "approve_worker_verification",
  });

  return res.json({ data: updatedWorker });
};

export const rejectWorkerVerification = async (req: Request, res: Response) => {
  const payload = verificationDecisionSchema.parse(req.body);
  const workerId = String(req.params.id);

  const worker = await prisma.worker.update({
    where: { id: workerId },
    data: {
      verificationStatus: "rejected",
      notes: payload.reason ? `${payload.reason}` : undefined,
    },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "worker",
    entityId: worker.id,
    action: "reject_worker_verification",
    changesJson: payload,
  });

  return res.json({ data: worker });
};
