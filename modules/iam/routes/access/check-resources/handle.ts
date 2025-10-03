import { cerbos } from "../../../cerbos/client.ts";
import route from "./spec.ts";

export default route.access("session").handle(async ({ body: resources }, { principal }) => {
  return cerbos.checkResources({ principal, resources });
});
