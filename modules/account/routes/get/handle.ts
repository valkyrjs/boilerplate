import route from "./spec.ts";

export default route.handle(async ({ params }) => {
  console.log(params);
});
