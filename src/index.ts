/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * @csoai/insurance-ai
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Copyright (c) 2026 CSGA Global. All rights reserved.
 * Part of the CSGA Global MCP Ecosystem.
 *
 * LEGAL NOTICE: This software is provided for informational and advisory
 * purposes only. It does not constitute legal, regulatory, or professional
 * compliance advice. Users should consult qualified legal counsel for
 * jurisdiction-specific compliance requirements.
 *
 * License: CC0-1.0 (Creative Commons Zero v1.0 Universal)
 * SPDX-License-Identifier: CC0-1.0
 *
 * Build Timestamp: 2026-02-26T06:00:00Z
 * Last Modified:   2026-02-26T06:00:00Z
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { handleUnderwritingCompliance } from "./tools/underwriting-ai-compliance.js";
import { handleClaimsAiAssessment } from "./tools/claims-ai-assessment.js";

const server = new McpServer({
  name: "csoai-insurance-ai-mcp",
  version: "1.0.0"
});

// Schemas extracted to avoid TS2589 deep instantiation
const UnderwritingComplianceShape = {
  system_name: z.string().describe("Name of the underwriting system"),
  ai_model_type: z.string().describe("Model type (ML scoring, risk classification, automated decisioning, hybrid)"),
  data_inputs: z.string().describe("Data inputs used (demographics, credit, telematics, social media, health records)"),
  protected_characteristics: z.string().describe("Protected classes considered (race, gender, age, disability, genetic)"),
  jurisdiction: z.string().describe("Operating jurisdiction (EU, US state, UK, Australia, etc.)"),
};

const ClaimsAiAssessmentShape = {
  system_name: z.string().describe("Name of claims system"),
  automation_level: z.string().describe("Automation level (fully automated, human-in-loop, triage only, recommendation)"),
  claim_types: z.string().describe("Claim types processed (auto, health, property, life, disability)"),
  fraud_detection: z.string().describe("Fraud detection method (ML scoring, anomaly detection, network analysis, rule-based)"),
  jurisdiction: z.string().describe("Operating jurisdiction"),
};

// ─── Tool 1: underwriting_ai_compliance ───
(server.tool as any)(
  "underwriting_ai_compliance",
  "Assess regulatory compliance for AI-driven insurance underwriting. Covers discrimination, proxy variables, transparency, and actuarial fairness.",
  UnderwritingComplianceShape,
  async (args: any) => {
    const result = handleUnderwritingCompliance(args.system_name, args.ai_model_type, args.data_inputs, args.protected_characteristics, args.jurisdiction);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ─── Tool 2: claims_ai_assessment ───
(server.tool as any)(
  "claims_ai_assessment",
  "Assess compliance for AI-driven claims processing. Covers automated approvals/denials, fraud detection fairness, and consumer rights.",
  ClaimsAiAssessmentShape,
  async (args: any) => {
    const result = handleClaimsAiAssessment(args.system_name, args.automation_level, args.claim_types, args.fraud_detection, args.jurisdiction);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
