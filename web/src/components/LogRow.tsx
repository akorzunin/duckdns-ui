import { FC } from "react";
import { DbTaskLog } from "../api/client";
import dayjs from "dayjs";
import { Separator } from "../shadcn/ui/separator";

interface ILogRow {
  taskLog: DbTaskLog;
}
const LogRow: FC<ILogRow> = ({ taskLog }) => {
  const parseLogTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return "--:--:--";
    const date = dayjs(timestamp);
    return date.format("YYYY-MM-DD HH:mm");
  };
  function formatInterval(intervalString: string) {
    let formatted = "";
    let parts = intervalString.split("h");
    if (parts.length > 1) {
      formatted += parts[0] + "h ";
      parts = parts[1].split("m");
      if (parts.length > 1) {
        formatted += parts[0] + "m ";
        parts = parts[1].split("s");
        if (parts.length > 1) {
          formatted += parts[0] + "s";
        }
      }
    } else {
      // If the input is just seconds, e.g., "1s"
      formatted = intervalString;
    }
    return formatted.trim();
  }
  const parseLogInterval = (interval: string | undefined) => {
    if (!interval || interval === "0s") return "--";
    return formatInterval(interval);
  };
  return (
    <div>
      <div className="grid grid-cols-4 gap-x-2">
        <div>{parseLogTimestamp(taskLog.timestamp)}</div>
        <div>{parseLogInterval(taskLog.interval)}</div>
        <div>{taskLog.ip}</div>
        <div>{taskLog.message}</div>
      </div>
      <Separator />
    </div>
  );
};

export default LogRow;
