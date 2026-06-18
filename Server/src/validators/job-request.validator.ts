import { z } from "zod";
import { safeEntityId, safeFreeText, safeTrimmedString } from "./common.js";

const jobRequestBaseSchema = z
  .object({
    employerId: safeEntityId,
    roleType: z.enum(["nanny", "driver", "caregiver", "housekeeper", "cleaner", "private_cook", "office_support"]),
    location: safeTrimmedString(2, 120),
    workArrangement: z.enum(["live_in", "live_out"]),
    employmentType: z.enum(["full_time", "part_time"]),
    salaryMin: z.number().int().min(0).max(100000000).optional(),
    salaryMax: z.number().int().min(0).max(100000000).optional(),
    startDate: z.iso.datetime().optional(),
    requirements: safeFreeText(1000),
    notes: safeFreeText(1000),
  })
  .strict();

export const createJobRequestSchema = jobRequestBaseSchema
  .refine(
    (value) =>
      value.salaryMin === undefined ||
      value.salaryMax === undefined ||
      value.salaryMax >= value.salaryMin,
    {
      message: "salaryMax must be greater than or equal to salaryMin",
      path: ["salaryMax"],
    },
  );

export const updateJobRequestSchema = jobRequestBaseSchema
  .partial()
  .strict()
  .refine(
    (value) =>
      value.salaryMin === undefined ||
      value.salaryMax === undefined ||
      value.salaryMax >= value.salaryMin,
    {
      message: "salaryMax must be greater than or equal to salaryMin",
      path: ["salaryMax"],
    },
  );

export const updateJobRequestStatusSchema = z
  .object({
    status: z.enum(["new", "matching", "interviewing", "placed", "closed", "cancelled"]),
  })
  .strict();
