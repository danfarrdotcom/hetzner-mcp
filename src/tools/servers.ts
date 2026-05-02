import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r } from "../respond.js";

export function registerServerTools(mcp: McpServer) {
  mcp.tool("list_servers", "List all servers", { label_selector: z.string().optional().describe("Label filter e.g. env=prod") }, async ({ label_selector }) => {
    return r(await api.get(`/servers${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`));
  });

  mcp.tool("get_server", "Get server details", { server_id: z.number() }, async ({ server_id }) => {
    return r(await api.get(`/servers/${server_id}`));
  });

  mcp.tool("create_server", "Create a server", {
    name: z.string(),
    server_type: z.string().describe("e.g. cx22, cpx11, cax11"),
    image: z.string().describe("e.g. ubuntu-24.04"),
    location: z.string().optional().describe("e.g. nbg1, fsn1, hel1, ash"),
    datacenter: z.string().optional(),
    ssh_keys: z.array(z.union([z.string(), z.number()])).optional(),
    networks: z.array(z.number()).optional(),
    firewalls: z.array(z.object({ firewall: z.number() })).optional(),
    user_data: z.string().optional().describe("Cloud-init"),
    labels: z.record(z.string()).optional(),
    volumes: z.array(z.number()).optional(),
    public_net: z.object({ enable_ipv4: z.boolean().optional(), enable_ipv6: z.boolean().optional(), ipv4: z.number().optional(), ipv6: z.number().optional() }).optional(),
    placement_group: z.number().optional(),
    start_after_create: z.boolean().optional(),
  }, async (p) => r(await api.post("/servers", p)));

  mcp.tool("delete_server", "Delete a server", { server_id: z.number() }, async ({ server_id }) => r(await api.delete(`/servers/${server_id}`)));

  mcp.tool("power_on_server", "Power on", { server_id: z.number() }, async ({ server_id }) => r(await api.post(`/servers/${server_id}/actions/poweron`)));
  mcp.tool("power_off_server", "Force power off", { server_id: z.number() }, async ({ server_id }) => r(await api.post(`/servers/${server_id}/actions/poweroff`)));
  mcp.tool("shutdown_server", "Graceful ACPI shutdown", { server_id: z.number() }, async ({ server_id }) => r(await api.post(`/servers/${server_id}/actions/shutdown`)));
  mcp.tool("reboot_server", "Soft reboot", { server_id: z.number() }, async ({ server_id }) => r(await api.post(`/servers/${server_id}/actions/reboot`)));
  mcp.tool("reset_server", "Hard reset", { server_id: z.number() }, async ({ server_id }) => r(await api.post(`/servers/${server_id}/actions/reset`)));
}
