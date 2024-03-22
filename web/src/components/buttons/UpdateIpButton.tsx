import { Ban, CircleCheck, CloudUpload } from "lucide-react";
import { DefaultService, Domain } from "../../api/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../shadcn/ui/alert-dialog";
import { Button } from "../../shadcn/ui/button";
import { FC } from "react";
import { toast } from "sonner";
import { useAtomValue } from "jotai";
import { refetchAllDomainsAtom } from "../../pages/MainPage";

interface IUpdateIpButton {
  domain: Domain;
}
const UpdateIpButton: FC<IUpdateIpButton> = ({ domain }) => {
  const refetchAllDomains = useAtomValue(refetchAllDomainsAtom);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <CloudUpload strokeWidth={1.5} />
          Update IP
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update ip for domain?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will set <b>new</b> ip for domain <b>{domain.name}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              if (!domain.name) {
                toast("Domain name is empty.", {
                  duration: 5000,
                  description: `${domain.name} on ${domain.ip || "_"}`,
                  icon: <Ban />,
                });
                return;
              }
              const res = await DefaultService.postApiTask({
                domain: domain.name,
                interval: "0",
              });
              if (res === "ok") {
                refetchAllDomains.fn();
                toast("Request has been sent.", {
                  description: `on ${domain.name}`,
                  icon: <CircleCheck className="px-0.5" />,
                });
                return;
              }
              toast("Error: " + res, {
                description: `${domain.name} on ${domain.ip}`,
                icon: <Ban />,
              });
            }}
          >
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateIpButton;
