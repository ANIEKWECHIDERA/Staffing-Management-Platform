import { Router } from "express";
import {
  createJobRequest,
  getJobRequestById,
  listJobRequests,
  updateJobRequest,
  updateJobRequestStatus,
} from "../controllers/job-requests.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const jobRequestsRouter = Router();

jobRequestsRouter.get("/", asyncHandler(listJobRequests));
jobRequestsRouter.post("/", asyncHandler(createJobRequest));
jobRequestsRouter.get("/:id", asyncHandler(getJobRequestById));
jobRequestsRouter.patch("/:id", asyncHandler(updateJobRequest));
jobRequestsRouter.patch("/:id/status", asyncHandler(updateJobRequestStatus));
