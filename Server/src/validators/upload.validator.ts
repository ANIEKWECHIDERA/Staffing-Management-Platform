import { z } from "zod";
import { optionalSafeTrimmedString, safeEntityId, safeTrimmedString } from "./common.js";

export const allowedOfficeDocumentExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "csv"] as const;
export const allowedImageExtensions = ["png", "jpg", "jpeg"] as const;
const allowedUploadExtensions = [...allowedOfficeDocumentExtensions, ...allowedImageExtensions] as const;

const getFileExtension = (fileName: string) => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.at(-1)?.toLowerCase() ?? "" : "";
};

export const uploadTargetSchema = z.enum([
  "worker_profile",
  "worker_document",
  "employer_attachment",
  "staff_credential",
  "generic",
]);

export const createUploadSignatureSchema = z
  .object({
    target: uploadTargetSchema,
    entityId: safeEntityId.optional(),
    fileName: safeTrimmedString(3, 255),
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
  })
  .strict()
  .superRefine((value, ctx) => {
    const ext = getFileExtension(value.fileName);

    if (!allowedUploadExtensions.includes(ext as (typeof allowedUploadExtensions)[number])) {
      ctx.addIssue({
        code: "custom",
        path: ["fileName"],
        message: "Unsupported file type. Allowed types: pdf, doc, docx, xls, xlsx, csv, png, jpg, jpeg",
      });
    }

    const isImageTarget = value.target === "worker_profile";
    const isImageExtension = allowedImageExtensions.includes(ext as (typeof allowedImageExtensions)[number]);
    const isDocumentExtension = allowedOfficeDocumentExtensions.includes(
      ext as (typeof allowedOfficeDocumentExtensions)[number],
    );

    if (isImageTarget && !isImageExtension) {
      ctx.addIssue({
        code: "custom",
        path: ["fileName"],
        message: "Worker profile uploads must be PNG or JPEG images",
      });
    }

    if (value.resourceType === "image" && !isImageExtension) {
      ctx.addIssue({
        code: "custom",
        path: ["resourceType"],
        message: "Image resource type only supports PNG or JPEG files",
      });
    }

    if (value.resourceType === "raw" && !isDocumentExtension) {
      ctx.addIssue({
        code: "custom",
        path: ["resourceType"],
        message: "Raw resource type only supports office-safe documents",
      });
    }
  });

export const verifyUploadResultSchema = z
  .object({
    publicId: safeTrimmedString(1, 255),
    version: z.union([z.string().trim().min(1), z.number().int().positive()]),
    signature: safeTrimmedString(1, 255),
    secureUrl: z.url().optional(),
    resourceType: z.enum(["image", "raw", "video"]).optional(),
    format: z
      .string()
      .trim()
      .toLowerCase()
      .refine(
        (value) =>
          allowedUploadExtensions.includes(value as (typeof allowedUploadExtensions)[number]),
        {
          message: "Unsupported uploaded file format",
        },
      )
      .optional(),
    bytes: z.number().int().positive().max(10 * 1024 * 1024).optional(),
  })
  .strict();

export const deleteAssetSchema = z
  .object({
    publicId: safeTrimmedString(1, 255),
    resourceType: z.enum(["image", "raw"]).default("image"),
    invalidate: z.boolean().default(true),
  })
  .strict();
