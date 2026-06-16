import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getDashboardSummary = async (_req: Request, res: Response) => {
  const [
    totalWorkers,
    availableWorkers,
    verifiedWorkers,
    openJobRequests,
    activePlacements,
    recentWorkers,
    recentJobRequests,
  ] = await Promise.all([
    prisma.worker.count(),
    prisma.worker.count({ where: { availabilityStatus: "available" } }),
    prisma.worker.count({ where: { verificationStatus: "verified" } }),
    prisma.jobRequest.count({ where: { status: { in: ["new", "matching", "interviewing"] } } }),
    prisma.placement.count({ where: { status: "active" } }),
    prisma.worker.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { roles: true },
    }),
    prisma.jobRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { employer: true },
    }),
  ]);

  return res.json({
    data: {
      kpis: {
        totalWorkers,
        availableWorkers,
        verifiedWorkers,
        openJobRequests,
        activePlacements,
      },
      recentWorkers,
      recentJobRequests,
    },
  });
};
