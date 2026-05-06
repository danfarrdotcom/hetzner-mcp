import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r, ok } from "../respond.js";

export function registerPlacementGroupTools(mcp: McpServer) {
  mcp.tool("list_placement_groups", "List placement groups", { label_selector: z.string().optional() }, async ({ label_selector }) => r(await api.get(`/placement_groups${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`)));
  mcp.tool("get_placement_group", "Get placement group", { placement_group_id: z.number() }, async ({ placement_group_id }) => r(await api.get(`/placement_groups/${placement_group_id}`)));
  mcp.tool("create_placement_group", "Create placement group", { name: z.string(), type: z.enum(["spread"]), labels: z.record(z.string()).optional() }, async (p) => r(await api.post("/placement_groups", p)));
  mcp.tool("delete_placement_group", "Delete placement group", { placement_group_id: z.number() }, async ({ placement_group_id }) => { await api.delete(`/placement_groups/${placement_group_id}`); return ok("Deleted"); });
  mcp.tool("update_placement_group", "Update name/labels", { placement_group_id: z.number(), name: z.string().optional(), labels: z.record(z.string()).optional() }, async ({ placement_group_id, ...b }) => r(await api.put(`/placement_groups/${placement_group_id}`, b)));
}
