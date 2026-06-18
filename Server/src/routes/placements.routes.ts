import { Router } from "express";
import {
  createPlacement,
  getPlacementById,
  listPlacements,
  updatePlacement,
} from "../controllers/placements.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireRole } from "../middleware/require-role.js";

export const placementsRouter = Router();
const internalAccess = requireRole("owner", "staff");

placementsRouter.get("/", internalAccess, asyncHandler(listPlacements));
placementsRouter.post("/", internalAccess, asyncHandler(createPlacement));
placementsRouter.get("/:id", internalAccess, asyncHandler(getPlacementById));
placementsRouter.patch("/:id", internalAccess, asyncHandler(updatePlacement));
