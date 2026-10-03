import { defineTool } from "@lovable.dev/mcp-js";
import { SERVICES, ADD_ONS, CONDITIONS, TRANSPORT_ZONES } from "../../pricing";

export default defineTool({
  name: "list_services",
  title: "List services and options",
  description: "List WeWash services, sizes, add-ons, conditions and transport zones with starting prices in ZMW.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const data = {
      services: SERVICES.map((s) => ({
        id: s.id,
        label: s.label,
        allowsDropOff: s.allowsDropOff,
        addOnIds: [...s.addOnIds],
        sizes: s.sizes.map((z) => ({ id: z.id, label: z.label, startingFrom: z.base })),
      })),
      addOns: ADD_ONS.map((a) => ({ id: a.id, label: a.label, amount: a.amount })),
      conditions: CONDITIONS.map((c) => ({ id: c.id, label: c.label, multiplier: c.multiplier })),
      transportZones: TRANSPORT_ZONES.map((t) => ({ id: t.id, amount: t.amount })),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: data,
    };
  },
});
