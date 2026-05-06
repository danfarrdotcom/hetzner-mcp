import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { api } from "../api.js";
import { r, ok } from "../respond.js";

export function registerCertificateTools(mcp: McpServer) {
  mcp.tool("list_certificates", "List TLS certificates", { label_selector: z.string().optional() }, async ({ label_selector }) => r(await api.get(`/certificates${label_selector ? `?label_selector=${encodeURIComponent(label_selector)}` : ""}`)));
  mcp.tool("get_certificate", "Get certificate details", { certificate_id: z.number() }, async ({ certificate_id }) => r(await api.get(`/certificates/${certificate_id}`)));
  mcp.tool("create_managed_certificate", "Create Let's Encrypt cert", { name: z.string(), domain_names: z.array(z.string()), labels: z.record(z.string()).optional() }, async ({ name, domain_names, labels }) => r(await api.post("/certificates", { name, domain_names, type: "managed", labels })));
  mcp.tool("create_uploaded_certificate", "Upload custom TLS cert", { name: z.string(), certificate: z.string().describe("PEM cert"), private_key: z.string().describe("PEM key"), labels: z.record(z.string()).optional() }, async ({ name, certificate, private_key, labels }) => r(await api.post("/certificates", { name, certificate, private_key, type: "uploaded", labels })));
  mcp.tool("delete_certificate", "Delete certificate", { certificate_id: z.number() }, async ({ certificate_id }) => { await api.delete(`/certificates/${certificate_id}`); return ok("Deleted"); });
}
