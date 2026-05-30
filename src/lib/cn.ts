/** Join className fragments; skips falsy values (no dependency on clsx). */
export function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}
