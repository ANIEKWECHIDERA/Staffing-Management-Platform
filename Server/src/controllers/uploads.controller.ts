import type { Request, Response } from "express";
import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { createAuditLog } from "../utils/audit-log.js";
import { buildSignedUploadParams } from "../utils/uploads.js";
import {
  createUploadSignatureSchema,
  deleteAssetSchema,
  verifyUploadResultSchema,
} from "../validators/upload.validator.js";

type CloudinaryUtilsWithVerify = typeof cloudinary.utils & {
  verify_api_response_signature: (publicId: string, version: number, signature: string) => boolean;
};

export const createUploadSignature = async (req: Request, res: Response) => {
  const payload = createUploadSignatureSchema.parse(req.body);

  const paramsToSign = buildSignedUploadParams({
    target: payload.target,
    entityId: payload.entityId,
    fileName: payload.fileName,
    documentType: payload.documentType,
    resourceType: payload.resourceType,
    actorId: req.currentUser!.id,
  });

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: paramsToSign.timestamp,
      folder: paramsToSign.folder,
      public_id: paramsToSign.public_id,
      tags: paramsToSign.tags,
      allowed_formats: paramsToSign.allowed_formats.join(","),
      context: Object.entries(paramsToSign.context)
        .map(([key, value]) => `${key}=${value}`)
        .join("|"),
    },
    env.CLOUDINARY_API_SECRET,
  );

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "upload_signature",
    entityId: payload.entityId ?? paramsToSign.public_id,
    action: "create_upload_signature",
    changesJson: {
      target: payload.target,
      entityId: payload.entityId,
      documentType: payload.documentType,
      folder: paramsToSign.folder,
      publicId: paramsToSign.public_id,
    },
  });

  return res.json({
    data: {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      signature,
      timestamp: paramsToSign.timestamp,
      folder: paramsToSign.folder,
      publicId: paramsToSign.public_id,
      tags: paramsToSign.tags,
      context: paramsToSign.context,
      resourceType: paramsToSign.resource_type,
      allowedFormats: paramsToSign.allowed_formats,
    },
  });
};

export const verifyUploadResult = async (req: Request, res: Response) => {
  const payload = verifyUploadResultSchema.parse(req.body);
  const version = typeof payload.version === "number" ? payload.version : Number(payload.version);

  if (!Number.isFinite(version) || version <= 0) {
    throw new AppError("Invalid Cloudinary version", 400);
  }

  const isValid = (cloudinary.utils as CloudinaryUtilsWithVerify).verify_api_response_signature(
    payload.publicId,
    version,
    payload.signature,
  );

  if (!isValid) {
    throw new AppError("Invalid Cloudinary upload signature", 400);
  }

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "upload_asset",
    entityId: payload.publicId,
    action: "verify_upload_result",
    changesJson: {
      publicId: payload.publicId,
      version,
      secureUrl: payload.secureUrl,
      resourceType: payload.resourceType,
      format: payload.format,
      bytes: payload.bytes,
    },
  });

  return res.json({
    data: {
      verified: true,
      publicId: payload.publicId,
      version,
      secureUrl: payload.secureUrl,
      resourceType: payload.resourceType,
      format: payload.format,
      bytes: payload.bytes,
    },
  });
};

export const deleteAsset = async (req: Request, res: Response) => {
  const payload = deleteAssetSchema.parse(req.body);

  const result = await cloudinary.uploader.destroy(payload.publicId, {
    resource_type: payload.resourceType,
    invalidate: payload.invalidate,
  });

  await createAuditLog({
    userId: req.currentUser!.id,
    entityType: "upload_asset",
    entityId: payload.publicId,
    action: "delete_upload_asset",
    changesJson: payload,
  });

  return res.json({
    data: result,
  });
};
