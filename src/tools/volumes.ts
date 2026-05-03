import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r, ok } from "../respond.js";

export function registerVolumeTools(mcp: McpServer) {
  mcp.tool("list_volumes", "List all volumes", { label_selector: z.string().optional() }, async ({ label_selector }) => r(await api.get(`/volumes${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`)));

  mcp.tool("get_volume", "Get volume details", { volume_id: z.number() }, async ({ volume_id }) => r(await api.get(`/volumes/${volume_id}`)));

  mcp.tool("create_volume", "Create a volume", {
    name: z.string(), size: z.number().describe("GB, 10-10240"), location: z.string().optional(), server: z.number().optional(), automount: z.boolean().optional(), format: z.string().optional().describe("xfs or ext4"), labels: z.record(z.string()).optional(),
  }, async (p) => r(await api.post("/volumes", p)));

  mcp.tool("delete_volume", "Delete a volume", { volume_id: z.number() }, async ({ volume_id }) => { await api.delete(`/volumes/${volume_id}`); return ok("Deleted"); });
  mcp.tool("attach_volume", "Attach to server", { volume_id: z.number(), server: z.number(), automount: z.boolean().optional() }, async ({ volume_id, ...b }) => r(await api.post(`/volumes/${volume_id}/actions/attach`, b)));
  mcp.tool("detach_volume", "Detach from server", { volume_id: z.number() }, async ({ volume_id }) => r(await api.post(`/volumes/${volume_id}/actions/detach`)));
  mcp.tool("resize_volume", "Increase size", { volume_id: z.number(), size: z.number() }, async ({ volume_id, size }) => r(await api.post(`/volumes/${volume_id}/actions/resize`, { size })));
}
