import { makeControllerComponent } from "@/lib/controller.tsx";

import { ReadBeneficiaryController } from "./read.controller.ts";

export const BeneficiaryComponent = makeControllerComponent(ReadBeneficiaryController, ({ beneficiary }) => {
  if (beneficiary === undefined) {
    return (
      <div className="w-full flex flex-col pt-20 items-center justify-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Beneficiary Not Found</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">Beneficiary with id "xxx" cannot be found.</p>
      </div>
    );
  }
  return <pre>{JSON.stringify(beneficiary, null, 2)}</pre>;
});
