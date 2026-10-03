import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_my_bookings",
  title: "List my bookings",
  description: "List the signed-in customer's WeWash bookings, newest first.",
  inputSchema: { limit: z.number().int().min(1).max(50).default(10) },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("bookings")
      .select("id, status, scheduled_date, scheduled_time, total_amount, currency, customer_address, created_at")
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const bookings = (data ?? []).map((b) => ({
      id: b.id,
      status: b.status,
      scheduledDate: b.scheduled_date,
      scheduledTime: b.scheduled_time,
      totalAmount: b.total_amount,
      currency: b.currency ?? "ZMW",
      address: b.customer_address,
      createdAt: b.created_at,
    }));
    return { content: [{ type: "text", text: JSON.stringify(bookings) }], structuredContent: { bookings } };
  },
});
