import { FileText } from "lucide-react";
import { Button } from "../../shadcn/ui/button";
import { taskIconSize } from "../TaskCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/ui/popover";
import { DefaultService, Domain } from "../../api/client";
import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "../../shadcn/ui/scroll-area";

interface ILogViewButton {
  domain: Domain;
}
const LogViewButton: FC<ILogViewButton> = ({ domain }) => {
  const { data: taskLogsData, refetch } = useQuery({
    queryKey: ["logs", domain],
    queryFn: async () => {
      const res = await DefaultService.getApiTaskLogs(domain.name);
      return res;
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex gap-2">
          <FileText size={taskIconSize} />
          Logs
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Task logs for <b>{domain.name}</b>
            </h4>
            <ScrollArea className="h-[40vh] rounded-md border">
              {taskLogsData && (
                <div className="flex flex-col gap-4 p-4">
                  {taskLogsData.map((taskLog) => (
                    <div>
                      {taskLog.domain}
                      <div>{taskLog.ip}</div>
                      <div>{taskLog.interval}</div>
                      <div>{taskLog.timestamp}</div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LogViewButton;
