import { Router } from "express";
import {
  createEmployer,
  getEmployerById,
  listEmployers,
  updateEmployer,
} from "../controllers/employers.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireRole } from "../middleware/require-role.js";

export const employersRouter = Router();
const internalAccess = requireRole("owner", "staff");

employersRouter.get("/", internalAccess, asyncHandler(listEmployers));
employersRouter.post("/", internalAccess, asyncHandler(createEmployer));
employersRouter.get("/:id", internalAccess, asyncHandler(getEmployerById));
employersRouter.patch("/:id", internalAccess, asyncHandler(updateEmployer));
