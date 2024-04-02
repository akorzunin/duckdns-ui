import { FC } from "react";
import { DefaultService, Domain } from "../api/client";
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
import { useQuery } from "@tanstack/react-query";
import TaskCard from "./TaskCard";
import UpdateIpButton from "./buttons/UpdateIpButton";
import { atom, useSetAtom } from "jotai";
import LogViewButton from "./LogViewCard";

export interface IrefetchDomainTask {
  fn: () => void;
}
export const refetchDomainTaskAtom = atom<IrefetchDomainTask>({
  fn: async () => {},
});
interface IDomainCard {
  domain: Domain;
}
const DomainCard: FC<IDomainCard> = ({ domain }) => {
  const {
    status: taskQueryStatus,
    data: taskData,
    refetch: refetchDomainTask,
  } = useQuery({
    queryKey: ["task", domain.name],
    queryFn: async () => {
      const res = await DefaultService.getApiTask(domain.name);
      return res;
    },
    retry: false,
  });
  const setRefetchDomainTask = useSetAtom(refetchDomainTaskAtom);
  setRefetchDomainTask({ fn: refetchDomainTask });
  return (
    <Card className="px-4">
      <CardHeader>
        <CardTitle>{domain.name}</CardTitle>
        <CardDescription>{domain.ip || "no ip"}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="grid grid-cols-1 gap-4 sm:flex">
          {taskQueryStatus === "success" ? (
            <TaskCard task={taskData} refetch={refetchDomainTask} />
          ) : (
            <AddTaskButton
              domainName={domain.name}
              refetch={refetchDomainTask}
            />
          )}
          <LogViewButton domain={domain} />
          <EditDomainButton domain={domain} />
          <UpdateIpButton domain={domain} />
        </div>
        <DeleteDomainButton domainName={domain.name} />
      </CardFooter>
    </Card>
  );
};

export default DomainCard;
