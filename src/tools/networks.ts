import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r, ok } from "../respond.js";

export function registerNetworkTools(mcp: McpServer) {
  mcp.tool("list_networks", "List networks", { label_selector: z.string().optional() }, async ({ label_selector }) => r(await api.get(`/networks${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`)));
  mcp.tool("get_network", "Get network details", { network_id: z.number() }, async ({ network_id }) => r(await api.get(`/networks/${network_id}`)));

  mcp.tool("create_network", "Create private network", {
    name: z.string(), ip_range: z.string().describe("CIDR e.g. 10.0.0.0/16"),
    subnets: z.array(z.object({ type: z.enum(["cloud", "server", "vswitch"]), ip_range: z.string(), network_zone: z.string(), vswitch_id: z.number().optional() })).optional(),
    routes: z.array(z.object({ destination: z.string(), gateway: z.string() })).optional(),
    labels: z.record(z.string()).optional(),
  }, async (p) => r(await api.post("/networks", p)));

  mcp.tool("delete_network", "Delete network", { network_id: z.number() }, async ({ network_id }) => { await api.delete(`/networks/${network_id}`); return ok("Deleted"); });
  mcp.tool("update_network", "Update name/labels", { network_id: z.number(), name: z.string().optional(), labels: z.record(z.string()).optional() }, async ({ network_id, ...b }) => r(await api.put(`/networks/${network_id}`, b)));

  mcp.tool("add_subnet_to_network", "Add subnet", { network_id: z.number(), type: z.enum(["cloud", "server", "vswitch"]), ip_range: z.string(), network_zone: z.string(), vswitch_id: z.number().optional() }, async ({ network_id, ...b }) => r(await api.post(`/networks/${network_id}/actions/add_subnet`, b)));
  mcp.tool("delete_subnet_from_network", "Remove subnet", { network_id: z.number(), ip_range: z.string() }, async ({ network_id, ip_range }) => r(await api.post(`/networks/${network_id}/actions/delete_subnet`, { ip_range })));

  mcp.tool("add_route_to_network", "Add route", { network_id: z.number(), destination: z.string(), gateway: z.string() }, async ({ network_id, ...b }) => r(await api.post(`/networks/${network_id}/actions/add_route`, b)));
  mcp.tool("delete_route_from_network", "Remove route", { network_id: z.number(), destination: z.string(), gateway: z.string() }, async ({ network_id, ...b }) => r(await api.post(`/networks/${network_id}/actions/delete_route`, b)));

  mcp.tool("attach_server_to_network", "Attach server to network", { server_id: z.number(), network: z.number(), ip: z.string().optional(), alias_ips: z.array(z.string()).optional() }, async ({ server_id, ...b }) => r(await api.post(`/servers/${server_id}/actions/attach_to_network`, b)));
  mcp.tool("detach_server_from_network", "Detach server from network", { server_id: z.number(), network: z.number() }, async ({ server_id, network }) => r(await api.post(`/servers/${server_id}/actions/detach_from_network`, { network })));
}
