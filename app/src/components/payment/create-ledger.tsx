import { currencies } from "@module/payment/client";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { SidebarMenuSubButton } from "@/components/ui/sidebar.tsx";

import { makeControllerComponent } from "../../lib/controller.tsx";
import { CreateLedgerController } from "./create-ledger.controller.ts";

export const DialogCreateLedger = makeControllerComponent(
  CreateLedgerController,
  ({ title, setLabel, setCurrencies, submit, isSubmitting, ...props }) => {
    const labelId = useId();
    return (
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <SidebarMenuSubButton className="cursor-pointer bg-secondary hover:bg-secondary/70">
              <props.icon /> <span>{title}</span>
            </SidebarMenuSubButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create ledger</DialogTitle>
              <DialogDescription>Create a payment ledger and its supported currencies</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor={labelId}>Label</Label>
                <Input id={labelId} name="label" onChange={({ target: { value } }) => setLabel(value)} />
              </div>
              <div className="grid gap-3">
                <Label>Currencies</Label>
                <MultiSelect onValuesChange={setCurrencies}>
                  <MultiSelectTrigger className="w-full max-w-[400px]">
                    <MultiSelectValue placeholder="Select frameworks..." />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {currencies.map((currency) => (
                        <MultiSelectItem key={currency} value={currency}>
                          {currency}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={submit}>
                <LoadingSwap isLoading={isSubmitting}>Create</LoadingSwap>
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    );
  },
);
