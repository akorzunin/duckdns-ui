import { Separator } from "../shadcn/ui/separator";

const DomainCard = ({ tag }) => {
  return (
    <>
      <div key={tag.name} className="text-sm">
        {tag.name}
      </div>
      <Separator className="my-2" />
    </>
  );
};

export default DomainCard;
