import { Pencil } from "lucide-react";
import { Button } from "../../shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/ui/dialog";
import { Input } from "../../shadcn/ui/input";
import { Label } from "../../shadcn/ui/label";
import { FC } from "react";
import { DefaultService, Domain } from "../../api/client";
import { CardTitle } from "../../shadcn/ui/card";
import { refetchAllDomainsAtom } from "../../pages/MainPage";
import { useAtomValue } from "jotai";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface IEditDomainButton {
  domain: Domain;
}
const EditDomainButton: FC<IEditDomainButton> = ({ domain }) => {
  const refetchAllDomains = useAtomValue(refetchAllDomainsAtom);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <Pencil strokeWidth={1.5} className="p-0.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={async (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            const newIP = e.target.ip.value;
            const res = await DefaultService.postApiDomain({
              name: domain.name,
              ip: newIP,
            });
            if (res === "ok") {
              refetchAllDomains.fn();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit domain data</DialogTitle>
            <DialogDescription>
              Make changes to domain entry here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Domain</Label>
              <CardTitle>{domain.name}</CardTitle>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ip" className="text-right">
                ip
              </Label>
              <Input
                id="ip"
                defaultValue={domain.ip || "255.255.255.255"}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogPrimitive.Close>
              <Button type="submit">Save changes</Button>
            </DialogPrimitive.Close>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDomainButton;
