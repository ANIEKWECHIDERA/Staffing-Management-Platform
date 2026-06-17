import { Router } from "express";
import {
  createUploadSignature,
  deleteAsset,
  verifyUploadResult,
} from "../controllers/uploads.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const uploadsRouter = Router();

uploadsRouter.post("/signature", asyncHandler(createUploadSignature));
uploadsRouter.post("/verify", asyncHandler(verifyUploadResult));
uploadsRouter.delete("/asset", asyncHandler(deleteAsset));
