import { FC } from "react";
import { Domain } from "../api/client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn/ui/card";
import DeleteDomainButton from "./buttons/DeleteDomainButton";
import EditDomainButton from "./buttons/EditDomainButton";
import AddTaskButton from "./buttons/AddTaskButton";

const DomainCard: FC<Domain> = ({ name, ip }) => {
  return (
    <>
      <Card className="px-4">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{ip || "no ip"}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <div className="flex gap-4">
            <AddTaskButton />
            <EditDomainButton />
          </div>
          <DeleteDomainButton />
        </CardFooter>
      </Card>
    </>
  );
};

export default DomainCard;
