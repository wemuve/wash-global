import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServices from "./tools/list-services";
import estimatePrice from "./tools/estimate-price";
import listMyBookings from "./tools/list-my-bookings";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "wewash-global",
  title: "WeWash Global",
  version: "0.1.0",
  instructions:
    "Tools for WeWash, a premium cleaning, maid, pool and car detailing service in Lusaka, Zambia. Use list_services for options, estimate_price for 'starting from' estimates in ZMW (final price confirmed by the team, paid after service), and list_my_bookings for the signed-in customer's bookings.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listServices, estimatePrice, listMyBookings],
});
