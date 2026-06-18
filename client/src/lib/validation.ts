const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isRequired(value: string) {
  return value.trim().length > 0;
}

export function hasMinLength(value: string, min: number) {
  return value.trim().length >= min;
}

export function isValidEmail(value: string) {
  return emailPattern.test(value);
}

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function isElevenDigits(value: string) {
  return /^\d{11}$/.test(value);
}

export function collectErrors(checks: Array<string | null>) {
  return checks.filter((value): value is string => Boolean(value));
}
