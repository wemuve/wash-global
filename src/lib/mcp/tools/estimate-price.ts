import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { calculatePrice } from "../../pricing";

export default defineTool({
  name: "estimate_price",
  title: "Estimate price",
  description: "Calculate a 'starting from' WeWash price estimate in ZMW. The team must confirm the final price.",
  inputSchema: {
    serviceId: z.string().describe("Service id from list_services."),
    sizeId: z.string().describe("Size id for that service."),
    conditionId: z.string().optional().describe("Condition id, if known."),
    addOnIds: z.array(z.string()).optional().describe("Add-on ids."),
    serviceMode: z.enum(["mobile", "dropoff"]).default("mobile"),
    transportZoneId: z.string().optional().describe("Transport zone id for mobile service."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (input) => {
    try {
      const r = calculatePrice(input);
      const data = {
        service: r.serviceLabel,
        startingFrom: r.total,
        rangeMax: r.range.max,
        currency: "ZMW",
        confidence: r.confidence,
        breakdown: r.breakdown.map((b) => ({ item: b.item, amount: b.amount })),
        note: "Starting-from estimate. Final price is confirmed by the WeWash team; payment is after service.",
      };
      return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data };
    } catch (e) {
      throw new ToolError(e instanceof Error ? e.message : "Could not calculate estimate");
    }
  },
});
