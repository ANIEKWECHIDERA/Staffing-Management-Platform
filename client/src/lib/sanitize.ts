/* eslint-disable no-control-regex */
const CONTROL_OR_TAGS = /[\u0000-\u001F\u007F]|<[^>]*>/g;

export function sanitizeText(value: string, maxLength = 255) {
  return value
    .normalize("NFKC")
    .replace(CONTROL_OR_TAGS, "")
    .replace(/\s+/g, " ")
    .trimStart()
    .slice(0, maxLength);
}

export function sanitizeEmail(value: string) {
  return sanitizeText(value, 254)
    .replace(/[^a-zA-Z0-9@._+-]/g, "")
    .toLowerCase();
}

export function sanitizePhone(value: string) {
  return value.replace(/[^\d+\-() ]/g, "").slice(0, 20);
}

export function sanitizeDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

export function sanitizeMoney(value: string) {
  return value.replace(/[^\d,.\- A-Za-z]/g, "").slice(0, 40);
}
