import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r, ok } from "../respond.js";

export function registerImageTools(mcp: McpServer) {
  mcp.tool("list_images", "List images (OS, snapshots, backups)", { type: z.enum(["system", "snapshot", "backup", "app"]).optional(), architecture: z.enum(["x86", "arm"]).optional(), label_selector: z.string().optional() }, async (p) => {
    const qs = new URLSearchParams();
    if (p.type) qs.set("type", p.type);
    if (p.architecture) qs.set("architecture", p.architecture);
    if (p.label_selector) qs.set("label_selector", p.label_selector);
    const q = qs.toString();
    return r(await api.get(`/images${q ? `?${q}` : ""}`));
  });
  mcp.tool("get_image", "Get image details", { image_id: z.number() }, async ({ image_id }) => r(await api.get(`/images/${image_id}`)));
  mcp.tool("update_image", "Update image", { image_id: z.number(), description: z.string().optional(), type: z.enum(["snapshot"]).optional(), labels: z.record(z.string()).optional() }, async ({ image_id, ...b }) => r(await api.put(`/images/${image_id}`, b)));
  mcp.tool("delete_image", "Delete snapshot", { image_id: z.number() }, async ({ image_id }) => { await api.delete(`/images/${image_id}`); return ok("Deleted"); });
  mcp.tool("list_isos", "List ISOs", { architecture: z.enum(["x86", "arm"]).optional() }, async ({ architecture }) => r(await api.get(`/isos${architecture ? `?architecture=${architecture}` : ""}`)));
}
