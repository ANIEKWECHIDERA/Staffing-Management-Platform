import { z } from "zod";

export const uploadTargetSchema = z.enum([
  "worker_profile",
  "worker_document",
  "employer_attachment",
  "staff_credential",
  "generic",
]);

export const createUploadSignatureSchema = z.object({
  target: uploadTargetSchema,
  entityId: z.string().min(1).optional(),
  fileName: z.string().min(1).optional(),
  documentType: z
    .enum([
      "profile_photo",
      "nin_slip",
      "bvn_proof",
      "government_id",
      "guarantor_id",
      "reference_letter",
      "medical_report",
      "character_reference",
      "other",
    ])
    .optional(),
  resourceType: z.enum(["image", "raw", "auto"]).default("auto"),
});

export const verifyUploadResultSchema = z.object({
  publicId: z.string().min(1),
  version: z.union([z.string().min(1), z.number().int().positive()]),
  signature: z.string().min(1),
  secureUrl: z.url().optional(),
  resourceType: z.string().optional(),
  format: z.string().optional(),
  bytes: z.number().int().nonnegative().optional(),
});

export const deleteAssetSchema = z.object({
  publicId: z.string().min(1),
  resourceType: z.enum(["image", "raw", "video"]).default("image"),
  invalidate: z.boolean().default(true),
});
