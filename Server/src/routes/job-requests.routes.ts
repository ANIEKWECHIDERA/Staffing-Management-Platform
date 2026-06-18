import { Router } from "express";
import {
  createJobRequest,
  getJobRequestById,
  listJobRequests,
  updateJobRequest,
  updateJobRequestStatus,
} from "../controllers/job-requests.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireRole } from "../middleware/require-role.js";

export const jobRequestsRouter = Router();
const internalAccess = requireRole("owner", "staff");

jobRequestsRouter.get("/", internalAccess, asyncHandler(listJobRequests));
jobRequestsRouter.post("/", internalAccess, asyncHandler(createJobRequest));
jobRequestsRouter.get("/:id", internalAccess, asyncHandler(getJobRequestById));
jobRequestsRouter.patch("/:id", internalAccess, asyncHandler(updateJobRequest));
jobRequestsRouter.patch("/:id/status", internalAccess, asyncHandler(updateJobRequestStatus));
