import route from "./spec.ts";

export default route.handle(async ({ body }) => {
  console.log(body);
});
