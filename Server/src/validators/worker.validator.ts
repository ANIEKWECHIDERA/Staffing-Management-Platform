import { z } from "zod";

const roleSchema = z.object({
  roleType: z.enum(["nanny", "driver", "caregiver", "housekeeper", "cleaner", "private_cook", "office_support"]),
  experienceLevel: z.enum(["beginner", "intermediate", "experienced", "expert"]).optional(),
  yearsExperience: z.number().int().min(0).optional(),
});

export const createWorkerSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  email: z.email().optional(),
  location: z.string().min(2),
  address: z.string().optional(),
  dateOfBirth: z.iso.datetime().optional(),
  gender: z.string().optional(),
  profilePhotoUrl: z.url().optional(),
  experienceYears: z.number().int().min(0).optional(),
  nin: z.string().optional(),
  bvn: z.string().optional(),
  notes: z.string().optional(),
  roles: z.array(roleSchema).min(1),
});

export const updateWorkerSchema = createWorkerSchema.partial().extend({
  availabilityStatus: z.enum(["available", "placed", "unavailable"]).optional(),
  verificationStatus: z.enum(["draft", "pending_verification", "verified", "rejected", "incomplete"]).optional(),
  roles: z.array(roleSchema).min(1).optional(),
});

export const createWorkerDocumentSchema = z.object({
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
  cloudinaryPublicId: z.string().optional(),
});

export const createWorkerReferenceSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  relationship: z.string().min(2),
  notes: z.string().optional(),
});

export const createGuarantorSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  address: z.string().min(5),
  relationship: z.string().min(2),
  idDocumentUrl: z.url().optional(),
  notes: z.string().optional(),
});

export const verificationDecisionSchema = z.object({
  reason: z.string().min(2).optional(),
});
