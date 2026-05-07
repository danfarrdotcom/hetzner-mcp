# hetzner-mcp

A comprehensive MCP server for the Hetzner Cloud API. Significantly more capable than dkruyt/mcp-hetzner.

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
npm run dev
```

## License

MIT
