const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : "";

export function toApiUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`API path must start with '/': ${path}`);
  }

  if (!baseUrl) return path;
  return `${baseUrl}${path}`;
}

export const DEFAULT_USER_ID = Number(import.meta.env.VITE_DEFAULT_USER_ID ?? "1");
