import { FC } from "react";
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
import { Trash2 } from "lucide-react";
import { DefaultService } from "../../api/client";
import { refetchAllDomainsAtom } from "../../pages/MainPage";
import { useAtomValue } from "jotai";
interface IDeleteDomainButton {
  domainName: string;
}
const DeleteDomainButton: FC<IDeleteDomainButton> = ({
  domainName: domain,
}) => {
  const refetchAllDomains = useAtomValue(refetchAllDomainsAtom);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <Trash2 className="p-0.5" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete domain {domain}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete domain
            entry from db and corresponding task if if exist.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const res = await DefaultService.deleteApiDomain(domain);
              if (res === "ok") {
                refetchAllDomains.fn();
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDomainButton;
