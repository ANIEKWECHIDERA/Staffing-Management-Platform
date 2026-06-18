import { Router } from "express";
import {
  createUploadSignature,
  deleteAsset,
  verifyUploadResult,
} from "../controllers/uploads.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { requireRole } from "../middleware/require-role.js";

export const uploadsRouter = Router();
const internalAccess = requireRole("owner", "staff");

uploadsRouter.post("/signature", internalAccess, asyncHandler(createUploadSignature));
uploadsRouter.post("/verify", internalAccess, asyncHandler(verifyUploadResult));
uploadsRouter.delete("/asset", internalAccess, asyncHandler(deleteAsset));
