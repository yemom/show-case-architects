export type ClassValue = string | number | null | false | undefined | Record<string, unknown> | ClassValue[];

function flatten(input: ClassValue): string[] {
    if (!input) return [];
    if (typeof input === "string" || typeof input === "number") return [String(input)];
    if (Array.isArray(input)) return input.flatMap(flatten);
    if (typeof input === "object") {
        return Object.entries(input)
            .filter(([, v]) => Boolean(v))
            .map(([k]) => k);
    }
    return [];
}

export function cn(...inputs: ClassValue[]) {
    return inputs.flatMap(flatten).join(" ");
}

// Resolve relative upload paths to absolute URLs based on axios baseURL or Vite envs
export function getMediaUrl(path?: string | null, apiBase?: string) {
    if (!path) return null;
    const fallbackBase = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || window.location.origin) as string;
    const base = (apiBase || fallbackBase || '').replace(/\/$/, '');
    if (/^https?:\/\//i.test(path)) return path;
    const normalized = path.replace(/\\/g, '/');
    const rel = normalized.match(/uploads\/.+/)?.[0] || normalized.replace(/^\//, '');
    return `${base}/${rel}`.replace(/([^:]\/)\/+/, '$1');
}

export function stripHtml(html?: string, maxLen = 160) {
    if (!html) return '';
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}
