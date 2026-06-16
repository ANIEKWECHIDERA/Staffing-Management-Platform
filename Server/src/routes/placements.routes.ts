import { Router } from "express";
import {
  createPlacement,
  getPlacementById,
  listPlacements,
  updatePlacement,
} from "../controllers/placements.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const placementsRouter = Router();

placementsRouter.get("/", asyncHandler(listPlacements));
placementsRouter.post("/", asyncHandler(createPlacement));
placementsRouter.get("/:id", asyncHandler(getPlacementById));
placementsRouter.patch("/:id", asyncHandler(updatePlacement));
