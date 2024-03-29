import { SquarePlus } from "lucide-react";
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
import { Label } from "@radix-ui/react-label";
import { Input } from "../../shadcn/ui/input";
import { DefaultService } from "../../api/client";
import { refetchAllDomainsAtom } from "../../pages/MainPage";
import { useAtomValue } from "jotai";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const AddDomainButton = () => {
  const refetchAllDomains = useAtomValue(refetchAllDomainsAtom);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <SquarePlus strokeWidth={1.5} />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={async (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            const domain = e.target.domain.value;
            const res = await DefaultService.postApiDomain({
              name: domain,
            });
            if (res === "ok") {
              refetchAllDomains.fn();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Add domain</DialogTitle>
            <DialogDescription>Add domain from duckdns</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4 py-4">
            <Label htmlFor="domain" className="text-right">
              Domain
            </Label>
            <Input
              id="domain"
              placeholder="domain.duckdns.org"
              className="col-span-3"
              contentEditable="plaintext-only"
            />
          </div>
          <DialogFooter>
            <DialogPrimitive.Close>
              <Button type="submit">Add</Button>
            </DialogPrimitive.Close>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDomainButton;
