import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r, ok } from "../respond.js";

export function registerLoadBalancerTools(mcp: McpServer) {
  mcp.tool("list_load_balancers", "List load balancers", { label_selector: z.string().optional() }, async ({ label_selector }) => r(await api.get(`/load_balancers${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`)));
  mcp.tool("get_load_balancer", "Get LB details", { load_balancer_id: z.number() }, async ({ load_balancer_id }) => r(await api.get(`/load_balancers/${load_balancer_id}`)));

  mcp.tool("create_load_balancer", "Create load balancer", {
    name: z.string(), load_balancer_type: z.string().describe("e.g. lb11"), location: z.string().optional(), network_zone: z.string().optional(),
    algorithm: z.object({ type: z.enum(["round_robin", "least_connections"]) }).optional(),
    services: z.array(z.object({ protocol: z.enum(["tcp", "http", "https"]), listen_port: z.number(), destination_port: z.number(), proxyprotocol: z.boolean().optional(),
      health_check: z.object({ protocol: z.enum(["tcp", "http", "https"]), port: z.number(), interval: z.number().optional(), timeout: z.number().optional(), retries: z.number().optional() }).optional(),
      http: z.object({ cookie_name: z.string().optional(), certificates: z.array(z.number()).optional(), redirect_http: z.boolean().optional(), sticky_sessions: z.boolean().optional() }).optional(),
    })).optional(),
    targets: z.array(z.object({ type: z.enum(["server", "label_selector", "ip"]), server: z.object({ id: z.number() }).optional(), label_selector: z.object({ selector: z.string() }).optional(), ip: z.object({ ip: z.string() }).optional(), use_private_ip: z.boolean().optional() })).optional(),
    network: z.number().optional(), public_interface: z.boolean().optional(), labels: z.record(z.string()).optional(),
  }, async (p) => r(await api.post("/load_balancers", p)));

  mcp.tool("delete_load_balancer", "Delete LB", { load_balancer_id: z.number() }, async ({ load_balancer_id }) => { await api.delete(`/load_balancers/${load_balancer_id}`); return ok("Deleted"); });

  mcp.tool("add_target_to_load_balancer", "Add target", { load_balancer_id: z.number(), type: z.enum(["server", "label_selector", "ip"]), server: z.object({ id: z.number() }).optional(), label_selector: z.object({ selector: z.string() }).optional(), ip: z.object({ ip: z.string() }).optional(), use_private_ip: z.boolean().optional() }, async ({ load_balancer_id, ...b }) => r(await api.post(`/load_balancers/${load_balancer_id}/actions/add_target`, b)));

  mcp.tool("remove_target_from_load_balancer", "Remove target", { load_balancer_id: z.number(), type: z.enum(["server", "label_selector", "ip"]), server: z.object({ id: z.number() }).optional(), label_selector: z.object({ selector: z.string() }).optional(), ip: z.object({ ip: z.string() }).optional() }, async ({ load_balancer_id, ...b }) => r(await api.post(`/load_balancers/${load_balancer_id}/actions/remove_target`, b)));

  mcp.tool("add_service_to_load_balancer", "Add service", { load_balancer_id: z.number(), protocol: z.enum(["tcp", "http", "https"]), listen_port: z.number(), destination_port: z.number(), proxyprotocol: z.boolean().optional(), health_check: z.object({ protocol: z.enum(["tcp", "http", "https"]), port: z.number(), interval: z.number().optional(), timeout: z.number().optional(), retries: z.number().optional() }).optional() }, async ({ load_balancer_id, ...b }) => r(await api.post(`/load_balancers/${load_balancer_id}/actions/add_service`, b)));

  mcp.tool("delete_service_from_load_balancer", "Remove service", { load_balancer_id: z.number(), listen_port: z.number() }, async ({ load_balancer_id, listen_port }) => r(await api.post(`/load_balancers/${load_balancer_id}/actions/delete_service`, { listen_port })));
}
