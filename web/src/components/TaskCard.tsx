import { FC } from "react";
import { DefaultService, Task } from "../api/client";
import { Button } from "../shadcn/ui/button";
import { CircleX, IterationCw } from "lucide-react";
import { Separator } from "../shadcn/ui/separator";

export const taskIconSize = 18;

interface ITaskCard {
  task: Task;
  refetch: () => void;
}
const TaskCard: FC<ITaskCard> = ({ task, refetch }) => {
  return (
    <div className="inline-flex h-9 items-center justify-center rounded-md border border-neutral-200 py-2">
      <div className="flex items-center gap-2 px-4">
        <IterationCw size={taskIconSize} />
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
        <CircleX size={taskIconSize} />
        Stop
      </Button>
    </div>
  );
};

export default TaskCard;
