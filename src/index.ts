#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setToken } from "./api.js";
import { registerServerTools } from "./tools/servers.js";
import { registerVolumeTools } from "./tools/volumes.js";
import { registerFirewallTools } from "./tools/firewalls.js";
import { registerNetworkTools } from "./tools/networks.js";
import { registerFloatingIpTools, registerPrimaryIpTools } from "./tools/floating-ips.js";
import { registerLoadBalancerTools } from "./tools/load-balancers.js";
import { registerSSHKeyTools } from "./tools/ssh-keys.js";
import { registerImageTools, registerInfoTools } from "./tools/images.js";
import { registerCertificateTools } from "./tools/certificates.js";
import { registerPlacementGroupTools } from "./tools/placement-groups.js";

const token = process.env.HCLOUD_TOKEN;
if (!token) {
  console.error("Error: HCLOUD_TOKEN environment variable is required");
  process.exit(1);
}
setToken(token);

const mcp = new McpServer({
  name: "hetzner-cloud",
  version: "1.0.0",
});

registerServerTools(mcp);
registerVolumeTools(mcp);
registerFirewallTools(mcp);
registerNetworkTools(mcp);
registerFloatingIpTools(mcp);
registerPrimaryIpTools(mcp);
registerLoadBalancerTools(mcp);
registerSSHKeyTools(mcp);
registerImageTools(mcp);
registerInfoTools(mcp);
registerCertificateTools(mcp);
registerPlacementGroupTools(mcp);

const transport = new StdioServerTransport();
await mcp.connect(transport);
