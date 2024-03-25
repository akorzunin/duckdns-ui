import { Plus } from "lucide-react";
import { Button } from "../../shadcn/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/ui/dialog";
import { Label } from "../../shadcn/ui/label";
import { CardTitle } from "../../shadcn/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/ui/select";
import { FC, useState } from "react";
import { DefaultService } from "../../api/client";
import { useAtomValue } from "jotai";
import { isDevModeAtom } from "../DevModeBadge";
import { cn } from "../../lib/utils";

interface IAddTaskButton {
  domainName: string;
  refetch: () => void;
}
const AddTaskButton: FC<IAddTaskButton> = ({ domainName, refetch }) => {
  const [interval, setInterval] = useState<string | null>(null);
  const isDevMode = useAtomValue(isDevModeAtom);
  const onSubmit = async () => {
    if (!interval) {
      return;
    }
    const res = await DefaultService.postApiTask({
      domain: domainName,
      interval: interval,
    });
    if (res === "ok") {
      refetch();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <Plus strokeWidth={0.8} />
          Add task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Run periodiacal task to update ip of this domain. Task will
            automatically get ip from <b>ifconfig.me</b> and send it to duckdns
            server.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Domain:</Label>
            <CardTitle>test.domain</CardTitle>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Select
              name="interval"
              onValueChange={(v) => setInterval(v)}
              // defaultValue="1m"
            >
              <Label className="text-right">Interval</Label>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem className={cn(!isDevMode && "hidden")} value="1s">
                    1 second (dev)
                  </SelectItem>
                  <SelectItem className={cn(!isDevMode && "hidden")} value="5s">
                    5 seconds (dev)
                  </SelectItem>
                  <SelectItem value="1m">1 minute</SelectItem>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="10m">10 minutes</SelectItem>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="2h">2 hours</SelectItem>
                  <SelectItem value="1d">24 hours</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button onClick={onSubmit} type="submit">
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskButton;
