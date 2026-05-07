# hetzner-mcp

[![npm version](https://img.shields.io/npm/v/hetzner-mcp.svg)](https://www.npmjs.com/package/hetzner-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)
[![MCP SDK](https://img.shields.io/badge/MCP-Official_SDK-purple.svg)](https://modelcontextprotocol.io)
[![Zero Dependencies](https://img.shields.io/badge/deps-0_runtime-brightgreen.svg)](#)
[![Tools](https://img.shields.io/badge/tools-70+-orange.svg)](#tools-70)

A comprehensive MCP server for the Hetzner Cloud API. Significantly more capable than [dkruyt/mcp-hetzner](https://github.com/dkruyt/mcp-hetzner).

## What's better

| Feature | dkruyt/mcp-hetzner | hetzner-mcp |
|---------|-------------------|-------------|
| Networks/Subnets/Routes | ❌ | ✅ |
| Floating IPs | ❌ | ✅ |
| Primary IPs | ❌ | ✅ |
| Load Balancers | ❌ | ✅ |
| Certificates (TLS) | ❌ | ✅ |
| Placement Groups | ❌ | ✅ |
| Server Metrics | ❌ | ✅ |
| Snapshots/Backups | ❌ | ✅ |
| Rescue Mode | ❌ | ✅ |
| Server Rebuild | ❌ | ✅ |
| Server Resize | ❌ | ✅ |
| ISO attach/detach | ❌ | ✅ |
| Reverse DNS | ❌ | ✅ |
| Protection settings | ❌ | ✅ |
| Graceful shutdown | ❌ | ✅ |
| Pricing info | ❌ | ✅ |
| Actions audit log | ❌ | ✅ |
| Label filtering | ❌ | ✅ |
| Language | Python | TypeScript |
| Dependencies | hcloud SDK + dotenv | Zero (native fetch) |
| Architecture | Monolithic 700-line file | Modular per-resource |
| Async | ❌ (blocking) | ✅ (native async) |
| MCP SDK | FastMCP (Python) | Official @modelcontextprotocol/sdk |

## Tools (70+)

### Servers (20 tools)
`list_servers`, `get_server`, `create_server`, `delete_server`, `power_on_server`, `power_off_server`, `shutdown_server`, `reboot_server`, `reset_server`, `rebuild_server`, `resize_server`, `enable_rescue_mode`, `disable_rescue_mode`, `enable_backup`, `disable_backup`, `create_image_from_server`, `get_server_metrics`, `attach_iso_to_server`, `detach_iso_from_server`, `change_server_dns_ptr`, `change_server_protection`, `update_server`

### Volumes (7 tools)
`list_volumes`, `get_volume`, `create_volume`, `delete_volume`, `attach_volume`, `detach_volume`, `resize_volume`

### Firewalls (8 tools)
`list_firewalls`, `get_firewall`, `create_firewall`, `update_firewall`, `delete_firewall`, `set_firewall_rules`, `apply_firewall_to_resources`, `remove_firewall_from_resources`

### Networks (10 tools)
`list_networks`, `get_network`, `create_network`, `delete_network`, `update_network`, `add_subnet_to_network`, `delete_subnet_from_network`, `add_route_to_network`, `delete_route_from_network`, `attach_server_to_network`, `detach_server_from_network`

### Floating IPs (6 tools)
`list_floating_ips`, `get_floating_ip`, `create_floating_ip`, `delete_floating_ip`, `assign_floating_ip`, `unassign_floating_ip`

### Primary IPs (6 tools)
`list_primary_ips`, `get_primary_ip`, `create_primary_ip`, `delete_primary_ip`, `assign_primary_ip`, `unassign_primary_ip`

### Load Balancers (10 tools)
`list_load_balancers`, `get_load_balancer`, `create_load_balancer`, `delete_load_balancer`, `add_target_to_load_balancer`, `remove_target_from_load_balancer`, `add_service_to_load_balancer`, `delete_service_from_load_balancer`, `attach_load_balancer_to_network`, `detach_load_balancer_from_network`, `get_load_balancer_metrics`

### SSH Keys (5 tools)
`list_ssh_keys`, `get_ssh_key`, `create_ssh_key`, `update_ssh_key`, `delete_ssh_key`

### Images & ISOs (5 tools)
`list_images`, `get_image`, `update_image`, `delete_image`, `list_isos`

### Certificates (5 tools)
`list_certificates`, `get_certificate`, `create_managed_certificate`, `create_uploaded_certificate`, `delete_certificate`

### Placement Groups (5 tools)
`list_placement_groups`, `get_placement_group`, `create_placement_group`, `delete_placement_group`, `update_placement_group`

### Info & Pricing (6 tools)
`list_server_types`, `list_locations`, `list_datacenters`, `get_pricing`, `list_actions`, `get_action`

## Installation

```bash
npm install
npm run build
```

Or install globally from npm:

```bash
npx hetzner-mcp
```

## Configuration

Set your Hetzner Cloud API token:

```bash
export HCLOUD_TOKEN=your_token_here
```

### Claude Desktop / Kiro

Add to your MCP config:

```json
{
  "mcpServers": {
    "hetzner": {
      "command": "npx",
      "args": ["-y", "hetzner-mcp"],
      "env": {
        "HCLOUD_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Cursor / VS Code

```json
{
  "mcp": {
    "servers": {
      "hetzner": {
        "command": "npx",
        "args": ["-y", "hetzner-mcp"],
        "env": {
          "HCLOUD_TOKEN": "your_token_here"
        }
      }
    }
  }
}
```

## Development

```bash
npm run dev  # Run with tsx (no build needed)
```

## Releasing

Tag a version to trigger the release workflow:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This will automatically publish to npm and create a GitHub release.

## License

MIT
