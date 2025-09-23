import { NotFoundError, route, UnauthorizedError } from "@platform/relay";
import z from "zod";

export default route.get("/api/v1/identity/me").errors([UnauthorizedError, NotFoundError]).response(z.any());
