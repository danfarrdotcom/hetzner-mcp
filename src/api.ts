const API_BASE = "https://api.hetzner.cloud/v1";

let token: string | undefined;

export function setToken(t: string) {
  token = t;
}

const STRIP_KEYS = new Set(["permissions", "deprecation", "labels_selector_example"]);

function compact(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(compact);
  if (typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (STRIP_KEYS.has(k)) continue;
      out[k] = compact(v);
    }
    return out;
  }
  return obj;
}

export function formatResponse(data: unknown): string {
  return JSON.stringify(compact(data));
}

export async function hetznerApi<T = unknown>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  if (!token) throw new Error("HCLOUD_TOKEN not configured");
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return {} as T;
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message ?? JSON.stringify(json);
    throw new Error(`Hetzner API ${res.status}: ${msg}`);
  }
  return json as T;
}

export const api = {
  get: <T = unknown>(path: string) => hetznerApi<T>("GET", path),
  post: <T = unknown>(path: string, body?: unknown) => hetznerApi<T>("POST", path, body),
  put: <T = unknown>(path: string, body?: unknown) => hetznerApi<T>("PUT", path, body),
  delete: <T = unknown>(path: string) => hetznerApi<T>("DELETE", path),
};
