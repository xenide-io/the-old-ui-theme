/**
 * Cookie helpers for suite-wide preferences. Suite apps run on different
 * origins (localhost ports or subdomains), so shared state crosses apps via
 * one host-wide cookie.
 */

export function suiteCookieDomainAttr(): string {
  const host = window.location.hostname;
  if (host === "localhost" || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
    return "";
  }
  // tides.localhost / turtletime.localhost must share one cookie.
  if (host.endsWith(".localhost")) {
    return "; Domain=.localhost";
  }
  const known = new Set([
    "tides",
    "kraken",
    "turtletime",
    "time",
    "shelly",
    "app",
    "shellstack",
    "portal",
  ]);
  const parts = host.split(".");
  if (parts.length >= 3 && known.has(parts[0] ?? "")) {
    return `; Domain=.${parts.slice(1).join(".")}`;
  }
  if (parts.length >= 2) return `; Domain=.${parts.slice(1).join(".")}`;
  return "";
}

export function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

export function writeCookie(name: string, value: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${suiteCookieDomainAttr()}${secure}`;
}

export function clearCookie(name: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${suiteCookieDomainAttr()}${secure}`;
}
