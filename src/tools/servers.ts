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

  mcp.tool("rebuild_server", "Rebuild with new image (destroys data)", { server_id: z.number(), image: z.string() }, async ({ server_id, image }) => r(await api.post(`/servers/${server_id}/actions/rebuild`, { image })));

  mcp.tool("resize_server", "Change type (power off first)", { server_id: z.number(), server_type: z.string(), upgrade_disk: z.boolean().optional() }, async ({ server_id, ...b }) => r(await api.post(`/servers/${server_id}/actions/change_type`, b)));

  mcp.tool("enable_rescue_mode", "Enable rescue mode", { server_id: z.number(), type: z.enum(["linux64"]).optional(), ssh_keys: z.array(z.number()).optional() }, async ({ server_id, ...b }) => r(await api.post(`/servers/${server_id}/actions/enable_rescue`, b)));
  mcp.tool("disable_rescue_mode", "Disable rescue mode", { server_id: z.number() }, async ({ server_id }) => r(await api.post(`/servers/${server_id}/actions/disable_rescue`)));

  mcp.tool("enable_backup", "Enable backups", { server_id: z.number() }, async ({ server_id }) => r(await api.post(`/servers/${server_id}/actions/enable_backup`)));
  mcp.tool("disable_backup", "Disable backups", { server_id: z.number() }, async ({ server_id }) => r(await api.post(`/servers/${server_id}/actions/disable_backup`)));

  mcp.tool("create_image_from_server", "Create snapshot from server", { server_id: z.number(), description: z.string().optional(), type: z.enum(["snapshot", "backup"]).optional(), labels: z.record(z.string()).optional() }, async ({ server_id, ...b }) => r(await api.post(`/servers/${server_id}/actions/create_image`, b)));

  mcp.tool("get_server_metrics", "Get CPU/disk/network metrics", { server_id: z.number(), type: z.string().describe("cpu,disk,network"), start: z.string().describe("ISO8601"), end: z.string().describe("ISO8601") }, async ({ server_id, type, start, end }) => r(await api.get(`/servers/${server_id}/metrics?type=${type}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)));

  mcp.tool("attach_iso_to_server", "Attach ISO", { server_id: z.number(), iso: z.string() }, async ({ server_id, iso }) => r(await api.post(`/servers/${server_id}/actions/attach_iso`, { iso })));
  mcp.tool("detach_iso_from_server", "Detach ISO", { server_id: z.number() }, async ({ server_id }) => r(await api.post(`/servers/${server_id}/actions/detach_iso`)));

  mcp.tool("change_server_dns_ptr", "Set reverse DNS", { server_id: z.number(), ip: z.string(), dns_ptr: z.string().nullable() }, async ({ server_id, ...b }) => r(await api.post(`/servers/${server_id}/actions/change_dns_ptr`, b)));

  mcp.tool("change_server_protection", "Set delete/rebuild protection", { server_id: z.number(), delete: z.boolean().optional(), rebuild: z.boolean().optional() }, async ({ server_id, ...b }) => r(await api.post(`/servers/${server_id}/actions/change_protection`, b)));

  mcp.tool("update_server", "Update name/labels", { server_id: z.number(), name: z.string().optional(), labels: z.record(z.string()).optional() }, async ({ server_id, ...b }) => r(await api.put(`/servers/${server_id}`, b)));
}
