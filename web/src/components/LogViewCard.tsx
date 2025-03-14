import { ChevronsLeft, ChevronsRight, FileText } from "lucide-react";
import { Button } from "../shadcn/ui/button";
import { taskIconSize } from "./TaskCard";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";
import { DefaultService, Domain } from "../api/client";
import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "../shadcn/ui/scroll-area";
import LogViewPanel from "./LogViewPanel";
import LogRow from "./LogRow";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "../shadcn/ui/pagination";

interface ILogViewButton {
  domain: Domain;
}
const LogViewButton: FC<ILogViewButton> = ({ domain }) => {
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const { data: taskLogsData, refetch } = useQuery({
    queryKey: ["logs", domain, limit, offset],
    queryFn: async () => {
      const res = await DefaultService.getApiTaskLogs(
        domain.name,
        limit,
        offset,
      );
      return res;
    },
  });
  const totalPages = Math.ceil((taskLogsData?.total || 0) / limit);
  const currentPage = Math.ceil(offset / limit) + 1;
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
      <PopoverContent className="w-[50vw]">
        <div className="grid gap-4">
          <LogViewPanel domain={domain} refetch={refetch} />
          <ScrollArea className="h-[40vh] min-w-[40vw] max-w-[50vw] rounded-md border">
            {taskLogsData ? (
              <div className="flex flex-col gap-1 p-4">
                {taskLogsData.logs?.map((taskLog) => (
                  <LogRow key={taskLog.timestamp} taskLog={taskLog} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center pt-4">
                <p>No data</p>
              </div>
            )}
          </ScrollArea>
          <Pagination className="flex justify-center">
            <PaginationContent className="flex gap-2">
              <PaginationItem>
                <PaginationLink
                  aria-label="Go to first page"
                  size="default"
                  onClick={() => setOffset(0)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer select-none"
                  onClick={() => setOffset(Math.max(offset - limit, 0))}
                />
              </PaginationItem>
              <PaginationItem>
                {currentPage}/{totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer select-none"
                  onClick={() => {
                    const total = taskLogsData?.total || 0;
                    setOffset(
                      Math.min(offset + limit, total - (total % limit)),
                    );
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  aria-label="Go to last page"
                  size="default"
                  onClick={() => {
                    const total = taskLogsData?.total || 0;
                    setOffset(total - (total % limit));
                  }}
                >
                  <ChevronsRight className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LogViewButton;
