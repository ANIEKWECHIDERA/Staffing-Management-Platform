import { Router } from "express";
import { getJobRequestMatches, runMatchesForJobRequest } from "../controllers/matches.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const matchesRouter = Router({ mergeParams: true });

matchesRouter.post("/", asyncHandler(runMatchesForJobRequest));
matchesRouter.get("/", asyncHandler(getJobRequestMatches));
