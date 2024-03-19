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

const DeleteDomainButton = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="flex gap-2">
          <Trash2 className="p-0.5" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete data about this domain?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete domain
            entry from db and corresponding task if if exist.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDomainButton;
