import { z } from "zod";

export const createPlacementSchema = z.object({
  jobRequestId: z.string().min(1),
  workerId: z.string().min(1),
  employerId: z.string().min(1),
  placementDate: z.iso.datetime(),
  guaranteeEndDate: z.iso.datetime().optional(),
  notes: z.string().optional(),
});

export const updatePlacementSchema = z.object({
  status: z.enum(["active", "ended", "under_replacement"]).optional(),
  guaranteeEndDate: z.iso.datetime().optional(),
  notes: z.string().optional(),
});
