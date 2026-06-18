import { z } from "zod";
import { safeEntityId, safeFreeText } from "./common.js";

export const createPlacementSchema = z
  .object({
    jobRequestId: safeEntityId,
    workerId: safeEntityId,
    employerId: safeEntityId,
    placementDate: z.iso.datetime(),
    guaranteeEndDate: z.iso.datetime().optional(),
    notes: safeFreeText(1000),
  })
  .strict();

export const updatePlacementSchema = z
  .object({
    status: z.enum(["active", "ended", "under_replacement"]).optional(),
    guaranteeEndDate: z.iso.datetime().optional(),
    notes: safeFreeText(1000),
  })
  .strict();
