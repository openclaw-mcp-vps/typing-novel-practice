export const ACCESS_COOKIE_NAME = "tnp_access";
export const ACCESS_COOKIE_VALUE = "granted";
export const USER_COOKIE_NAME = "tnp_user";

export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export function hasAccessCookie(value: string | null | undefined): boolean {
  return value === ACCESS_COOKIE_VALUE;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
