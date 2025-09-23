import route from "./spec.ts";

export default route.access("session").handle(async ({ principal }) => {
  return principal;
});
