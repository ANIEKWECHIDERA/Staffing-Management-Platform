import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { createAuditLog } from "../utils/audit-log.js";
import { scoreWorkerForRequest, sortMatchesDescending } from "../utils/matching.js";

export const runMatchesForJobRequest = async (req: Request, res: Response) => {
  const jobRequestId = String(req.params.id);

  const jobRequest = await prisma.jobRequest.findUnique({
    where: { id: jobRequestId },
  });

  if (!jobRequest) {
    throw new AppError("Job request not found", 404);
  }

  if (jobRequest.status === "cancelled") {
    throw new AppError("Cancelled requests cannot be matched", 400);
  }

  const workers = await prisma.worker.findMany({
    include: {
      roles: true,
    },
  });

  const candidateMatches = workers
    .map((worker) => ({
      worker,
      ...scoreWorkerForRequest(jobRequest, worker),
    }))
    .filter((entry) => entry.eligible);

  await prisma.match.deleteMany({
    where: { jobRequestId: jobRequest.id },
  });

  if (candidateMatches.length > 0) {
    await prisma.match.createMany({
      data: candidateMatches.map((entry) => ({
        jobRequestId: jobRequest.id,
        workerId: entry.worker.id,
        score: entry.score,
        matchReasonsJson: entry.reasons,
      })),
    });
  }

  const matches = await prisma.match.findMany({
    where: { jobRequestId: jobRequest.id },
    include: {
      worker: {
        include: {
          roles: true,
        },
      },
    },
  });

  await prisma.jobRequest.update({
    where: { id: jobRequest.id },
    data: { status: "matching" },
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "job_request",
    entityId: jobRequest.id,
    action: "run_matching",
    changesJson: {
      totalMatches: matches.length,
    },
  });

  return res.json({
    data: sortMatchesDescending(matches),
  });
};

export const getJobRequestMatches = async (req: Request, res: Response) => {
  const jobRequestId = String(req.params.id);

  const matches = await prisma.match.findMany({
    where: { jobRequestId },
    include: {
      worker: {
        include: {
          roles: true,
          documents: true,
        },
      },
    },
    orderBy: { score: "desc" },
  });

  return res.json({ data: matches });
};
