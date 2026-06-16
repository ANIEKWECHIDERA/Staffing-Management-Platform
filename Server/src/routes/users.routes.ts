import { Router } from "express";
import { createUser, deactivateUser, listUsers } from "../controllers/users.controller.js";
import { requireRole } from "../middleware/require-role.js";
import { asyncHandler } from "../utils/async-handler.js";

export const usersRouter = Router();

usersRouter.get("/", requireRole("owner"), asyncHandler(listUsers));
usersRouter.post("/", requireRole("owner"), asyncHandler(createUser));
usersRouter.patch("/:id/deactivate", requireRole("owner"), asyncHandler(deactivateUser));
