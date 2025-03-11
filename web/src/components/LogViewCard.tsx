import { FileText } from "lucide-react";
import { Button } from "../shadcn/ui/button";
import { taskIconSize } from "./TaskCard";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";
import { DefaultService, Domain } from "../api/client";
import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "../shadcn/ui/scroll-area";
import LogViewPanel from "./LogViewPanel";
import LogRow from "./LogRow";

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
        <Button
          variant="outline"
          className="flex gap-2"
          disabled={!taskLogsData}
        >
          <FileText size={taskIconSize} />
          Logs
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="grid gap-4">
          <LogViewPanel domain={domain} refetch={refetch} />
          <ScrollArea className="h-[40vh] min-w-[20vw] max-w-[50vw] rounded-md border">
            {taskLogsData ? (
              <div className="flex flex-col-reverse gap-1 p-4">
                {taskLogsData.map((taskLog) => (
                  <LogRow key={taskLog.timestamp} taskLog={taskLog} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center pt-4">
                <p>No data</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LogViewButton;
