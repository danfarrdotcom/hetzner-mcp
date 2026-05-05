import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r, ok } from "../respond.js";

export function registerSSHKeyTools(mcp: McpServer) {
  mcp.tool("list_ssh_keys", "List SSH keys", { label_selector: z.string().optional() }, async ({ label_selector }) => r(await api.get(`/ssh_keys${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`)));
  mcp.tool("get_ssh_key", "Get SSH key", { ssh_key_id: z.number() }, async ({ ssh_key_id }) => r(await api.get(`/ssh_keys/${ssh_key_id}`)));
  mcp.tool("create_ssh_key", "Create SSH key", { name: z.string(), public_key: z.string(), labels: z.record(z.string()).optional() }, async (p) => r(await api.post("/ssh_keys", p)));
  mcp.tool("update_ssh_key", "Update SSH key", { ssh_key_id: z.number(), name: z.string().optional(), labels: z.record(z.string()).optional() }, async ({ ssh_key_id, ...b }) => r(await api.put(`/ssh_keys/${ssh_key_id}`, b)));
  mcp.tool("delete_ssh_key", "Delete SSH key", { ssh_key_id: z.number() }, async ({ ssh_key_id }) => { await api.delete(`/ssh_keys/${ssh_key_id}`); return ok("Deleted"); });
}
