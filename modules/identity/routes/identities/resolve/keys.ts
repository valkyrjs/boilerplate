import { importVault } from "@platform/vault";

import { config } from "../../../config.ts";

export const vault = importVault(config.internal);
