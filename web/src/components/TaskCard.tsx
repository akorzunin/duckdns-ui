import { FC } from "react";
import { DefaultService, Task } from "../api/client";
import { Button } from "../shadcn/ui/button";
import { CircleX, FileText, IterationCw } from "lucide-react";
import { Separator } from "../shadcn/ui/separator";

const taskIConSize = 18;

interface ITaskCard {
  task: Task;
  refetch: () => void;
}
const TaskCard: FC<ITaskCard> = ({ task, refetch }) => {
  return (
    <div className="inline-flex h-9 items-center justify-center rounded-md border border-neutral-200 py-2">
      <div className="flex items-center gap-2 px-4">
        <IterationCw size={taskIConSize} />
        {task.interval}
      </div>
      <Separator orientation="vertical" />
      {/* TODO: TaskStopButton w/ action dialog */}
      <Button
        variant="ghost"
        className="flex gap-2"
        onClick={async () => {
          const res = await DefaultService.deleteApiTask(task.domain);
          if (res === "ok") {
            refetch();
          }
        }}
      >
        <CircleX size={taskIConSize} />
        Stop
      </Button>
      <Separator orientation="vertical" />
      <Button variant="ghost" className="flex gap-2" disabled>
        <FileText size={taskIConSize} />
        Logs
      </Button>
    </div>
  );
};

export default TaskCard;
