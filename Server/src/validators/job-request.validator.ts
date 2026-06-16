import { z } from "zod";

export const createJobRequestSchema = z.object({
  employerId: z.string().min(1),
  roleType: z.enum(["nanny", "driver", "caregiver", "housekeeper", "cleaner", "private_cook", "office_support"]),
  location: z.string().min(2),
  workArrangement: z.enum(["live_in", "live_out"]),
  employmentType: z.enum(["full_time", "part_time"]),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  startDate: z.iso.datetime().optional(),
  requirements: z.string().optional(),
  notes: z.string().optional(),
});

export const updateJobRequestSchema = createJobRequestSchema.partial();

export const updateJobRequestStatusSchema = z.object({
  status: z.enum(["new", "matching", "interviewing", "placed", "closed", "cancelled"]),
});
