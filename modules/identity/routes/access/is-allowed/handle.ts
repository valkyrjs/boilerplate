import { cerbos } from "../../../cerbos/client.ts";
import route from "./spec.ts";

export default route.access("session").handle(async ({ body: { resource, action } }, { principal }) => {
  return cerbos.isAllowed({ principal, resource, action });
});
