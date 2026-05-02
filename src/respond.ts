import { formatResponse } from "./api.js";

export function r(data: unknown) {
  return { content: [{ type: "text" as const, text: formatResponse(data) }] };
}

export function ok(msg: string) {
  return { content: [{ type: "text" as const, text: msg }] };
}
