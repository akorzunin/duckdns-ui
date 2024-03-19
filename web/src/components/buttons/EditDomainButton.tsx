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

const EditDomainButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <Pencil strokeWidth={0.8} className="p-0.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit domain data</DialogTitle>
          <DialogDescription>
            Make changes to domain entry here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="domain" className="text-right">
              Domain
            </Label>
            <Input id="domain" value="test.domain" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ip" className="text-right">
              ip
            </Label>
            <Input id="ip" value="127.0.0.1" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDomainButton;
