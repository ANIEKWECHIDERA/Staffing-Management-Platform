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

export const workersRouter = Router();

workersRouter.get("/", asyncHandler(listWorkers));
workersRouter.post("/", asyncHandler(createWorker));
workersRouter.get("/:id", asyncHandler(getWorkerById));
workersRouter.patch("/:id", asyncHandler(updateWorker));
workersRouter.post("/:id/documents", asyncHandler(createWorkerDocument));
workersRouter.post("/:id/references", asyncHandler(createWorkerReference));
workersRouter.post("/:id/guarantors", asyncHandler(createGuarantor));
workersRouter.post("/:id/verification/submit", asyncHandler(submitWorkerVerification));
workersRouter.post("/:id/verification/approve", asyncHandler(approveWorkerVerification));
workersRouter.post("/:id/verification/reject", asyncHandler(rejectWorkerVerification));
