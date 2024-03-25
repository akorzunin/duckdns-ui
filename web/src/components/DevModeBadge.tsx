import { useQuery } from "@tanstack/react-query";
import { cn } from "../lib/utils";
import { DefaultService } from "../api/client";
import { atom, useSetAtom } from "jotai";

export const isDevModeAtom = atom(false);

interface IDevMode {
  devMode: boolean;
}

const DevModeBadge = () => {
  const setIsDevMode = useSetAtom(isDevModeAtom);
  const { data: isDevMode } = useQuery({
    queryKey: ["devmode"],
    queryFn: async () => {
      const res = await DefaultService.getDevmode();
      const data = JSON.parse(res) as IDevMode;
      return data.devMode;
    },
  });
  setIsDevMode(isDevMode || false);
  return (
    <div
      className={cn(
        "rounded-md bg-amber-500 px-2 py-1 font-bold",
        !isDevMode && "hidden",
      )}
    >
      DEV MODE
    </div>
  );
};

export default DevModeBadge;
