import { RefreshCcw, Trash2 } from "lucide-react";
import { DefaultService, Domain } from "../api/client";
import { Button } from "../shadcn/ui/button";
import { taskIconSize } from "./TaskCard";
import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn/ui/tooltip";
interface ILogViewPanel {
  domain: Domain;
  refetch: () => void;
}
const LogViewPanel: FC<ILogViewPanel> = ({ domain, refetch }) => {
  return (
    <div className="flex items-center justify-between">
      <h4 className="font-medium leading-none">
        Task logs for <b>{domain.name}</b>
      </h4>
      <div className="flex gap-2">
        <TooltipProvider>
          {/* for some reason first tooltip is always triggered so i desided to this */}
          <Tooltip open={false}>
            <TooltipTrigger></TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCcw size={taskIconSize} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh task logs</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="outline"
                onClick={async () => {
                  await DefaultService.deleteApiTaskLogs(domain.name);
                  refetch();
                }}
              >
                <Trash2 size={taskIconSize} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete task logs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default LogViewPanel;
