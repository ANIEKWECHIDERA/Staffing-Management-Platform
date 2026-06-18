import { z } from "zod";

const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/;
const HTML_TAG_REGEX = /<[^>]*>/;
const PHONE_ALLOWED_REGEX = /^[+\d][\d\s\-()]{6,19}$/;
const ID_LIKE_REGEX = /^[A-Za-z0-9_-]{1,100}$/;

const sanitizeStringValue = (value: string) =>
  value
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const refineSafeText = (value: string) => !CONTROL_CHARS_REGEX.test(value) && !HTML_TAG_REGEX.test(value);

export const safeTrimmedString = (min = 1, max = 255) =>
  z
    .string()
    .transform(sanitizeStringValue)
    .pipe(z.string().min(min).max(max))
    .refine(refineSafeText, {
      message: "Input contains unsafe content",
    });

export const optionalSafeTrimmedString = (max = 255) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    safeTrimmedString(1, max).optional(),
  );

export const safeNameString = (min = 2, max = 120) => safeTrimmedString(min, max);

export const safeFreeText = (max = 2000) => optionalSafeTrimmedString(max);

export const safeEmail = z
  .string()
  .transform((value) => sanitizeStringValue(value).toLowerCase())
  .pipe(z.email().max(254));

export const optionalSafeEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  safeEmail.optional(),
);

export const safePhone = z
  .string()
  .transform(sanitizeStringValue)
  .refine((value) => PHONE_ALLOWED_REGEX.test(value), {
    message: "Invalid phone number format",
  })
  .transform((value) => value.replace(/\s+/g, ""))
  .pipe(z.string().min(7).max(20));

export const safeEntityId = z
  .string()
  .transform(sanitizeStringValue)
  .pipe(z.string().min(1).max(100))
  .refine((value) => ID_LIKE_REGEX.test(value), {
    message: "Invalid identifier format",
  });

export const optionalSafeUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .transform(sanitizeStringValue)
    .pipe(z.url())
    .optional(),
);
