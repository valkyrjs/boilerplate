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
import { LoadingSwap } from "@/components/ui/loading-swap";
import { SidebarMenuSubButton } from "@/components/ui/sidebar.tsx";

import { makeControllerComponent } from "../../lib/controller.tsx";
import { FieldDescription, FieldGroup, FieldLabel } from "../ui/field.tsx";
import { CreateBeneficiaryController } from "./create.controller.ts";

export const DialogCreateBeneficiary = makeControllerComponent(
  CreateBeneficiaryController,
  ({ title, label, setLabel, submit, isSubmitting, ...props }) => {
    const labelId = useId();
    return (
      <Dialog>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <DialogTrigger asChild>
            <SidebarMenuSubButton className="cursor-pointer bg-secondary hover:bg-secondary/70">
              <props.icon /> <span>{title}</span>
            </SidebarMenuSubButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Beneficiary</DialogTitle>
              <DialogDescription>Create a payment ledger and its supported currencies</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <FieldLabel htmlFor={labelId}>Label</FieldLabel>
              <Input
                id={labelId}
                name="label"
                value={label}
                onChange={({ target: { value } }) => setLabel(value)}
                required
              />
              <FieldDescription>Enter the identifying label for the Beneficiary</FieldDescription>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <LoadingSwap isLoading={isSubmitting}>Create</LoadingSwap>
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    );
  },
);
