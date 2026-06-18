import { Router } from "express";
import { getJobRequestMatches, runMatchesForJobRequest } from "../controllers/matches.controller.js";
import { requireRole } from "../middleware/require-role.js";
import { asyncHandler } from "../utils/async-handler.js";

export const matchesRouter = Router({ mergeParams: true });

matchesRouter.post("/", requireRole("owner", "staff"), asyncHandler(runMatchesForJobRequest));
matchesRouter.get("/", requireRole("owner", "staff"), asyncHandler(getJobRequestMatches));
