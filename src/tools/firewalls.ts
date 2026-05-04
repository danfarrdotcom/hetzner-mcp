import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r, ok } from "../respond.js";

const ruleSchema = z.object({
  direction: z.enum(["in", "out"]),
  protocol: z.enum(["tcp", "udp", "icmp", "esp", "gre"]),
  port: z.string().optional(),
  source_ips: z.array(z.string()).optional(),
  destination_ips: z.array(z.string()).optional(),
  description: z.string().optional(),
});

const resourceSchema = z.object({
  type: z.enum(["server", "label_selector"]),
  server: z.object({ id: z.number() }).optional(),
  label_selector: z.object({ selector: z.string() }).optional(),
});

export function registerFirewallTools(mcp: McpServer) {
  mcp.tool("list_firewalls", "List firewalls", { label_selector: z.string().optional() }, async ({ label_selector }) => r(await api.get(`/firewalls${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`)));
  mcp.tool("get_firewall", "Get firewall details", { firewall_id: z.number() }, async ({ firewall_id }) => r(await api.get(`/firewalls/${firewall_id}`)));
  mcp.tool("create_firewall", "Create firewall", { name: z.string(), rules: z.array(ruleSchema).optional(), labels: z.record(z.string()).optional(), apply_to: z.array(resourceSchema).optional() }, async (p) => r(await api.post("/firewalls", p)));
  mcp.tool("update_firewall", "Update name/labels", { firewall_id: z.number(), name: z.string().optional(), labels: z.record(z.string()).optional() }, async ({ firewall_id, ...b }) => r(await api.put(`/firewalls/${firewall_id}`, b)));
  mcp.tool("delete_firewall", "Delete firewall", { firewall_id: z.number() }, async ({ firewall_id }) => { await api.delete(`/firewalls/${firewall_id}`); return ok("Deleted"); });
  mcp.tool("set_firewall_rules", "Replace all rules", { firewall_id: z.number(), rules: z.array(ruleSchema) }, async ({ firewall_id, rules }) => r(await api.post(`/firewalls/${firewall_id}/actions/set_rules`, { rules })));
  mcp.tool("apply_firewall_to_resources", "Apply to resources", { firewall_id: z.number(), apply_to: z.array(resourceSchema) }, async ({ firewall_id, apply_to }) => r(await api.post(`/firewalls/${firewall_id}/actions/apply_to_resources`, { apply_to })));
  mcp.tool("remove_firewall_from_resources", "Remove from resources", { firewall_id: z.number(), remove_from: z.array(resourceSchema) }, async ({ firewall_id, remove_from }) => r(await api.post(`/firewalls/${firewall_id}/actions/remove_from_resources`, { remove_from })));
}
