import { Router } from "express";
import { forgotPassword, getCurrentUser, syncUser } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { attachCurrentUser } from "../middleware/attach-current-user.js";
import { authenticate } from "../middleware/authenticate.js";

export const authRouter = Router();

authRouter.post("/forgot-password", asyncHandler(forgotPassword));
authRouter.post("/sync-user", asyncHandler(authenticate), asyncHandler(syncUser));
authRouter.get("/me", asyncHandler(authenticate), asyncHandler(attachCurrentUser), asyncHandler(getCurrentUser));
