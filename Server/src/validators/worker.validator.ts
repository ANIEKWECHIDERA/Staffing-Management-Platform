import { z } from "zod";
import {
  optionalSafeEmail,
  optionalSafeTrimmedString,
  optionalSafeUrl,
  safeEntityId,
  safeFreeText,
  safeNameString,
  safePhone,
  safeTrimmedString,
} from "./common.js";

const roleSchema = z
  .object({
    roleType: z.enum(["nanny", "driver", "caregiver", "housekeeper", "cleaner", "private_cook", "office_support"]),
    experienceLevel: z.enum(["beginner", "intermediate", "experienced", "expert"]).optional(),
    yearsExperience: z.number().int().min(0).max(80).optional(),
  })
  .strict();

export const createWorkerSchema = z
  .object({
    fullName: safeNameString(),
    phone: safePhone,
    email: optionalSafeEmail,
    location: safeTrimmedString(2, 120),
    address: optionalSafeTrimmedString(255),
    dateOfBirth: z.iso.datetime().optional(),
    gender: optionalSafeTrimmedString(40),
    profilePhotoUrl: optionalSafeUrl,
    experienceYears: z.number().int().min(0).max(80).optional(),
    nin: z.string().trim().regex(/^\d{11}$/, "NIN must be 11 digits").optional(),
    bvn: z.string().trim().regex(/^\d{11}$/, "BVN must be 11 digits").optional(),
    notes: safeFreeText(2000),
    roles: z.array(roleSchema).min(1).max(10),
  })
  .strict();

export const updateWorkerSchema = createWorkerSchema.partial().extend({
  availabilityStatus: z.enum(["available", "placed", "unavailable"]).optional(),
  verificationStatus: z.enum(["draft", "pending_verification", "verified", "rejected", "incomplete"]).optional(),
  roles: z.array(roleSchema).min(1).optional(),
}).strict();

export const createWorkerDocumentSchema = z
  .object({
    documentType: z.enum([
      "profile_photo",
      "nin_slip",
      "bvn_proof",
      "government_id",
      "guarantor_id",
      "reference_letter",
      "medical_report",
      "character_reference",
      "other",
    ]),
    fileUrl: z.url(),
    cloudinaryPublicId: optionalSafeTrimmedString(255),
  })
  .strict();

export const createWorkerReferenceSchema = z
  .object({
    fullName: safeNameString(),
    phone: safePhone,
    relationship: safeTrimmedString(2, 120),
    notes: safeFreeText(500),
  })
  .strict();

export const createGuarantorSchema = z
  .object({
    fullName: safeNameString(),
    phone: safePhone,
    address: safeTrimmedString(5, 255),
    relationship: safeTrimmedString(2, 120),
    idDocumentUrl: optionalSafeUrl,
    notes: safeFreeText(500),
  })
  .strict();

export const verificationDecisionSchema = z
  .object({
    reason: optionalSafeTrimmedString(500),
  })
  .strict();
