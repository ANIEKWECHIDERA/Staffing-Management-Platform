import { Router } from "express";
import {
  approveWorkerVerification,
  createGuarantor,
  createWorker,
  createWorkerDocument,
  createWorkerReference,
  getWorkerById,
  listWorkers,
  rejectWorkerVerification,
  submitWorkerVerification,
  updateWorker,
} from "../controllers/workers.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireRole } from "../middleware/require-role.js";

export const workersRouter = Router();
const internalAccess = requireRole("owner", "staff");

workersRouter.get("/", internalAccess, asyncHandler(listWorkers));
workersRouter.post("/", internalAccess, asyncHandler(createWorker));
workersRouter.get("/:id", internalAccess, asyncHandler(getWorkerById));
workersRouter.patch("/:id", internalAccess, asyncHandler(updateWorker));
workersRouter.post("/:id/documents", internalAccess, asyncHandler(createWorkerDocument));
workersRouter.post("/:id/references", internalAccess, asyncHandler(createWorkerReference));
workersRouter.post("/:id/guarantors", internalAccess, asyncHandler(createGuarantor));
workersRouter.post("/:id/verification/submit", internalAccess, asyncHandler(submitWorkerVerification));
workersRouter.post("/:id/verification/approve", internalAccess, asyncHandler(approveWorkerVerification));
workersRouter.post("/:id/verification/reject", internalAccess, asyncHandler(rejectWorkerVerification));
