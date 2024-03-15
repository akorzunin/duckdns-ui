import { ScrollArea } from "../shadcn/ui/scroll-area";
import DomainCard from "./DomainCard";

const tags = Array.from({ length: 50 }).map((_, i, a) => {
  return {
    name: `test.${a.length - i}.domain`,
    ip: `127.0.0.${a.length - i}`,
  };
});

const DomainList = () => {
  return (
    <ScrollArea className="h-[70vh] rounded-md border">
      <div className="p-4">
        {tags.map((tag) => (
          <DomainCard tag={tag} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default DomainList;
