import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r, ok } from "../respond.js";

export function registerFloatingIpTools(mcp: McpServer) {
  mcp.tool("list_floating_ips", "List floating IPs", { label_selector: z.string().optional() }, async ({ label_selector }) => r(await api.get(`/floating_ips${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`)));
  mcp.tool("get_floating_ip", "Get floating IP", { floating_ip_id: z.number() }, async ({ floating_ip_id }) => r(await api.get(`/floating_ips/${floating_ip_id}`)));
  mcp.tool("create_floating_ip", "Create floating IP", { type: z.enum(["ipv4", "ipv6"]), home_location: z.string().optional(), server: z.number().optional(), description: z.string().optional(), labels: z.record(z.string()).optional(), name: z.string().optional() }, async (p) => r(await api.post("/floating_ips", p)));
  mcp.tool("delete_floating_ip", "Delete floating IP", { floating_ip_id: z.number() }, async ({ floating_ip_id }) => { await api.delete(`/floating_ips/${floating_ip_id}`); return ok("Deleted"); });
  mcp.tool("assign_floating_ip", "Assign to server", { floating_ip_id: z.number(), server: z.number() }, async ({ floating_ip_id, server }) => r(await api.post(`/floating_ips/${floating_ip_id}/actions/assign`, { server })));
  mcp.tool("unassign_floating_ip", "Unassign from server", { floating_ip_id: z.number() }, async ({ floating_ip_id }) => r(await api.post(`/floating_ips/${floating_ip_id}/actions/unassign`)));
}

export function registerPrimaryIpTools(mcp: McpServer) {
  mcp.tool("list_primary_ips", "List primary IPs", { label_selector: z.string().optional() }, async ({ label_selector }) => r(await api.get(`/primary_ips${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`)));
  mcp.tool("get_primary_ip", "Get primary IP", { primary_ip_id: z.number() }, async ({ primary_ip_id }) => r(await api.get(`/primary_ips/${primary_ip_id}`)));
  mcp.tool("create_primary_ip", "Create primary IP", { name: z.string(), type: z.enum(["ipv4", "ipv6"]), assignee_type: z.enum(["server"]), assignee_id: z.number().optional(), datacenter: z.string().optional(), auto_delete: z.boolean().optional(), labels: z.record(z.string()).optional() }, async (p) => r(await api.post("/primary_ips", p)));
  mcp.tool("delete_primary_ip", "Delete primary IP", { primary_ip_id: z.number() }, async ({ primary_ip_id }) => { await api.delete(`/primary_ips/${primary_ip_id}`); return ok("Deleted"); });
  mcp.tool("assign_primary_ip", "Assign to server", { primary_ip_id: z.number(), assignee_id: z.number(), assignee_type: z.enum(["server"]) }, async ({ primary_ip_id, ...b }) => r(await api.post(`/primary_ips/${primary_ip_id}/actions/assign`, b)));
  mcp.tool("unassign_primary_ip", "Unassign", { primary_ip_id: z.number() }, async ({ primary_ip_id }) => r(await api.post(`/primary_ips/${primary_ip_id}/actions/unassign`)));
}
