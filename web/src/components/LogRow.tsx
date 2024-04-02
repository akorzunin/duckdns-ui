import { FC } from "react";
import { DbTaskLog } from "../api/client";

interface ILogRow {
  taskLog: DbTaskLog;
}
const LogRow: FC<ILogRow> = ({ taskLog }) => {
  const parseLogTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return "--:--:--";
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    const offset = date.getTimezoneOffset();
    return `${hours}:${minutes}:${seconds}:${milliseconds} ${offset}`;
  };
  const parseLogInterval = (interval) => {
    if (!interval || interval === "0s") return "--";
    return interval;
  };
  return (
    <div className="flex gap-x-2">
      <div>{taskLog.domain}</div>
      <div>{taskLog.ip}</div>
      <div>{parseLogInterval(taskLog.interval)}</div>
      <div>{parseLogTimestamp(taskLog.timestamp)}</div>
    </div>
  );
};

export default LogRow;
