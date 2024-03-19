import { FC } from "react";
import { Domain } from "../api/client";
import { ScrollArea } from "../shadcn/ui/scroll-area";
import DomainCard from "./DomainCard";

interface IDomainList {
  domains: Domain[] | undefined;
}
const DomainList: FC<IDomainList> = ({ domains }) => {
  return (
    <ScrollArea className="h-[70vh] rounded-md border">
      {domains && (
        <div className="flex flex-col gap-4 p-4">
          {domains.map((domain) => (
            <DomainCard name={domain.name} ip={domain.ip} key={domain.name} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default DomainList;
