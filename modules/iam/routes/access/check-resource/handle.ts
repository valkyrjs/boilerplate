import { cerbos } from "../../../cerbos/client.ts";
import route from "./spec.ts";

export default route.access("session").handle(async ({ body: { resource, actions } }, { principal }) => {
  return cerbos.checkResource({ principal, resource, actions });
});
