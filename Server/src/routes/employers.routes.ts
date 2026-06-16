import { Router } from "express";
import {
  createEmployer,
  getEmployerById,
  listEmployers,
  updateEmployer,
} from "../controllers/employers.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const employersRouter = Router();

employersRouter.get("/", asyncHandler(listEmployers));
employersRouter.post("/", asyncHandler(createEmployer));
employersRouter.get("/:id", asyncHandler(getEmployerById));
employersRouter.patch("/:id", asyncHandler(updateEmployer));
